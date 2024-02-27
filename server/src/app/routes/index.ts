import { Router } from 'express';
import AuthRoute from '../modules/auth/auth.route';
import UserRoute from '../modules/user/user.route';
import TransactionRoute from '../modules/transaction/transaction.route';

type TRoute = {
  path: string;
  route: Router;
};
const routes: TRoute[] = [
  {
    path: '/auth',
    route: AuthRoute,
  },
  {
    path: '/user',
    route: UserRoute,
  },
  {
    path: '/transaction',
    route: TransactionRoute,
  },
];

const router = Router();
routes.forEach((route) => router.use(route.path, route.route));

export default router;
