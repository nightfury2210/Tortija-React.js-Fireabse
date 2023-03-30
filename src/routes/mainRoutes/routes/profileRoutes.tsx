import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Profile from 'pages/Profile';
import FaqRoutes from './faqRoutes';

const ProfileRoutes: React.FC = () => (
  <Switch>
    <Route exact path="/profile" component={Profile} />
    <Route path="/profile/faq" component={FaqRoutes} />
    <Redirect to="/profile" />
  </Switch>
);

export default ProfileRoutes;
