import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from 'components/Button';
import Input from 'components/Input';
import firebase from 'services/firebase';
import { emailChecker, emailValidation } from 'services/validations';

import { toast } from 'react-toast';
import Headline from 'components/Headline';
import styles from './styles.module.scss';

const ResetPassword: React.FC = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [isSending, setIsSending] = useState(false);

  const onSubmit = async (data: any) => {
    setIsSending(true);
    try {
      await firebase.auth().sendPasswordResetEmail(data.email);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      setIsSending(false);
      toast.success(t('An email has been sent to you'));
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      toast.warn(error.message);
      setIsSending(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Headline level={1} className="text-center">
        {t('Reset password')}
      </Headline>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
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
        <div className={styles.comment}>
          <span>{t('Back to')}</span>
          <Link to="/auth/login" className={styles.link}>
            {t('Sign in')}
          </Link>
        </div>

        <Button disabled={isSending} isPending={isSending} className={styles.button}>
          <span className={styles.text}>{t('Send me a reset link')}</span>
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
