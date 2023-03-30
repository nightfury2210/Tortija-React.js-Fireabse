/* eslint-disable react/no-danger */
import React, { useContext } from 'react';
import { sanitize } from 'dompurify';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { FaqContext, FaqType } from 'providers/FaqProvider';
import Headline from 'components/Headline';
import Header from 'components/Header';
import styles from './style.module.scss';

type ParamsType = {
  id: string;
};

const FaqDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<ParamsType>();
  const faqContext = useContext(FaqContext);

  const history = useHistory();

  const question = faqContext.faqQuestion.find((item: FaqType) => item.id === id)?.value ?? '';
  const answer = faqContext.faqAnswer.find((item: FaqType) => item.id === id)?.value ?? '';

  return (
    <div className="text-white">
      <Header>
        <Headline level={1} displayBackBtn goBack={history.goBack}>
          {t('Help & FAQ')}
        </Headline>
      </Header>
      <div className="max-w-md mx-auto">
        <p className={styles.text}>{question}</p>
        <div className={styles.html} dangerouslySetInnerHTML={{ __html: sanitize(answer) }} />
      </div>
    </div>
  );
};

export default FaqDetails;
