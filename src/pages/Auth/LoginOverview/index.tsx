import React, { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LogoImg from 'assets/img/svg/logo.svg';
import FacebookIcon from 'assets/img/svg/facebook.svg';
import Button from 'components/Button';
import firebase from 'services/firebase';
import { AuthContext } from 'providers/AuthProvider';
import { toast } from 'react-toast';
import styles from './styles.module.scss';

const LoginOverview: React.FC = () => {
  const { t } = useTranslation();

  const authContext = useContext(AuthContext);
  const history = useHistory();
  const [isFacebookLogging, setIsFacebookLogging] = useState(false);

  const signInWithFacebook = async () => {
    setIsFacebookLogging(true);
    const db = firebase.firestore();
    try {
      const facebookProvider = new firebase.auth.FacebookAuthProvider();
      const userCredential: firebase.auth.UserCredential = await firebase.auth().signInWithPopup(facebookProvider);

      const isExist = (await db.collection('users').doc(userCredential.user?.uid).get()).exists;
      if (!isExist) {
        await db.collection('users').doc(userCredential.user?.uid).set({
          email: userCredential.user?.email,
          fullName: userCredential.user?.displayName,
          role: 2,
          profileComplete: false,
          created: firebase.firestore.FieldValue.serverTimestamp(),
        });
      }
      authContext.setUser(userCredential.user as firebase.User);
      const userInfo = (await db.collection('users').doc(userCredential.user?.uid).get()).data();
      authContext.setUserData(userInfo as UserInfo);
      setIsFacebookLogging(false);
      history.push('/');
    } catch (error: any) {
      setIsFacebookLogging(false);
      toast.warn(error.message);
    }
  };

  return (
    <div className={styles.wrapper}>
      <img className={styles.logo} width={160} height={140} src={LogoImg} alt="" />

      <div className={styles.content}>
        {/* <Button type="button" buttonStyle="white" className={styles.button}>
          <img src={GoogleIcon} className={styles.socialLogo} width={27} height={27} alt="" />
          <span className={styles.text}>{t('Sign in with google')}</span>
        </Button> */}

        <Button
          type="button"
          buttonStyle="white"
          className={styles.button}
          onClick={signInWithFacebook}
          isPending={isFacebookLogging}
          disabled={isFacebookLogging}
        >
          <img src={FacebookIcon} className={styles.socialLogo} width={27} height={27} alt="" />
          <span className={styles.text}>{t('Sign in with Facebook')}</span>
        </Button>

        {/* <Button type="button" buttonStyle="white" className={styles.button}>
          <img src={AppleIcon} className={styles.socialLogo} width={27} height={27} alt="" />
          <span className={styles.text}>{t('Sign in with apple')}</span>
        </Button> */}

        <Button
          type="button"
          className={styles.button}
          onClick={() => {
            history.push('/auth/login');
          }}
        >
          <span className={styles.text}>{t('Sign in with email')}</span>
        </Button>

        <div className={styles.comment}>
          <span>{t("Don't you have account?")}</span>
          <Link to="/auth/register" className={styles.link}>
            {t('Sign up')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginOverview;
