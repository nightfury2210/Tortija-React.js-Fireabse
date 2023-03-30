import React, { useContext, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toast';
import LogoImg from 'assets/img/svg/logo.svg';
import Button from 'components/Button';
import Input from 'components/Input';
import firebase from 'services/firebase';
import { emailChecker, emailValidation } from 'services/validations';
import { AuthContext } from 'providers/AuthProvider';
import Checkbox from 'components/Checkbox';
import styles from './styles.module.scss';

const EmailLogin: React.FC = () => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const authContext = useContext(AuthContext);

  const password = useRef({});
  password.current = watch('password', '');

  const history = useHistory();
  const [isLogging, setIsLogging] = useState(false);

  const onSubmit = async (data: any) => {
    setIsLogging(true);
    try {
      const userCredential: firebase.auth.UserCredential = await firebase
        .auth()
        .signInWithEmailAndPassword(data.email, data.password);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      authContext.setUser(userCredential.user as firebase.User);
      setIsLogging(false);
      history.push('/');
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      toast.warn(error.message);
      setIsLogging(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <img className={styles.logo} width={160} height={140} src={LogoImg} alt="" />

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-40">
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
            autoComplete="password"
            required
            register={register('password', {
              required: t('Please enter your password').toString(),
              validate: (value: string) => {
                if (!value.trim()) {
                  return t('Please enter your password').toString();
                }
                return true;
              },
            })}
            error={errors.password}
          />
          <div className={styles.rememberMe}>
            <Checkbox label={t('Remember me')} name="rememberMe" register={register('rememberMe')} />

            <Link to="/auth/reset-password" className={styles.link}>
              {t('Forgot your password?')}
            </Link>
          </div>
        </div>

        <div className={styles.comment}>
          <span>{t("Don't you have account?")}</span>
          <Link to="/auth/register" className={styles.link}>
            {t('Sign up')}
          </Link>
        </div>

        <Button disabled={isLogging} isPending={isLogging} className={styles.button}>
          <span className={styles.text}>{t('Sign in')}</span>
        </Button>

        <Button
          type="button"
          buttonStyle="white"
          className={styles.button}
          onClick={() => {
            history.push('/auth/choose-login');
          }}
        >
          <span className={styles.text}>{t('Back to Sign in')}</span>
        </Button>
      </form>
    </div>
  );
};

export default EmailLogin;
