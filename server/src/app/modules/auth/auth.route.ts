import { Router } from 'express';
import AuthController from './auth.controller';
import validateRequest from '../../middleware/validateRequest';
import { registrationValidationSchema } from './auth.validation';

const router = Router();
// register user : POST
router.post(
  '/register',
  validateRequest(registrationValidationSchema),
  AuthController.registerUser,
);
const AuthRoute = router;
export default AuthRoute;
