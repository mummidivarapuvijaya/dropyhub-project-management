const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { OAuth2Client } = require('google-auth-library');

// Helper to send JWT token response with user object
const sendTokenResponse = (user, statusCode, res, message) => {
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    message: message || 'Success',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    }
  });
};

// @desc    Register user (Public registration ALWAYS receives Team Member role)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email, and password'
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email already exists'
      });
    }

    // STRICT ROLE CONTROL: Public registration ALWAYS assigns 'Team Member'
    // Ignore any role provided by the request payload
    const userRole = 'Team Member';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: userRole,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
    });

    sendTokenResponse(user, 201, res, 'User registered successfully');
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    sendTokenResponse(user, 200, res, 'Logged in successfully');
  } catch (err) {
    next(err);
  }
};

// @desc    Google OAuth 2.0 Login / Register
// @route   POST /api/auth/google
// @access  Public
exports.googleLogin = async (req, res, next) => {
  try {
    const { credential, access_token, id_token } = req.body;
    const tokenToVerify = credential || id_token;

    let email = '';
    let name = '';
    let googleId = '';
    let picture = '';

    if (tokenToVerify) {
      // Verify Google ID Token using OAuth2Client
      const googleClientId = process.env.GOOGLE_CLIENT_ID;
      const client = new OAuth2Client(googleClientId);

      try {
        const ticket = await client.verifyIdToken({
          idToken: tokenToVerify,
          audience: googleClientId
        });
        const payload = ticket.getPayload();
        email = payload.email;
        name = payload.name;
        googleId = payload.sub;
        picture = payload.picture;
      } catch (verifyErr) {
        console.error('Google ID token verification error:', verifyErr.message);
        return res.status(400).json({
          success: false,
          error: 'Google authentication failed. Invalid token.'
        });
      }
    } else if (access_token) {
      // Fetch user profile from Google UserInfo endpoint using access_token
      try {
        const fetch = (await import('node-fetch')).default || globalThis.fetch;
        const resProfile = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${access_token}` }
        });
        const profile = await resProfile.json();
        email = profile.email;
        name = profile.name;
        googleId = profile.sub;
        picture = profile.picture;
      } catch (fetchErr) {
        console.error('Google UserInfo fetch error:', fetchErr.message);
        return res.status(400).json({
          success: false,
          error: 'Failed to retrieve Google user profile'
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        error: 'No Google credential provided'
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Unable to extract email from Google Account'
      });
    }

    // Check if user already exists in database
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      // Existing user: Link googleId if missing, PRESERVE existing database role
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      // New Google User: Automatically assign role = 'Team Member'
      user = await User.create({
        name: name || 'Google User',
        email: email.toLowerCase(),
        googleId,
        avatar: picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
        role: 'Team Member'
      });
    }

    sendTokenResponse(user, 200, res, 'Google Sign-In successful');
  } catch (err) {
    next(err);
  }
};

// @desc    Forgot Password - Send reset email
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an email address'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'There is no account associated with this email address'
      });
    }

    // Generate secure random reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Construct reset URL for React frontend
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) requested a password reset for your DropyHub account.\n\nPlease click the link below or paste it into your browser to complete the process:\n\n${resetUrl}\n\nThis link will expire in 10 minutes.\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
        <h2 style="color: #4f46e5; margin-bottom: 16px;">DropyHub Password Reset</h2>
        <p style="color: #334155; line-height: 1.5;">You requested a password reset for your DropyHub account.</p>
        <div style="margin: 24px 0;">
          <a href="${resetUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #64748b; font-size: 13px;">This link expires in <strong>10 minutes</strong>.</p>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">If you did not request a password reset, please ignore this email.</p>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'DropyHub Account Password Reset',
        message,
        html
      });

      res.status(200).json({
        success: true,
        message: 'Password reset link has been sent to your email address',
        resetToken
      });
    } catch (err) {
      console.error('Nodemailer send email error:', err.message);

      // Return token so user can reset password immediately even if SMTP fails or is unconfigured on Render
      return res.status(200).json({
        success: true,
        message: 'Password reset link generated successfully',
        resetToken
      });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Reset Password with token
// @route   POST /api/auth/reset-password/:resetToken
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a new password with at least 6 characters'
      });
    }

    // Hash the reset token parameter to compare with stored token hash
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired password reset token'
      });
    }

    // Set new password (bcrypt pre-save hook will hash it)
    user.password = password;
    // Invalidate reset token so it cannot be reused
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res, 'Password reset successful. You can now sign in with your new password.');
  } catch (err) {
    next(err);
  }
};

// @desc    Get currently authenticated user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user
    });
  } catch (err) {
    next(err);
  }
};
