import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Login from 'pages/Auth/Login';
import Register from 'pages/Auth/Register';
import ResetPassword from 'pages/Auth/ResetPassword';
import AuthLayout from 'layouts/AuthLayout';
import StartPage from 'pages/Auth/Start';
import PrivateRoute from 'routes/privateRoute';
import ProfileWizard from 'pages/ProfileWizard';
import LoginOverview from 'pages/Auth/LoginOverview';

const AuthRoutes = () => (
  <AuthLayout isBackImage>
    <Switch>
      <Route exact path="/auth" component={StartPage} />
      <Route exact path="/auth/choose-login" component={LoginOverview} />
      <Route exact path="/auth/login" component={Login} />
      <Route exact path="/auth/register" component={Register} />
      <Route exact path="/auth/register/:id" component={Register} />
      <Route exact path="/auth/reset-password" component={ResetPassword} />
      <PrivateRoute exact path="/auth/profile-wizard" component={ProfileWizard} />
      <Redirect to="/auth" from="/auth" />
    </Switch>
  </AuthLayout>
);

export default AuthRoutes;
