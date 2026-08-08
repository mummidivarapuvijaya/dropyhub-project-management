const express = require('express');
const { getUsers, updateUserRole } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getUsers);
router.put('/:id/role', authorize('Admin'), updateUserRole);

module.exports = router;
