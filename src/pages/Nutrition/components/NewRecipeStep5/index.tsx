import React, { useState, useEffect } from 'react';
import { eatingHabitsOption } from 'shared/constants/profile-wizard';
import SwitchButton from 'components/SwitchButton';
import { scrollToTop } from 'shared/functions/global';
import { useTranslation } from 'react-i18next';
import RecipeStepSwitch from '../RecipeStepSwitch';

type Props = {
  className?: string;
  currentStep?: any;
  currentStepValue?: string;
  recipeState?: any;
  recipeStateValue?: any;
  popupContainerRef?: any;
};

const NewRecipeStep5: React.FC<Props> = ({
  currentStep,
  currentStepValue,
  recipeState,
  recipeStateValue,
  popupContainerRef,
}) => {
  const [visible, setVisible] = useState('block');
  const { t } = useTranslation();

  // Change incompatibility items
  const setEatingHabits = (status: boolean, item: string): void => {
    const newColumns = {
      ...recipeStateValue,
      [item.toLowerCase()]: status,
    };

    recipeState(newColumns);
  };

  function jumpToNextStep() {
    setVisible('hidden');
    currentStep('6');
  }

  function returnToPreviousStep() {
    setVisible('hidden');
    currentStep('4');
  }

  useEffect(() => {
    if (currentStepValue !== '5') {
      setVisible('hidden');
    }

    if (visible === 'block') {
      scrollToTop(popupContainerRef);
    }

    console.log(recipeStateValue);
  }, [currentStepValue, popupContainerRef, visible, recipeStateValue]);

  return (
    <>
      <div className={visible}>
        <div className="pt-20 font-light text-base">Welche Essgewohnheiten passen zu deinem Rezept?</div>
        <div className="pt-20 pb-80">
          {eatingHabitsOption.map((item: string, index: number) => (
            <>
              <SwitchButton
                key={index}
                label={item}
                enabled={Boolean(recipeStateValue[item.toLowerCase()])}
                isBackground={index % 2 === 0}
                onChange={setEatingHabits}
              />
            </>
          ))}
        </div>
        <RecipeStepSwitch
          returnFunction={returnToPreviousStep}
          nextFunction={jumpToNextStep}
          currentStepValue="5"
          totalSteps={6}
        />
      </div>
    </>
  );
};

export default NewRecipeStep5;
