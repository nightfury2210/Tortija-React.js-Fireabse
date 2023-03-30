import React from 'react';
import TransitionContainer from 'components/TransitionContainer';
import Headline from 'components/Headline';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.scss';

type Props = {
  isShown: boolean;
  title: string;
  goBack?: React.MouseEventHandler<HTMLButtonElement>;
};

const Legal: React.FC<Props> = ({ isShown, title, goBack = () => {} }) => {
  const { t } = useTranslation();
  return (
    <TransitionContainer isShown={isShown}>
      <div className={styles.header}>
        <Headline level={1} className="mb-20">
          {t(title)}
        </Headline>
        <Headline level={4} displayBackBtn goBack={goBack}>
          {t('Return')}
        </Headline>
      </div>
    </TransitionContainer>
  );
};

export default Legal;
