import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Nutrition from 'pages/Nutrition';
import RecipeDetail from 'pages/Nutrition/details';

const NutritionRoutes: React.FC = () => (
  <Switch>
    <Route exact path="/nutrition" component={Nutrition} />
    <Route exact path="/nutrition/recipes/:id" component={RecipeDetail} />
    <Redirect to="/nutrition" />
  </Switch>
);

export default NutritionRoutes;
