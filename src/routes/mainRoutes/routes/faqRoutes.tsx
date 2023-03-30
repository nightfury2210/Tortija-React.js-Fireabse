import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { FaqProvider } from 'providers/FaqProvider';
import FaqList from 'pages/Faq';
import FaqDetails from 'pages/Faq/Detail';

const FaqRoutes: React.FC = () => (
  <FaqProvider>
    <Switch>
      <Route path="/profile/faq" exact component={FaqList} />
      <Route path="/profile/faq/:id" exact component={FaqDetails} />
      <Redirect to="/profile/faq" />
    </Switch>
  </FaqProvider>
);

export default FaqRoutes;
