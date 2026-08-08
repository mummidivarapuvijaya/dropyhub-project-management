const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Get dashboard metrics & visual stats
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
  try {
    let projectFilter = {};
    let taskFilter = {};

    // Filter metrics if user is Team Member
    if (req.user.role === 'Team Member') {
      const userProjects = await Project.find({
        $or: [{ teamMembers: req.user._id }, { manager: req.user._id }]
      }).select('_id');

      const projectIds = userProjects.map((p) => p._id);
      projectFilter = { _id: { $in: projectIds } };
      taskFilter = {
        $or: [
          { assignedTo: req.user._id },
          { createdBy: req.user._id },
          { project: { $in: projectIds } }
        ]
      };
    }

    // Consolidated metrics aggregations
    const [
      totalProjects,
      activeProjects,
      completedProjects,
      pendingTasks,
      completedTasks,
      totalTeamMembers,
      projectStatusBreakdown,
      taskPriorityBreakdown
    ] = await Promise.all([
      Project.countDocuments(projectFilter),
      Project.countDocuments({ ...projectFilter, status: 'Active' }),
      Project.countDocuments({ ...projectFilter, status: 'Completed' }),
      Task.countDocuments({
        ...taskFilter,
        status: { $in: ['Pending', 'In Progress', 'In Review'] }
      }),
      Task.countDocuments({ ...taskFilter, status: 'Completed' }),
      User.countDocuments(),
      Project.aggregate([
        { $match: projectFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Task.aggregate([
        { $match: taskFilter },
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ])
    ]);

    // Fetch top 5 recent active projects
    const recentProjects = await Project.find(projectFilter)
      .populate('manager', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(5);

    // Fetch top 5 upcoming tasks
    const recentTasks = await Task.find(taskFilter)
      .populate('project', 'title')
      .populate('assignedTo', 'name avatar')
      .sort({ dueDate: 1, createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalProjects,
        activeProjects,
        completedProjects,
        pendingTasks,
        completedTasks,
        totalTeamMembers
      },
      charts: {
        projectStatus: projectStatusBreakdown.map((item) => ({
          name: item._id,
          value: item.count
        })),
        taskPriority: taskPriorityBreakdown.map((item) => ({
          name: item._id,
          value: item.count
        }))
      },
      recentProjects,
      recentTasks
    });
  } catch (err) {
    next(err);
  }
};
