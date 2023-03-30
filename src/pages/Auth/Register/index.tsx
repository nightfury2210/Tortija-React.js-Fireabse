import React, { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import Button from 'components/Button';
import Input from 'components/Input';
import firebase from 'services/firebase';
import {
  nameValidation,
  passwordValidation,
  emailChecker,
  emailValidation,
  passwordChecker,
} from 'services/validations';
import { AuthContext } from 'providers/AuthProvider';

import { toast } from 'react-toast';
import Preloader from 'components/Preloader';
import { gymCollection } from 'shared/constants/global';
import Headline from 'components/Headline';
import styles from './styles.module.scss';

type ParamsType = {
  id: string;
};

const Register: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<ParamsType>();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = useRef({});
  password.current = watch('password', '');

  const authContext = useContext(AuthContext);
  const history = useHistory();

  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gymData, setGymData] = useState<GymType>();

  const getGymData = async () => {
    setIsLoading(true);
    try {
      if (id) {
        const data = await gymCollection.doc(id).get();
        setGymData({ ...(data.data() as GymType), id: data.id });
      }
      setIsLoading(false);
    } catch (error: any) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getGymData();
    // eslint-disable-next-line
  }, []);
  const onSubmit = async (data: any) => {
    setIsRegistering(true);
    try {
      const db = firebase.firestore();
      const userCredential: firebase.auth.UserCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(data.email, data.password);
      userCredential.user?.sendEmailVerification();
      await db
        .collection('users')
        .doc(userCredential.user?.uid)
        .set({
          email: data.email,
          fullName: data.fullName,
          gymID: gymData?.id ?? '',
          role: 2,
          profileComplete: false,
          created: firebase.firestore.FieldValue.serverTimestamp(),
          membership: {
            id: '',
            activated: true,
            nextDate: '',
            payerId: '',
            paymentMethod: '',
            type: 'free',
          },
        });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      authContext.setUser(userCredential.user as firebase.User);
      setIsRegistering(false);
      history.push('/');
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      toast.warn(error.message);
      setIsRegistering(false);
    }
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <div className={styles.wrapper}>
      <Headline level={1} className="text-center mb-60">
        {t('Registration')}
      </Headline>

      {id && (
        <div className={styles.gym}>
          <h3 className={styles.name}>{gymData?.title}</h3>
          <img src={gymData?.logoImage} alt="" width={300} height={300} className={styles.qrcode} />
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <Input
          name="fullName"
          type="text"
          label={t('Name')}
          autoComplete="given-name"
          required
          register={register('fullName', {
            ...nameValidation,
            validate: (value: string) => {
              if (!value.trim()) {
                return t('Please enter your full name').toString();
              }
              return true;
            },
          })}
          error={errors.fullName}
        />
        <Input
          name="email"
          type="email"
          label={t('Email')}
          autoComplete="email"
          required
          register={register('email', {
            ...emailValidation,
            validate: (value: string) => {
              if (!value.trim()) {
                return t('Email Address is required').toString();
              }
              return emailChecker(value) || t('Please enter valid email address').toString();
            },
          })}
          error={errors.email}
        />
        <Input
          name="password"
          type="password"
          label={t('Password')}
          autoComplete=""
          required
          register={register('password', {
            ...passwordValidation,
            required: t('Please enter your password').toString(),
            validate: (value: string) =>
              passwordChecker(value) || t('Password must contain at least 1 number').toString(),
          })}
          error={errors.password}
        />
        <Input
          name="confirm-password"
          type="password"
          label={t('Confirm password')}
          autoComplete=""
          register={register('confirm-password', {
            required: t('Please confirm your password').toString(),
            validate: (value: string) =>
              value === password.current || t('Password and Confirm password do not match').toString(),
          })}
          error={errors['confirm-password']}
        />

        <Button disabled={isRegistering} isPending={isRegistering} className={styles.button}>
          <span className={styles.text}>{t('Try it for free for 7 days')}</span>
        </Button>

        <div className={styles.comment}>
          <span>{t('Do you already have an account?')}</span>
          <Link to="/auth/choose-login" className={styles.link}>
            {t('Sign in here!')}
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
