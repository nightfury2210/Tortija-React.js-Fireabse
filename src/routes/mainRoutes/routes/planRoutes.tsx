import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Plans from 'pages/Plans';
import PlanDetail from '../../../pages/Plans/details';
import PlanEdit from '../../../pages/Plans/edit';

const PlanRoutes: React.FC = () => (
  <Switch>
    <Route exact path="/plans" component={Plans} />
    <Route exact path="/plans/:id" component={PlanDetail} />
    <Route exact path="/plans/edit/:id" component={PlanEdit} />
    <Redirect to="/plans" />
  </Switch>
);

export default PlanRoutes;
