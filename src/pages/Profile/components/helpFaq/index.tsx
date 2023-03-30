import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ExclamationIcon, PencilIcon, QuestionMarkCircleIcon } from '@heroicons/react/outline';
import TransitionContainer from 'components/TransitionContainer';
import Headline from 'components/Headline';
import styles from './styles.module.scss';

type Props = {
  isShown: boolean;
  title: string;
  goBack?: React.MouseEventHandler<HTMLButtonElement>;
};

const HelpAndFAQ: React.FC<Props> = ({ isShown, title, goBack = () => {} }) => {
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
      <div className={styles.content}>
        <Link to="/profile/faq" className={styles.button}>
          <div>
            <QuestionMarkCircleIcon width={55} height={55} className={styles.icon} />
            <Headline level={4} className={styles.label}>
              {t('Frequently Asked Questions')}
            </Headline>
          </div>
        </Link>
        <Link to="" className={styles.button}>
          <div>
            <PencilIcon width={55} height={55} className={styles.icon} />
            <Headline level={4} className={styles.label}>
              {t('Own Question Place')}
            </Headline>
          </div>
        </Link>
        <Link to="" className={styles.button}>
          <div>
            <ExclamationIcon width={55} height={55} className={styles.icon} />
            <Headline level={4} className={styles.label}>
              {t('App Issues Report')}
            </Headline>
          </div>
        </Link>
      </div>
    </TransitionContainer>
  );
};

export default HelpAndFAQ;
