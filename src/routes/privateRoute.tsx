import React, { useContext, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Preloader from 'components/Preloader';
import { AuthContext } from 'providers/AuthProvider';
import firebase from 'services/firebase';

export default function PrivateRoute({ component: RouteComponent, path, ...rest }: any) {
  const { authenticated, loadingAuthState, user, setUserData } = useContext(AuthContext);

  useEffect(() => {
    const unsub = firebase
      .firestore()
      .collection('users')
      .doc(user?.uid)
      .onSnapshot(doc => {
        if (user?.uid) {
          if (!doc.data()) {
            firebase.auth().signOut();
          } else {
            setUserData(doc.data() as UserInfo);
          }
        }
      });
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (loadingAuthState) {
    return <Preloader />;
  }

  return (
    <Route
      {...rest}
      render={routeProps =>
        !authenticated ? (
          <Redirect to={{ pathname: '/auth', state: { prevPath: path } }} />
        ) : (
          <RouteComponent {...routeProps} />
        )
      }
    />
  );
}
