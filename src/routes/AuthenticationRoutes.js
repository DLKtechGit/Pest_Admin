import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));
// const AuthRegister3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Register3')));
const Signin = Loadable(lazy(() => import('views/Login/Login')));
const ResetPassword = Loadable(lazy(() => import('views/Login/ResetPassword')));
const Forgot = Loadable(lazy(() => import('views/Login/Forgot')));
// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/',
      element: <Signin />
    },
    {
      path: '/register',
      element: <AuthLogin3 />
    },
    {
      path:'/reset-password/:randomString/:expirationTimestamp',
      element:<ResetPassword/>
    },{
      path:'/forgot',
      element:<Forgot/>
    }
  ]
};

export default AuthenticationRoutes;
