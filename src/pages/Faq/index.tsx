import React, { useContext, useState } from 'react';
import { ChevronRightIcon } from '@heroicons/react/solid';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { FaqContext, FaqType } from 'providers/FaqProvider';
import SearchBox from 'components/SearchBox';
import Button from 'components/Button';
import Headline from 'components/Headline';
import Header from 'components/Header';
import styles from './style.module.scss';

const FaqList: React.FC = () => {
  const { t } = useTranslation();
  const faqContext = useContext(FaqContext);
  const [filter, setFilter] = useState('');
  const history = useHistory();

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  return (
    <>
      <Header>
        <Headline
          level={1}
          displayBackBtn
          goBack={() => {
            history.goBack();
          }}
        >
          {t('Help & FAQ')}
        </Headline>
      </Header>

      <div className="max-w-md mx-auto">
        <SearchBox onChange={onSearchChange} searchValue={filter} />

        <div className={styles.faqWrapper}>
          {/* skeleton loading */}
          {faqContext.loadingFaq
            ? Array.from(Array(6).keys()).map((_, index) => (
                <Button buttonStyle="dark" className={styles.skeletonBtn} key={index} onClick={() => true}>
                  <div />
                </Button>
              ))
            : faqContext.faqQuestion
                .filter((question: FaqType) => question.value.toLowerCase().includes(filter.toLowerCase()))
                .map(question => (
                  <Button
                    buttonStyle="dark"
                    className={styles.btn}
                    key={question.id}
                    onClick={() => history.push(`/profile/faq/${question.id}`)}
                  >
                    <div className={styles.btnInner}>
                      <p className={styles.btnText}>{question.value}</p>
                      <ChevronRightIcon className={styles.icon} height={30} width={30} />
                    </div>
                  </Button>
                ))}
        </div>
      </div>
    </>
  );
};

export default FaqList;
