import { Router } from 'express';
import auth from '../../middleware/auth';
import UserController from './user.controller';

const router = Router();

// approve agent
router.patch('/approve-agent/:id', auth('admin'), UserController.approveAgent);

// block agent
router.patch('/block-user/:id', auth('admin'), UserController.blockUser);

// unblock user
router.patch('/unblock-user/:id', auth('admin'), UserController.unblockUser);

//get balance
router.get(
  '/get-balance',
  auth('admin', 'agent', 'user'),
  UserController.getBalance,
);
const UserRoute = router;
export default UserRoute;
