import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toast';

import AuthRoutes from 'routes/authRoutes';
import MainRoutes from 'routes/mainRoutes';
import PaymentDetails from 'pages/Purchase/payment';
import PrivateRoute from 'routes/privateRoute';
import PurchasePlan from 'pages/Purchase/plan';
import { AuthProvider } from 'providers/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Switch>
          <Route path="/auth" component={AuthRoutes} />
          <PrivateRoute exact path="/purchase" component={PurchasePlan} />
          <PrivateRoute path="/purchase/payment/:type" component={PaymentDetails} />
          <PrivateRoute path="/" component={MainRoutes} />
          <Redirect to="/" />
        </Switch>
      </BrowserRouter>
      <ToastContainer delay={3000} position="top-right" />
    </AuthProvider>
  );
}

export default App;
