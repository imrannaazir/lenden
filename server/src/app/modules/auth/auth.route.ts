import { Router } from 'express';
import AuthController from './auth.controller';
import validateRequest from '../../middleware/validateRequest';
import {
  loginValidationSchema,
  registrationValidationSchema,
} from './auth.validation';
import auth from '../../middleware/auth';

const router = Router();
// register user : POST
router.post(
  '/register',
  validateRequest(registrationValidationSchema),
  AuthController.registerUser,
);

// login user : POST
router.post(
  '/login',
  validateRequest(loginValidationSchema),
  AuthController.loginUser,
);

// logout user : PATCH
router.patch(
  '/logout',
  auth('admin', 'agent', 'user'),
  AuthController.logoutUser,
);
const AuthRoute = router;
export default AuthRoute;
