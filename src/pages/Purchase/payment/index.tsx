import React, { useContext, useState } from 'react';
import SwitchSelector from 'react-switch-selector';
import axios from 'axios';
import firebase from 'firebase';
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  Elements,
  IbanElement,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Button from 'components/Button';
import Container from 'components/Container';
import Headline from 'components/Headline';
import Icon from 'components/Icon';
import { AuthContext } from 'providers/AuthProvider';
import { monthlyPlanList, planID, stripePlanID, yearlyPlanList } from 'shared/constants/global';
import styles from './styles.module.scss';

type ParamType = {
  type: MembershipType;
};

const ButtonWrapper: React.FC = () => {
  const db = firebase.firestore();
  const history = useHistory();
  const { type } = useParams<ParamType>();
  const { user } = useContext(AuthContext);

  const createSubscription = (_: any, actions: any) => {
    return actions.subscription
      .create({
        plan_id: planID[type],
      })
      .then((orderId: string) => {
        return orderId;
      });
  };

  const onApprove = (data: any, actions: any) => {
    return actions.subscription.get().then((res: any) => {
      db.collection('users')
        .doc(user?.uid)
        .update({
          membership: {
            id: res.id,
            activated: true,
            nextDate: new Date(res.billing_info.next_billing_time).getTime(),
            payerId: res.subscriber.payer_id,
            paymentMethod: 'paypal',
            type,
          },
        });
      history.push('/');
    });
  };

  const onError = (error: any) => {
    console.log('error: ', error);
  };

  return (
    <PayPalButtons
      createSubscription={createSubscription}
      style={{
        label: 'subscribe',
        shape: 'pill',
        color: 'silver',
      }}
      className={styles.buttonWrapper}
      onApprove={onApprove}
      onError={onError}
    />
  );
};

const CheckoutForm = () => {
  const db = firebase.firestore();
  const elements = useElements();
  const history = useHistory();
  const stripe = useStripe();
  const { t } = useTranslation();
  const { type } = useParams<ParamType>();
  const { userData, user } = useContext(AuthContext);
  const [isPending, setIsPending] = useState(false);

  const paymentTypeOption = [
    {
      label: t('Card'),
      value: 'card',
    },
    {
      label: t('SEPA'),
      value: 'sepa_debit',
    },
  ];

  const [paymentType, setPaymentType] = useState<any>('card');

  const elementStyle = { base: { fontSize: '16px' } };
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setIsPending(true);

    try {
      const payment = await stripe.createPaymentMethod({
        type: paymentType,
        billing_details: {
          email: userData?.email ?? '',
          name: userData?.fullName ?? '',
        },
        ...(paymentType === 'card'
          ? { card: elements.getElement(CardNumberElement) ?? { token: '' } }
          : { sepa_debit: elements.getElement(IbanElement) ?? { iban: '' } }),
      });

      const res = await axios.post(`${process.env.REACT_APP_STRIPE_API_URL ?? ''}/subscribe`, {
        paymentMethod: payment.paymentMethod,
        planID: stripePlanID[type],
      });
      await db
        .collection('users')
        .doc(user?.uid)
        .update({
          membership: {
            id: res.data.subscription.id,
            activated: true,
            nextDate: res.data.subscription.current_period_end * 1000,
            payerId: res.data.subscription.customer,
            paymentMethod: 'stripe',
            type,
          },
        });
      history.push('/');
    } catch (error) {
      console.log('error: ', error);
    }

    setIsPending(false);
  };
  return (
    <form className={styles.stripeWrapper} onSubmit={handleSubmit}>
      <div className={styles.switchWrapper}>
        <SwitchSelector
          onChange={setPaymentType}
          options={paymentTypeOption}
          initialSelectedIndex={0}
          backgroundColor="#3D4045"
          fontColor="white"
          fontSize={20}
          selectionIndicatorMargin={0}
        />
      </div>
      {paymentType === 'card' ? (
        <>
          <CardNumberElement options={{ showIcon: true, style: elementStyle }} className={styles.cardInput} />
          <div className="grid w-full grid-cols-2 gap-x-10">
            <CardExpiryElement options={{ style: elementStyle }} className={styles.cardInput} />
            <CardCvcElement options={{ style: elementStyle }} className={styles.cardInput} />
          </div>
        </>
      ) : (
        <IbanElement options={{ supportedCountries: ['SEPA'], style: elementStyle }} className={styles.cardInput} />
      )}
      <Button type="submit" className="w-full rounded-full py-15" isPending={isPending} disabled={isPending}>
        Pay
      </Button>
    </form>
  );
};

const PaymentDetails: React.FC = () => {
  const { t } = useTranslation();
  const { type } = useParams<ParamType>();
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLICKEY ?? '');

  let planDetail: MembershipPlanType;

  switch (type) {
    case 'basic':
      planDetail = { ...monthlyPlanList[0] };
      break;
    case 'pro':
      planDetail = { ...monthlyPlanList[1] };
      break;
    case 'basic12':
      planDetail = { ...yearlyPlanList[0] };
      break;
    case 'pro12':
      planDetail = { ...yearlyPlanList[1] };
      break;
    default:
      planDetail = { ...monthlyPlanList[0] };
      break;
  }

  return (
    <Container>
      <div className={styles.wrapper}>
        <Icon name="logo" width={200} />
        <Headline className="mt-15" level={1}>
          Tortija {t(planDetail.name)}: {t(planDetail.price)}€
        </Headline>
        <PayPalScriptProvider
          options={{
            'client-id': process.env.REACT_APP_PAYPAL_CLIENTID ?? '',
            components: 'buttons',
            currency: 'EUR',
            intent: 'subscription',
            vault: true,
            'disable-funding': 'card',
          }}
        >
          <ButtonWrapper />
        </PayPalScriptProvider>

        <Elements stripe={stripePromise} options={{ locale: 'de', loader: 'always' }}>
          <CheckoutForm />
        </Elements>
      </div>
    </Container>
  );
};

export default PaymentDetails;
