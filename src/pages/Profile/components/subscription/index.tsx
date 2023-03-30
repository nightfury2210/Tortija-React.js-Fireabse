import React, { useContext } from 'react';
import axios from 'axios';
import firebase from 'firebase';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import Button from 'components/Button';
import Headline from 'components/Headline';
import TransitionContainer from 'components/TransitionContainer';
import { AuthContext } from 'providers/AuthProvider';
import styles from './styles.module.scss';

type Props = {
  isShown: boolean;
  title: string;
  goBack?: React.MouseEventHandler<HTMLButtonElement>;
};

const Subscription: React.FC<Props> = ({ isShown, title, goBack = () => {} }) => {
  const { t } = useTranslation();
  const db = firebase.firestore();
  const { userData, user } = useContext(AuthContext);

  const unsubscribe = async () => {
    try {
      if (userData?.membership?.paymentMethod === 'paypal') {
        await axios.post(
          `${process.env.REACT_APP_PAYPAL_SUBSCRIPTION_API ?? ''}/${userData?.membership?.id ?? ''}/cancel`,
          {
            reason: 'Not satisfied with the service',
          },
          {
            auth: {
              username: process.env.REACT_APP_PAYPAL_CLIENTID ?? '',
              password: process.env.REACT_APP_PAYPAL_SECRET ?? '',
            },
          }
        );
      } else {
        await axios.post(`${process.env.REACT_APP_STRIPE_API_URL ?? ''}/cancel-subscription`, {
          subscriptionId: userData?.membership?.id,
        });
      }
      await db
        .collection('users')
        .doc(user?.uid)
        .update({
          membership: {
            id: '',
            activated: false,
            nextDate: userData?.membership?.nextDate,
            payerId: '',
            paymentMethod: '',
            type: userData?.membership?.type,
          },
        });
    } catch (error) {
      console.log(error);
    }
  };

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
        <p>
          {t('Payment type')} : {userData?.membership?.type}
        </p>
        <p>Until {moment(userData?.membership?.nextDate).format('MM-DD-YYYY')}</p>
        {userData?.membership?.type !== 'free' ? (
          userData?.membership?.activated ? (
            <Button onClick={unsubscribe}>{t('Unsubscribe')}</Button>
          ) : (
            <p>{t('Unsubscribed')}</p>
          )
        ) : null}
      </div>
    </TransitionContainer>
  );
};

export default Subscription;
