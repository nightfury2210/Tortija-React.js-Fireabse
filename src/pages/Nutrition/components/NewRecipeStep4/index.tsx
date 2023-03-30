import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toast';
import { PlusIcon } from '@heroicons/react/outline';
import { useTranslation } from 'react-i18next';
import { scrollToTop } from 'shared/functions/global';
import RecipeStepSwitch from '../RecipeStepSwitch';
import DescriptionItem from '../DescriptionItem';

type Props = {
  className?: string;
  currentStep?: any;
  currentStepValue?: string;
  recipeState?: any;
  recipeStateValue?: any;
  popupContainerRef?: any;
};

// Add new description step
function addDescriptionStep(
  state: any,
  updateFunction: any,
  setRecipeChanged: any,
  viewPort: string,
  recipeDescriptionArray: any,
  setRecipeDescriptionArray: any,
  setDescriptionStepAdded: any
) {
  let thisDescriptionArray;
  if (recipeDescriptionArray.length > 0) {
    thisDescriptionArray = recipeDescriptionArray;
  } else {
    thisDescriptionArray = state.description;
  }

  const newColumns = {
    ...state,
    description: [
      ...thisDescriptionArray,
      {
        id: thisDescriptionArray.length,
        text: '',
      },
    ],
  };

  if (viewPort === 'desktop') {
    document.getElementById(`descriptionJumpContainerDesktop`)!.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    document.getElementById(`descriptionJumpContainer`)!.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  setRecipeDescriptionArray(...thisDescriptionArray, {
    id: thisDescriptionArray.length,
    text: '',
  });

  updateFunction(newColumns);
  setRecipeChanged(true);
  setDescriptionStepAdded(true);
}

const NewRecipeStep4: React.FC<Props> = ({
  currentStep,
  currentStepValue,
  recipeState,
  recipeStateValue,
  popupContainerRef,
}) => {
  const [visible, setVisible] = useState('block');
  const [recipeChanged, setRecipeChanged] = useState(false);
  const [recipeDescriptionArray, setRecipeDescriptionArray] = useState([]);
  const [descriptionStepAdded, setDescriptionStepAdded] = useState(false);

  const { t } = useTranslation();

  const editIngridientNameRef = useRef<HTMLDivElement>(null);
  const newDescriptionStepRef = useRef<HTMLDivElement>(null);

  function setDescriptionArray() {
    let thisDescriptionArr;
    if (recipeDescriptionArray.length > 0) {
      thisDescriptionArr = [...recipeDescriptionArray];
    } else {
      thisDescriptionArr = recipeStateValue?.description;
    }

    const newColumns = {
      ...recipeStateValue,
      description: thisDescriptionArr,
    };

    recipeState(newColumns);
    jumpToNextStep();
  }

  function jumpToNextStep() {
    if (recipeStateValue?.description.length === 0) {
      toast.warn(t('Select Description'));
    } else {
      setVisible('hidden');
      currentStep('5');
    }
  }

  function returnToPreviousStep() {
    setVisible('hidden');
    currentStep('3');
  }

  useEffect(() => {
    if (currentStepValue !== '4') {
      setVisible('hidden');
    }

    if (visible === 'block') {
      scrollToTop(popupContainerRef);
    }

    console.log(recipeStateValue);

    if (editIngridientNameRef.current) {
      editIngridientNameRef.current.focus();
    }
  }, [currentStepValue, recipeStateValue, popupContainerRef, visible]);

  return (
    <>
      <div className={visible}>
        <div className="pt-20 font-light text-base">
          Bitte tragen Sie die Zubereitungsschritte für das neue Rezept ein!
        </div>
        <div className="flex gap-40 pt-4">
          <div className="font-light text-2xl">{t('Preparation')}</div>
        </div>
        <div className="flex pt-10 gap-5 cursor-pointer">
          <div>
            <PlusIcon width={25} height={25} className="text-brownSemiDark mx-auto" />
          </div>
          <div
            onClick={() =>
              addDescriptionStep(
                recipeStateValue,
                recipeState,
                setRecipeChanged,
                'desktop',
                recipeDescriptionArray,
                setRecipeDescriptionArray,
                setDescriptionStepAdded
              )
            }
            onKeyDown={() =>
              addDescriptionStep(
                recipeStateValue,
                recipeState,
                setRecipeChanged,
                'desktop',
                recipeDescriptionArray,
                setRecipeDescriptionArray,
                setDescriptionStepAdded
              )
            }
            aria-hidden="true"
          >
            Neuen Zubereitungsschritt hinzufügen
          </div>
        </div>
        <div className="pb-80">
          {recipeStateValue?.description.map((desc: any) => (
            <>
              <div className="pb-0">
                <DescriptionItem
                  descriptionData={desc}
                  recipeData={recipeStateValue}
                  updateFunction={recipeState}
                  setRecipeChanged={setRecipeChanged}
                  recipeDescriptionArray={setRecipeDescriptionArray}
                  recipeDescriptionArrayValue={recipeDescriptionArray}
                  newDescriptionStepRef={newDescriptionStepRef}
                  recipeChanged={recipeChanged}
                  setDescriptionStepAdded={setDescriptionStepAdded}
                  descriptionStepAdded={descriptionStepAdded}
                />
              </div>
            </>
          ))}
        </div>
        <div className="block md:hidden pt-10" id="descriptionJumpContainer" />
        <div className="hidden md:block pt-10" id="descriptionJumpContainerDesktop" />
        <RecipeStepSwitch
          returnFunction={returnToPreviousStep}
          nextFunction={setDescriptionArray}
          currentStepValue="4"
          totalSteps={6}
        />
      </div>
    </>
  );
};

export default NewRecipeStep4;
