import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toast';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { scrollToTop } from 'shared/functions/global';
import { CalendarIcon } from '@heroicons/react/outline';
import RecipeStepSwitch from '../../../Nutrition/components/RecipeStepSwitch';

type Props = {
  className?: string;
  currentStep?: any;
  currentStepValue?: string;
  planState?: any;
  planStateValue?: any;
  popupContainerRef?: any;
};

const NewPlanStep2: React.FC<Props> = ({
  currentStep,
  currentStepValue,
  planState,
  planStateValue,
  popupContainerRef,
}) => {
  const [visible, setVisible] = useState('block');
  const [currentName, setCurrentName] = useState(planStateValue?.name);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const onChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  const { t } = useTranslation();

  const editPlanNameRef = useRef<HTMLDivElement>(null);

  function jumpToNextStep() {
    let isValid = true;

    if (currentName === '' || currentName === undefined) {
      isValid = false;
      toast.warn(t('Select Name'));
    }

    if (isValid) {
      const newColumns = {
        ...planStateValue,
        name: currentName,
      };

      planState(newColumns);
      setVisible('hidden');
      currentStep('3');
    }
  }

  function returnToPreviousStep() {
    setVisible('hidden');
    currentStep('1');
  }

  useEffect(() => {
    if (currentStepValue !== '2') {
      setVisible('hidden');
    }

    if (editPlanNameRef.current && visible === 'block') {
      editPlanNameRef.current.focus();
      scrollToTop(popupContainerRef);
    }
  }, [currentStepValue, planStateValue, visible, popupContainerRef]);

  const changeName = (event: any) => {
    const thisCurrentName = event.currentTarget.textContent;

    setCurrentName(thisCurrentName);
  };

  const CustomInput = (props: React.HTMLProps<HTMLInputElement>, ref: React.Ref<HTMLInputElement>) => {
    return (
      <label>
        <div className="flex w-full">
          <div className="flex-1">
            <input {...props} />
          </div>
          <div className="ml-10 my-auto">
            <CalendarIcon width={25} height={25} className="text-brownSemiDark mx-auto cursor-pointer" />
          </div>
        </div>
      </label>
    );
  };

  return (
    <>
      <div className={visible}>
        <div className="px-20">
          <div className="pt-20 font-light text-base">
            Bitte trage hier die allgemeinen Daten für deinen neuen Plan ein!
          </div>
          <div>
            <div className="pt-20 font-extralight pb-1">Gib deinem Plan einen Namen:</div>
            <div className="flex">
              <div className="w-3/4">
                <div className="font-light left text-xs border-opacity-30 w-full">
                  <span
                    className="appearance-none block py-1 px-2 rounded-md text-base placeholder-gray-400 focus:outline-none bg-lightDarkGray bg-opacity-20 text-white border-solid border border-white border-opacity-30"
                    role="textbox"
                    contentEditable
                    suppressContentEditableWarning
                    onInput={e => changeName(e)}
                    ref={editPlanNameRef}
                  >
                    {planStateValue?.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="pb-100">
            <div className="pt-20 font-extralight">Wie lange soll dein Plan laufen?</div>
            <div className="font-extralight pb-1">Gib hier bitte einen Zeitraum ein:</div>

            <div className="flex">
              <div className="w-3/4 font-light left text-xs border-opacity-30">
                <DatePicker
                  className="w-full appearance-none block py-1 px-2 rounded-md text-base placeholder-gray-400 focus:outline-none bg-lightDarkGray bg-opacity-20 text-white border-solid border border-white border-opacity-30"
                  selected={startDate}
                  onChange={onChange}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  dateFormat="dd.MM.yyyy"
                  minDate={moment().toDate()}
                  withPortal
                  customInput={React.createElement(React.forwardRef(CustomInput))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <RecipeStepSwitch
        returnFunction={returnToPreviousStep}
        nextFunction={jumpToNextStep}
        currentStepValue="2"
        totalSteps={3}
      />
    </>
  );
};

export default NewPlanStep2;
