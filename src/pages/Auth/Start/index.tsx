import React from 'react';
import { useTranslation } from 'react-i18next';
import LogoImg from 'assets/img/svg/logo.svg';
import Button from 'components/Button';
import { useHistory } from 'react-router-dom';
import styles from './styles.module.scss';

const StartPage: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const getStart = () => {
    history.push('/auth/choose-login');
  };

  return (
    <div className={styles.wrapper}>
      <img className={styles.image} width={160} height={140} src={LogoImg} alt="" />
      <p className={styles.text}>{t('Heartily Welcome!')}</p>
      <Button onClick={getStart}>
        <span className="uppercase">{t('Get start now')}</span>
      </Button>
    </div>
  );
};

export default StartPage;
