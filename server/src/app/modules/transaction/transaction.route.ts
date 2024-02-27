import { Router } from 'express';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { sendMoneyValidationSchema } from './transaction.validation';
import TransactionController from './transaction.controller';

const router = Router();

// send money : POST : user
router.post(
  '/send-money',
  auth('user'),
  validateRequest(sendMoneyValidationSchema),
  TransactionController.sendMoney,
);

const TransactionRoute = router;

export default TransactionRoute;
