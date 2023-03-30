import React, { useContext, useState } from 'react';
import firebase from 'firebase';
import TransitionContainer from 'components/TransitionContainer';
import Headline from 'components/Headline';
import { useTranslation } from 'react-i18next';
import FirstPersonalInformation from 'pages/ProfileWizard/components/PersonalInformation/firstPage';
import FormOfNutrition from 'pages/ProfileWizard/components/FormOfNutrition';
import EatingHabits from 'pages/ProfileWizard/components/EatingHabits';
import Incompatibilities from 'pages/ProfileWizard/components/Incompatibilities';
import Button from 'components/Button';
import { AuthContext } from 'providers/AuthProvider';
import { toast } from 'react-toast';
import SecondPersonalInformation from 'pages/ProfileWizard/components/PersonalInformation/secondPage';
import GoalStep from 'pages/ProfileWizard/components/GoalStep';
import styles from './styles.module.scss';

type Props = {
  isShown: boolean;
  title: string;
  goBack?: React.MouseEventHandler<HTMLButtonElement>;
};

const EditProfile: React.FC<Props> = ({ isShown, title, goBack = () => {} }) => {
  const { t } = useTranslation();
  const authContext = useContext(AuthContext);
  const db = firebase.firestore();

  const [isUpdating, setIsUpdating] = useState(false);

  const onSubmit = async () => {
    setIsUpdating(true);
    try {
      const profile: UserInfo = authContext.userData as UserInfo;
      await db
        .collection('users')
        .doc(authContext.user?.uid)
        .set({
          ...profile,
        });
      toast.success('Uer Profile Successfully Updated');
      setIsUpdating(false);
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      toast.warn(error.message);
      setIsUpdating(false);
    }
  };

  return (
    <TransitionContainer isShown={isShown}>
      <div className={styles.header}>
        <Headline level={1} className="mb-20">
          {t(title)}
        </Headline>
        <div className={styles.buttons}>
          <Headline level={4} displayBackBtn goBack={goBack}>
            {t('Return')}
          </Headline>
          <Button
            isPending={isUpdating}
            disabled={isUpdating}
            buttonStyle={isUpdating ? 'dark' : 'primary'}
            onClick={onSubmit}
            className="w-200"
          >
            {t('Change')}
          </Button>
        </div>
      </div>
      <div className={styles.content}>
        <GoalStep isProfile />
        <FirstPersonalInformation />
        <SecondPersonalInformation hiddenHeader />
        <FormOfNutrition isProfile />
        <EatingHabits isProfile />
        <Incompatibilities isProfile />
      </div>
    </TransitionContainer>
  );
};

export default EditProfile;
