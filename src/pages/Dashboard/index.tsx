import React from 'react';
import { useTranslation } from 'react-i18next';

import Header from 'components/Header';
import Headline from '../../components/Headline';
import styles from './style.module.scss';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <Header>
        <Headline level={1}>{t('Dashboard')}</Headline>
      </Header>
    </div>
  );
};

export default Dashboard;
