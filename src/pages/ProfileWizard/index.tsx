import React, { useContext, useMemo, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import firebase from 'firebase';
import { useTranslation } from 'react-i18next';
import { AuthContext } from 'providers/AuthProvider';

import { toast } from 'react-toast';
import Button from 'components/Button';
import Headline from 'components/Headline';
import FirstPersonalInformation from './components/PersonalInformation/firstPage';
import FormOfNutrition from './components/FormOfNutrition';
import EatingHabits from './components/EatingHabits';
import Incompatibilities from './components/Incompatibilities';
import styles from './styles.module.scss';
import GoalStep from './components/GoalStep';
import SecondPersonalInformation from './components/PersonalInformation/secondPage';

function ProfileWizard() {
  const authContext = useContext(AuthContext);
  const db = firebase.firestore();
  const { t } = useTranslation();

  const history = useHistory();
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const nextEnable = useMemo(() => {
    const profile = authContext.userData;
    switch (currentStep) {
      case 0:
        if (
          profile?.gender &&
          profile?.gender.length &&
          profile.age &&
          profile.age.length &&
          profile.bodySize &&
          profile.bodySize.length &&
          profile.bodyWeight &&
          profile.bodyWeight.length
        ) {
          return true;
        }
        return false;
      case 1:
        if (
          profile?.calories &&
          profile.calories.length &&
          profile.physicalStrainChange &&
          profile.physicalStrainChange.length
        ) {
          return true;
        }
        return false;
      default:
        return true;
    }
  }, [authContext.userData, currentStep]);

  if (authContext.userData?.profileComplete) {
    return <Redirect to="/" />;
  }

  const onSubmit = async () => {
    setIsUpdating(true);
    try {
      const profile: UserInfo = authContext.userData as UserInfo;
      await db
        .collection('users')
        .doc(authContext.user?.uid)
        .set({
          ...profile,
          profileComplete: true,
        });
      authContext.setUserData((prevProfile: UserInfo) => ({ ...prevProfile, profileComplete: true }));
      setIsUpdating(false);
      history.push('/');
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      toast.warn(error.message);
      setIsUpdating(false);
    }
  };

  const nextStep = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    setCurrentStep(prevStep => prevStep + 1);
  };

  const backStep = () => {
    if (currentStep === 0) return;
    setCurrentStep(prevStep => prevStep - 1);
  };

  return (
    <div className={styles.wrapper}>
      <Headline className="capitalize" centered level={3}>
        {t('Complete your profile')}
      </Headline>
      <div className={styles.content}>
        {currentStep === 0 ? (
          <FirstPersonalInformation />
        ) : currentStep === 1 ? (
          <SecondPersonalInformation />
        ) : currentStep === 2 ? (
          <GoalStep />
        ) : currentStep === 3 ? (
          <FormOfNutrition />
        ) : currentStep === 4 ? (
          <EatingHabits />
        ) : (
          <Incompatibilities />
        )}
      </div>
      <div className={styles.buttonContainer}>
        <Button
          disabled={isUpdating || currentStep === 0}
          buttonStyle={isUpdating || currentStep === 0 ? 'dark' : 'white'}
          onClick={backStep}
        >
          {t('Back')}
        </Button>
        <Button
          isPending={isUpdating}
          disabled={isUpdating || !nextEnable}
          buttonStyle={isUpdating || !nextEnable ? 'dark' : 'primary'}
          onClick={currentStep === 5 ? onSubmit : nextStep}
        >
          {currentStep < 5 ? t('Next') : t('Submit')}
        </Button>
      </div>
    </div>
  );
}

export default ProfileWizard;
