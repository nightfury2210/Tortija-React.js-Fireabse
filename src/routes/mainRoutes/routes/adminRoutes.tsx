import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Gym from 'pages/Admin/Gym';
import AddGym from 'pages/Admin/Gym/add';
import GymStatus from 'pages/Admin/Gym/status';

const AdminRoutes: React.FC = () => (
  <Switch>
    <Route exact path="/admin/gym" component={Gym} />
    <Route exact path="/admin/gym/add" component={AddGym} />
    <Route exact path="/admin/gym/status" component={GymStatus} />
  </Switch>
);

export default AdminRoutes;
