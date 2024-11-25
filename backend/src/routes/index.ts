import express, { NextFunction, Request, Response } from 'express';
const router = express.Router();
import { authMiddleware } from '@middlewares';

import apiRoutes from './api.routes';

router.use('/api', apiRoutes);

router.get(
  '/',
  authMiddleware.checkForUserSession,
  (req: Request, res: Response) => {
    if (res.locals.userInfo) {
      res.redirect('/app');
    } else res.render('homepage');

  },
);

router.get(
  '/signin',
  authMiddleware.checkForUserSession,
  (req: Request, res: Response) => {
    console.log(req.url, req.route.path, 'after middleware');
    if (res.locals.userInfo) {
      res.redirect('/app');
    } else if(req.query.error){
      res.render('signin', { error: req.query.error });
    } else {
      console.log('rendering signin page')
      res.render('signin')
    };
  },
);

router.get('/privacy_policy', (req, res) => {
  res.render('privacy_policy');
})

router.get('/app', authMiddleware.checkForUserSession, (req: Request, res: Response, next: NextFunction)=>{
  if(!res.locals.userInfo){
    res.redirect('/signin');
  }else {
    next()
  }
  // res.redirect('http://localhost:5173/app');
});

router.get('/app/*', authMiddleware.checkForUserSession, (req: Request, res: Response, next: NextFunction)=>{
  if(!res.locals.userInfo){
    res.redirect('/signin');
  }else {
    next()
  }
  // res.redirect('http://localhost:5173/app');
});


router.use('/app', express.static('dist'));
router.use('/app/*', express.static('dist'));

export default router;
