const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Get all projects (with Search, Filter, Pagination)
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    let query = {};

    // Filter by user role if Team Member: only show projects they are member of or managed
    if (req.user.role === 'Team Member') {
      query.$or = [{ teamMembers: req.user._id }, { manager: req.user._id }];
    }

    // Search query (title or description)
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      const searchQuery = {
        $or: [{ title: searchRegex }, { description: searchRegex }]
      };
      
      if (query.$or) {
        query = { $and: [{ $or: query.$or }, searchQuery] };
      } else {
        query = searchQuery;
      }
    }

    // Filter by status
    if (req.query.status && req.query.status !== 'All') {
      query.status = req.query.status;
    }

    // Filter by manager
    if (req.query.manager) {
      query.manager = req.query.manager;
    }

    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .populate('manager', 'name email avatar role')
      .populate('teamMembers', 'name email avatar role')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    // Calculate total pages
    const pages = Math.ceil(total / limit) || 1;

    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      pages,
      currentPage: page,
      data: projects
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('manager', 'name email avatar role')
      .populate('teamMembers', 'name email avatar role');

    if (!project) {
      return res.status(404).json({
        success: false,
        error: `Project not found with id of ${req.params.id}`
      });
    }

    // Count tasks for stats
    const totalTasks = await Task.countDocuments({ project: project._id });
    const completedTasks = await Task.countDocuments({
      project: project._id,
      status: 'Completed'
    });

    res.status(200).json({
      success: true,
      data: {
        ...project.toObject(),
        stats: {
          totalTasks,
          completedTasks,
          pendingTasks: totalTasks - completedTasks
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private (Admin, Project Manager)
exports.createProject = async (req, res, next) => {
  try {
    const { title, description, status, startDate, dueDate, teamMembers } = req.body;

    // Set manager to logged in user if not specified or unless Admin specifies another manager
    let manager = req.user._id;
    if (req.user.role === 'Admin' && req.body.manager) {
      manager = req.body.manager;
    }

    const project = await Project.create({
      title,
      description,
      status: status || 'Planned',
      startDate,
      dueDate,
      manager,
      teamMembers: teamMembers || []
    });

    const populatedProject = await Project.findById(project._id)
      .populate('manager', 'name email avatar role')
      .populate('teamMembers', 'name email avatar role');

    res.status(201).json({
      success: true,
      data: populatedProject,
      message: 'Project created successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin, Project Manager)
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: `Project not found with id of ${req.params.id}`
      });
    }

    // Authorization check: Admin can edit any, PM can only edit if manager or assigned
    if (
      req.user.role !== 'Admin' &&
      project.manager.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this project'
      });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('manager', 'name email avatar role')
      .populate('teamMembers', 'name email avatar role');

    res.status(200).json({
      success: true,
      data: project,
      message: 'Project updated successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin, Project Manager)
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: `Project not found with id of ${req.params.id}`
      });
    }

    // Check ownership/permissions
    if (
      req.user.role !== 'Admin' &&
      project.manager.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this project'
      });
    }

    // Delete associated tasks
    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Project and associated tasks deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Assign or Update team members of a project
// @route   PUT /api/projects/:id/members
// @access  Private (Admin, Project Manager)
exports.updateProjectMembers = async (req, res, next) => {
  try {
    const { teamMembers } = req.body; // Array of user IDs

    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: `Project not found with id of ${req.params.id}`
      });
    }

    if (
      req.user.role !== 'Admin' &&
      project.manager.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to manage members for this project'
      });
    }

    project.teamMembers = teamMembers;
    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('manager', 'name email avatar role')
      .populate('teamMembers', 'name email avatar role');

    res.status(200).json({
      success: true,
      data: updatedProject,
      message: 'Team members updated successfully'
    });
  } catch (err) {
    next(err);
  }
};
