import React, { useContext } from 'react';
import moment from 'moment';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Headline from 'components/Headline';
import Home from 'pages/Dashboard';
import MainLayout from 'layouts/MainLayout';
import Preloader from 'components/Preloader';
import ShoppingList from 'pages/ShoppingList';
import { AuthContext } from 'providers/AuthProvider';
import { FilterProvider } from 'providers/FilterProvider';
import { MainProvider } from 'providers/MainProvider';
import { remainTrialDay } from 'shared/functions/global';
import RoleRoutes from '../roleRoutes';
import ProfileRoutes from './routes/profileRoutes';
import PlanRoutes from './routes/planRoutes';
import NutritionRoutes from './routes/nutritionRoutes';
import AdminRoutes from './routes/adminRoutes';

const MainRoutes: React.FC = () => {
  const { t } = useTranslation();
  const { userData } = useContext(AuthContext);

  if (!userData) {
    return <Preloader />;
  }
  if (!userData.profileComplete) {
    return <Redirect to="/auth/profile-wizard" />;
  }
  const remainDay = remainTrialDay(userData.created?.seconds);
  if (
    remainDay < 0 &&
    (userData.membership?.type === 'free' || !userData.membership || moment().isAfter(userData?.membership.nextDate))
  ) {
    return <Redirect to="/purchase" />;
  }
  return (
    <MainLayout>
      <MainProvider>
        <FilterProvider>
          {userData.membership?.type === 'free' && (
            <Headline level={5}>{t('Your trial ends', { day: remainDay })}</Headline>
          )}
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/nutrition" component={NutritionRoutes} />
            <Route path="/profile" component={ProfileRoutes} />
            <Route path="/plans" component={PlanRoutes} />
            <Route path="/shopping-list" component={ShoppingList} />
            <RoleRoutes path="/admin" component={AdminRoutes} />
            <Redirect to="/" />
          </Switch>
        </FilterProvider>
      </MainProvider>
    </MainLayout>
  );
};

export default MainRoutes;
