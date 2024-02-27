import { Router } from 'express';
import auth from '../../middleware/auth';
import UserController from './user.controller';

const router = Router();

// approve agent
router.patch('/approve-agent/:id', auth('admin'), UserController.approveAgent);

const UserRoute = router;
export default UserRoute;
