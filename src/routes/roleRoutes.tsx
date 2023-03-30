import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Preloader from 'components/Preloader';
import { AuthContext } from 'providers/AuthProvider';

export default function RoleRoutes({ component: RouteComponent, path, ...rest }: any) {
  const { userData } = useContext(AuthContext);
  if (!userData) {
    return <Preloader />;
  }
  return (
    <Route
      {...rest}
      render={routeProps => (userData.role === 1 ? <RouteComponent {...routeProps} /> : <Redirect to="/" />)}
    />
  );
}
