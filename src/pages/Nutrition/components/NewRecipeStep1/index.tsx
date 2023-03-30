import React, { useState, useEffect, useRef } from 'react';
import CustomSelect from 'components/CustomSelect';
import { OptionTypeBase } from 'react-select';
import { difficultyValues, recipeCategoryValues } from 'shared/constants/global';
import { formOfNutrition } from 'shared/constants/profile-wizard';
import SwitchButton from 'components/SwitchButton';
import { scrollToTop } from 'shared/functions/global';
import { toast } from 'react-toast';
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

const NewRecipeStep1: React.FC<Props> = ({
  currentStep,
  currentStepValue,
  recipeState,
  recipeStateValue,
  popupContainerRef,
}) => {
  const [visible, setVisible] = useState('block');
  const [currentName, setCurrentName] = useState(recipeStateValue?.name);
  const { t } = useTranslation();

  const editRecipeNameRef = useRef<HTMLDivElement>(null);

  function jumpToNextStep() {
    let isValid = true;

    if (currentName === '' || currentName === undefined) {
      isValid = false;
      toast.warn(t('Select Name'));
    } else if (recipeStateValue?.category === undefined) {
      isValid = false;
      toast.warn(t('Select Category'));
    } else if (recipeStateValue?.difficulty_level === undefined) {
      isValid = false;
      toast.warn(t('Select Difficulty Level'));
    }

    if (isValid) {
      const newColumns = {
        ...recipeStateValue,
        name: currentName,
      };

      recipeState(newColumns);
      setVisible('hidden');
      currentStep('2');
    }
  }

  useEffect(() => {
    console.log(recipeStateValue);
    if (currentStepValue !== '1') {
      setVisible('hidden');
    }

    if (editRecipeNameRef.current && visible === 'block') {
      editRecipeNameRef.current.focus();
      scrollToTop(popupContainerRef);
    }
  }, [currentStepValue, recipeStateValue, visible, popupContainerRef]);

  const changeName = (event: any) => {
    const thisCurrentName = event.currentTarget.textContent;

    setCurrentName(thisCurrentName);
  };

  // Change nutrition form items
  const setFormOfNutrition = (status: boolean, item: string): void => {
    const newColumns = {
      ...recipeStateValue,
      [item.toLowerCase()]: status,
    };

    recipeState(newColumns);
  };

  // Change recipe category
  const updateCategory = (value: OptionTypeBase) => {
    const newColumns = {
      ...recipeStateValue,
      category: value.label,
    };

    recipeState(newColumns);
  };

  // change recipe difficulty level
  const updateDifficultyLevel = (value: OptionTypeBase) => {
    const newColumns = {
      ...recipeStateValue,
      difficulty_level: parseFloat(value.value),
    };

    recipeState(newColumns);
  };

  return (
    <>
      <div className={visible}>
        <div className="pt-20 font-light text-base">Bitte setzen hier die allgemeinen Daten für dein neues Rezept!</div>
        <div className="flex gap-40 pt-4">
          <div className="font-light my-auto w-120">Name:</div>
          <div className="flex-1">
            <div className="font-light left text-xs border-opacity-30 w-full">
              <span
                className="appearance-none block py-1 px-2 rounded-md text-base placeholder-gray-400 focus:outline-none bg-lightDarkGray bg-opacity-20 text-white border-solid border border-white border-opacity-30"
                role="textbox"
                contentEditable
                suppressContentEditableWarning
                onInput={e => changeName(e)}
                ref={editRecipeNameRef}
              >
                {recipeStateValue?.name}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-40 pt-4">
          <div className="font-light my-auto w-120">Kategorie:</div>
          <div className="flex-1">
            <CustomSelect
              name="category"
              dropDownOption={recipeCategoryValues}
              defaultValue={recipeCategoryValues.filter(st => st.label === recipeStateValue?.category)}
              onChange={updateCategory}
            />
          </div>
        </div>
        <div className="flex gap-40 pt-4">
          <div className="font-light my-auto w-120">Schwierigkeitsgrad:</div>
          <div className="flex-1">
            <CustomSelect
              name="difficultyLevel"
              dropDownOption={difficultyValues}
              defaultValue={difficultyValues.filter(st => parseFloat(st.value) === recipeStateValue?.difficulty_level)}
              onChange={updateDifficultyLevel}
            />
          </div>
        </div>
        <div className="flex gap-40 pt-40 pb-20">
          <div className="font-light">Für welche Ernährungsform ist dieses Rezept geeignet?</div>
        </div>
        <div className="mb-100">
          {formOfNutrition.map((item: string, index: number) => (
            <>
              <SwitchButton
                key={index}
                label={item}
                enabled={Boolean(recipeStateValue[item.toLowerCase()])}
                isBackground={index % 2 === 0}
                onChange={setFormOfNutrition}
              />
            </>
          ))}
        </div>
        <RecipeStepSwitch
          returnFunction={jumpToNextStep}
          nextFunction={jumpToNextStep}
          currentStepValue="1"
          totalSteps={6}
        />
      </div>
    </>
  );
};

export default NewRecipeStep1;
