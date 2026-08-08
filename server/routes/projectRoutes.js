const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  updateProjectMembers
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All project routes require auth

router
  .route('/')
  .get(getProjects)
  .post(authorize('Admin', 'Project Manager'), createProject);

router
  .route('/:id')
  .get(getProject)
  .put(authorize('Admin', 'Project Manager'), updateProject)
  .delete(authorize('Admin', 'Project Manager'), deleteProject);

router
  .route('/:id/members')
  .put(authorize('Admin', 'Project Manager'), updateProjectMembers);

module.exports = router;
