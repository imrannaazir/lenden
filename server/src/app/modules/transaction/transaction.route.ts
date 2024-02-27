import { Router } from 'express';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import TransactionController from './transaction.controller';
import { transactionMoneyValidationSchema } from './transaction.validation';

const router = Router();

// send money : POST : user
router.post(
  '/send-money',
  auth('user'),
  validateRequest(transactionMoneyValidationSchema),
  TransactionController.sendMoney,
);
// cash out : POST : user
router.post(
  '/cash-out',
  auth('user'),
  validateRequest(transactionMoneyValidationSchema),
  TransactionController.cashOut,
);

// cash in : POST : agent
router.post(
  '/cash-in',
  auth('agent'),
  validateRequest(transactionMoneyValidationSchema),
  TransactionController.cashIn,
);

const TransactionRoute = router;

export default TransactionRoute;
