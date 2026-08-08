// Seed script – idempotent version
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('Seeding Users with RBAC roles...');

    // Helper to find a user by email or create it
    const findOrCreateUser = async ({ email, ...rest }) => {
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({ email, ...rest });
      }
      return user;
    };

    let admin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (admin) {
      admin.name = process.env.ADMIN_NAME;
      admin.password = process.env.ADMIN_PASSWORD;
      admin.role = 'Admin';
      admin.avatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah';
      await admin.save();
    } else {
      admin = await User.create({
        name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'Admin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      });
    }

    let pm = await User.findOne({ email: process.env.PM_EMAIL });

    if (pm) {
      pm.name = process.env.PM_NAME;
      pm.password = process.env.PM_PASSWORD;
      pm.role = 'Project Manager';
      pm.avatar =
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex';

      await pm.save();
    } else {
      pm = await User.create({
        name: process.env.PM_NAME,
        email: process.env.PM_EMAIL,
        password: process.env.PM_PASSWORD,
        role: 'Project Manager',
        avatar:
          'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      });
    }

    const dev1 = await findOrCreateUser({
      name: 'Vijaya (Developer)',
      email: 'dev1@dropyhub.com',
      password: 'password123',
      role: 'Team Member',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    });

    const dev2 = await findOrCreateUser({
      name: 'Emily Watson (Designer)',
      email: 'dev2@dropyhub.com',
      password: 'password123',
      role: 'Team Member',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    });

    console.log('Seeding Sample Projects...');

    const findOrCreateProject = async (criteria, data) => {
      let project = await Project.findOne(criteria);
      if (!project) {
        project = await Project.create(data);
      }
      return project;
    };

    const project1 = await findOrCreateProject(
      { title: 'E-Commerce Platform Redesign' },
      {
        title: 'E-Commerce Platform Redesign',
        description:
          'Modernizing storefront UI, implementing payment gateway integration and microservice checkout.',
        status: 'Active',
        startDate: new Date('2026-07-01'),
        dueDate: new Date('2026-09-30'),
        manager: pm._id,
        teamMembers: [dev1._id, dev2._id],
      },
    );

    const project2 = await findOrCreateProject(
      { title: 'Mobile App React Native Migration' },
      {
        title: 'Mobile App React Native Migration',
        description:
          'Migrating legacy native iOS and Android modules to unified React Native architecture.',
        status: 'Planned',
        startDate: new Date('2026-08-15'),
        dueDate: new Date('2026-11-15'),
        manager: admin._id,
        teamMembers: [dev1._id],
      },
    );

    const project3 = await findOrCreateProject(
      { title: 'Cloud Infrastructure & DevOps Setup' },
      {
        title: 'Cloud Infrastructure & DevOps Setup',
        description:
          'AWS ECS Fargate deployment pipeline, Dockerization, monitoring dashboards, and CI/CD triggers.',
        status: 'Completed',
        startDate: new Date('2026-05-01'),
        dueDate: new Date('2026-07-15'),
        manager: pm._id,
        teamMembers: [dev2._id],
      },
    );

    console.log('Seeding Sample Tasks...');

    const findOrCreateTask = async (criteria, data) => {
      let task = await Task.findOne(criteria);
      if (!task) {
        task = await Task.create(data);
      }
      return task;
    };

    await findOrCreateTask(
      { title: 'Design Stripe & PayPal checkout modal UI', project: project1._id },
      {
        title: 'Design Stripe & PayPal checkout modal UI',
        description:
          'Create responsive payment layout in Figma and build JSX component.',
        project: project1._id,
        assignedTo: dev2._id,
        createdBy: pm._id,
        status: 'In Progress',
        priority: 'High',
        dueDate: new Date('2026-08-15'),
      },
    );

    await findOrCreateTask(
      { title: 'Implement JWT Auth & Refresh Tokens', project: project1._id },
      {
        title: 'Implement JWT Auth & Refresh Tokens',
        description:
          'Secure API routes with Bearer token authentication and role middleware.',
        project: project1._id,
        assignedTo: dev1._id,
        createdBy: pm._id,
        status: 'Completed',
        priority: 'Urgent',
        dueDate: new Date('2026-08-01'),
      },
    );

    await findOrCreateTask(
      { title: 'Configure MongoDB Replica Set & Indexing', project: project2._id },
      {
        title: 'Configure MongoDB Replica Set & Indexing',
        description:
          'Optimize compound index queries on projects and tasks collections.',
        project: project2._id,
        assignedTo: dev1._id,
        createdBy: admin._id,
        status: 'Pending',
        priority: 'Medium',
        dueDate: new Date('2026-08-25'),
      },
    );

    await findOrCreateTask(
      { title: 'Set up Grafana dashboards & CloudWatch alerts', project: project3._id },
      {
        title: 'Set up Grafana dashboards & CloudWatch alerts',
        description:
          'Monitor server CPU, memory, and API request latency spikes.',
        project: project3._id,
        assignedTo: dev2._id,
        createdBy: pm._id,
        status: 'Completed',
        priority: 'Low',
        dueDate: new Date('2026-07-10'),
      },
    );

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed Error:', err);
    process.exit(1);
  }
};

seedData();
