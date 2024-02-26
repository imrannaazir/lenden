import { Router } from 'express';
import AuthRoute from '../modules/auth/auth.route';

type TRoute = {
  path: string;
  route: Router;
};
const routes: TRoute[] = [
  {
    path: '/auth',
    route: AuthRoute,
  },
];

const router = Router();
routes.forEach((route) => router.use(route.path, route.route));

export default router;
