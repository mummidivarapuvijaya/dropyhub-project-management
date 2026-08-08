const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get all tasks (Search, Filter, Pagination)
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    let query = {};

    // RBAC check: Team Members can only see tasks assigned to them or in projects they belong to
    if (req.user.role === 'Team Member') {
      const userProjects = await Project.find({
        $or: [{ teamMembers: req.user._id }, { manager: req.user._id }]
      }).select('_id');

      const projectIds = userProjects.map((p) => p._id);

      query.$or = [
        { assignedTo: req.user._id },
        { createdBy: req.user._id },
        { project: { $in: projectIds } }
      ];
    }

    // Filter by project
    if (req.query.project) {
      query.project = req.query.project;
    }

    // Filter by status
    if (req.query.status && req.query.status !== 'All') {
      query.status = req.query.status;
    }

    // Filter by priority
    if (req.query.priority && req.query.priority !== 'All') {
      query.priority = req.query.priority;
    }

    // Filter by assignee
    if (req.query.assignedTo) {
      query.assignedTo = req.query.assignedTo;
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

    const total = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .populate('project', 'title status manager')
      .populate('assignedTo', 'name email avatar role')
      .populate('createdBy', 'name email avatar role')
      .sort({ dueDate: 1, createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const pages = Math.ceil(total / limit) || 1;

    res.status(200).json({
      success: true,
      count: tasks.length,
      total,
      pages,
      currentPage: page,
      data: tasks
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'title status manager teamMembers')
      .populate('assignedTo', 'name email avatar role')
      .populate('createdBy', 'name email avatar role');

    if (!task) {
      return res.status(404).json({
        success: false,
        error: `Task not found with id of ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private (Admin, Project Manager, or assigned Team Member)
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, project, assignedTo, status, priority, dueDate } = req.body;

    if (!title || !project) {
      return res.status(400).json({
        success: false,
        error: 'Please provide task title and project'
      });
    }

    // Verify project exists
    const proj = await Project.findById(project);
    if (!proj) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
      status: status || 'Pending',
      priority: priority || 'Medium',
      dueDate
    });

    const populatedTask = await Task.findById(task._id)
      .populate('project', 'title status')
      .populate('assignedTo', 'name email avatar role')
      .populate('createdBy', 'name email avatar role');

    res.status(201).json({
      success: true,
      data: populatedTask,
      message: 'Task created successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: `Task not found with id of ${req.params.id}`
      });
    }

    // Permissions: Admin / PM or Task creator / Assignee can update
    const isAssignee = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();
    const isCreator = task.createdBy.toString() === req.user._id.toString();
    const isAuthorizedRole = ['Admin', 'Project Manager'].includes(req.user.role);

    if (!isAuthorizedRole && !isAssignee && !isCreator) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this task'
      });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('project', 'title status')
      .populate('assignedTo', 'name email avatar role')
      .populate('createdBy', 'name email avatar role');

    res.status(200).json({
      success: true,
      data: task,
      message: 'Task updated successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Quick update task status
// @route   PATCH /api/tasks/:id/status
// @access  Private
exports.updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Pending', 'In Progress', 'In Review', 'Completed'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`
      });
    }

    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: `Task not found with id of ${req.params.id}`
      });
    }

    task.status = status;
    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('project', 'title status')
      .populate('assignedTo', 'name email avatar role')
      .populate('createdBy', 'name email avatar role');

    res.status(200).json({
      success: true,
      data: updatedTask,
      message: `Task status updated to ${status}`
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (Admin, Project Manager, or Creator)
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: `Task not found with id of ${req.params.id}`
      });
    }

    const isCreator = task.createdBy.toString() === req.user._id.toString();
    const isAuthorizedRole = ['Admin', 'Project Manager'].includes(req.user.role);

    if (!isAuthorizedRole && !isCreator) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this task'
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Task deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};
