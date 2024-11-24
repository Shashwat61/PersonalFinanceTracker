import { Request, Response } from 'express';
import services from '@services/index';

const signUp = async (req: Request, res: Response) => {
  const redirectURL = services.authService.signup();
  res.redirect(redirectURL);
};

const signIn = async (req: Request, res: Response) => {
  try {
    console.log('here in signin');
    const { error, code } = req.query;
    if (error) throw new Error(error as string);
    const userProfileData = await services.authService.signIn(
      code as string,
      res,
    );
    console.log('===========here in signin redirecting', userProfileData);
    // if user profile data successful, then redirect to /app
    res.redirect('/app');
  } catch (error) {
    console.log((error as Error).message);
    res.redirect(`/signin?error=${(error as Error).message}`);
  }
};

const logout = async (req: Request, res: Response) => {
  try{
    console.log(req.cookies, 'cookies');
    await services.authService.logout(res);
    console.log(req.headers.cookie, '========cookies in logout');
    res.status(204)
  }
  catch(error){
    console.log((error as Error).message);
    res.status(500).json({message: (error as Error).message});
  }
}
export default {
  signUp,
  signIn,
  logout,
};
