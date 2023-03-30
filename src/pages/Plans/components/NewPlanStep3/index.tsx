import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toast';
import firebase from 'services/firebase';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from 'providers/AuthProvider';
import { generateRandomUid } from 'shared/functions/global';
import RecipeStepSwitch from '../../../Nutrition/components/RecipeStepSwitch';

type Props = {
  className?: string;
  currentStep?: any;
  currentStepValue?: string;
  planState?: any;
  planStateValue?: any;
  mainPopup?: any;
  popupContainerRef?: any;
};

const NewPlanStep3: React.FC<Props> = ({
  currentStep,
  currentStepValue,
  planState,
  mainPopup,
  planStateValue,
  popupContainerRef,
}) => {
  const [visible, setVisible] = useState('block');
  const { t } = useTranslation();

  const authContext = useContext(AuthContext);
  const { userData } = useContext(AuthContext);

  const history = useHistory();

  function returnToPreviousStep() {
    setVisible('hidden');
    currentStep('2');
  }

  useEffect(() => {
    if (currentStepValue !== '3') {
      setVisible('hidden');
    }
  }, [currentStepValue, planStateValue, visible, popupContainerRef]);

  const savePlanToFirebase = async () => {
    const thisPlanUid = generateRandomUid();

    const newColumns = {
      ...planStateValue,
      imageUrl: 'https://static.tortija.de/images/default_plan.jpg',
      uid: thisPlanUid,
    };

    const newColumnsAdmin = {
      ...planStateValue,
      uid: thisPlanUid,
      imageUrl: 'https://static.tortija.de/images/default_plan.jpg',
      examplePlan: true,
    };

    const newColumnsFavorite = {
      uid: thisPlanUid,
      name: planStateValue.name,
      origId: thisPlanUid,
    };

    if (userData?.role === 1) {
      try {
        await firebase
          .firestore()
          .collection('plans')
          .doc(thisPlanUid)
          .set(newColumnsAdmin as object);
        toast.success(t('Dein Plan wurde erfolgreich erstellt!'));
        history.push({
          pathname: `/plans/edit/${thisPlanUid}`,
          state: {
            from: 'plan_add',
          },
        });
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        toast.error('Es ist leider etwas schief gegangen!');
      }
    } else {
      try {
        await firebase
          .firestore()
          .collection('users')
          .doc(authContext.user?.uid)
          .collection('plans')
          .doc(thisPlanUid)
          .set(newColumns as object);
        try {
          await firebase
            .firestore()
            .collection('users')
            .doc(authContext.user?.uid)
            .collection('favorites_plans')
            .doc()
            .set(newColumnsFavorite as object);
        } catch (error) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          toast.error('Es ist leider etwas schief gegangen!');
        }
        toast.success(t('Dein Plan wurde erfolgreich erstellt!'));
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        toast.error('Es ist leider etwas schief gegangen!');
      }
    }

    currentStep('1');
    mainPopup('hidden');
  };

  return (
    <>
      <div className={visible}>
        <div className="px-20">
          <div className="pb-100">
            <div className="pt-20 font-light text-base">Hier kannst du deinen Plan noch einstellen!</div>
            <div>Ernährungsform</div>
            <div>Kalorienbedarf und Verteilung Makros</div>
            <div>Auf welche Lebensmittel hast du diese Woche Hunger oder noch im Kühlschrank?</div>
            <div>Einstellungen Alghorithmus: Wann möchtest du kochen? - etc.</div>
          </div>
        </div>
      </div>
      <RecipeStepSwitch
        returnFunction={returnToPreviousStep}
        nextFunction={savePlanToFirebase}
        isFinished
        currentStepValue="3"
        totalSteps={3}
      />
    </>
  );
};

export default NewPlanStep3;
