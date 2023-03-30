import React, { useState, useEffect, useRef, useContext } from 'react';
import Button from 'components/Button';
import { intolerancesOption } from 'shared/constants/profile-wizard';
import SwitchButton from 'components/SwitchButton';
import firebase from 'services/firebase';
import { toast } from 'react-toast';
import { scrollToTop, generateRandomUid } from 'shared/functions/global';
import { AuthContext } from 'providers/AuthProvider';
import { useTranslation } from 'react-i18next';
import { trimEnd } from 'lodash';
import RecipeStepSwitch from '../RecipeStepSwitch';

type Props = {
  className?: string;
  currentStep?: any;
  currentStepValue?: string;
  recipeState?: any;
  recipeStateValue?: any;
  mainPopup?: any;
  popupContainerRef?: any;
};

const NewRecipeStep6: React.FC<Props> = ({
  currentStep,
  currentStepValue,
  recipeState,
  recipeStateValue,
  mainPopup,
  popupContainerRef,
}) => {
  const [visible, setVisible] = useState('block');
  const { t } = useTranslation();
  const authContext = useContext(AuthContext);
  const { userData } = useContext(AuthContext);

  const editIngridientNameRef = useRef<HTMLDivElement>(null);

  const saveNewRecipeToFirebase = async () => {
    const thisRecipeUid = generateRandomUid();

    const newColumnsAdmin = {
      ...recipeStateValue,
      uid: thisRecipeUid,
    };

    const newColumns = {
      ...recipeStateValue,
      userRecipe: true,
      uid: thisRecipeUid,
    };

    const newColumnsFavorite = {
      uid: thisRecipeUid,
      name: recipeStateValue.name,
      origId: thisRecipeUid,
    };

    if (userData?.role === 1) {
      try {
        await firebase
          .firestore()
          .collection('recipes')
          .doc(thisRecipeUid)
          .set(newColumnsAdmin as object);
        toast.success(t('Dein Rezept wurde erfolgreich erstellt!'));
      } catch (error: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        toast.error('Es ist leider etwas schief gegangen!');
      }
    } else {
      try {
        await firebase
          .firestore()
          .collection('users')
          .doc(authContext.user?.uid)
          .collection('recipes')
          .doc(thisRecipeUid)
          .set(newColumns as object);
        try {
          await firebase
            .firestore()
            .collection('users')
            .doc(authContext.user?.uid)
            .collection('favorites_recipes')
            .doc()
            .set(newColumnsFavorite as object);
        } catch (error: any) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          toast.error('Es ist leider etwas schief gegangen!');
        }
        toast.success(t('Dein Rezept wurde erfolgreich erstellt!'));
      } catch (error: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        toast.error('Es ist leider etwas schief gegangen!');
      }
    }

    currentStep('1');
    mainPopup('hidden');
  };

  // Change incompatibility items
  const setIncompatibilities = (status: boolean, item: string): void => {
    const newColumns = {
      ...recipeStateValue,
      [item.toLowerCase()]: status,
    };

    recipeState(newColumns);
  };

  function returnToPreviousStep() {
    setVisible('hidden');
    currentStep('5');
  }

  useEffect(() => {
    if (currentStepValue !== '6') {
      setVisible('hidden');
    }

    if (visible === 'block') {
      scrollToTop(popupContainerRef);
    }

    console.log(recipeStateValue);

    if (editIngridientNameRef.current) {
      editIngridientNameRef.current.focus();
    }
  }, [currentStepValue, popupContainerRef, visible, recipeStateValue]);

  const changeName = (event: any) => {
    const thisCurrentName = event.currentTarget.textContent;

    const newColumns = {
      ...recipeStateValue,
      name: thisCurrentName,
    };

    recipeState(newColumns);
  };

  return (
    <>
      <div className={visible}>
        <div className="pt-20 font-extralight text-base">
          Folgende Unverträglichkeiten haben wir bei deinem Rezept erkannt.
        </div>
        <div className="pt-10 font-extralight text-base">Diese kannst du bei Bedarf anpassen.</div>
        <div className="pt-30 pb-80">
          {intolerancesOption.map((item: string, index: number) => (
            <>
              <SwitchButton
                key={index}
                label={item}
                enabled={Boolean(recipeStateValue[item.toLowerCase()])}
                isBackground={index % 2 === 0}
                onChange={setIncompatibilities}
              />
            </>
          ))}
        </div>
        <RecipeStepSwitch
          returnFunction={returnToPreviousStep}
          nextFunction={saveNewRecipeToFirebase}
          currentStepValue="6"
          totalSteps={6}
          isFinished
        />
      </div>
    </>
  );
};

export default NewRecipeStep6;
