import express, { Request, Response } from 'express';
const router = express.Router();

import controllers from '@controllers';
import { authMiddleware } from '@middlewares';

import apiRoutes from './api.routes';

router.use('/api', apiRoutes);

router.get(
  '/',
  authMiddleware.checkForUserSession,
  controllers.rootRouteController,
);

router.get(
  '/signin',
  authMiddleware.checkForUserSession,
  (req: Request, res: Response) => {
    console.log(req.url, req.route.path, 'after middleware');
    if (res.locals.user) {
      res.redirect('/app');
    } else res.render('signin');
  },
);

router.get('/privacy_policy', (req, res) => {
  res.render('privacy_policy');
})

router.get('/app', authMiddleware.checkForUserSession, (req, res) => {
  // get the build of react and send that.
  res.redirect('http://localhost:5173');
});

export default router;
