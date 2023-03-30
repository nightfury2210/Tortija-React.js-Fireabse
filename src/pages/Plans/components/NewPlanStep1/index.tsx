import React, { useState, useEffect, useRef } from 'react';
import Button from 'components/Button';
import { useTranslation } from 'react-i18next';
import RecipeStepSwitch from '../../../Nutrition/components/RecipeStepSwitch';

type Props = {
  className?: string;
  currentStep?: any;
  currentStepValue?: string;
  planState?: any;
  planStateValue?: any;
  popupContainerRef?: any;
};

const NewPlanStep1: React.FC<Props> = ({
  currentStep,
  currentStepValue,
  planState,
  planStateValue,
  popupContainerRef,
}) => {
  const [visible, setVisible] = useState('block');
  const { t } = useTranslation();

  function jumpToNextStep(type: string) {
    const newColumns = {
      ...planStateValue,
      planType: type,
    };

    planState(newColumns);
    setVisible('hidden');
    currentStep('2');
  }

  useEffect(() => {
    if (currentStepValue !== '1') {
      setVisible('hidden');
    }
  }, [currentStepValue, visible]);

  return (
    <>
      <div className={visible}>
        <div className="px-20">
          <div className="pt-20 font-light text-base">Wie möchtest du deinen Plan erstellen?</div>
        </div>
        <div className="px-40 py-40">
          <div>
            <div>
              <Button className="w-full" onClick={() => jumpToNextStep('scratch')}>
                Mit leerem Plan starten und flexibel anpassen
              </Button>
            </div>
            <div className="text-12 font-extralight text-center pt-5 px-40">
              Wähle deine Rezepte und Lebensmittel selbst aus oder lass dir einzelne Mahlzeiten von unserem Alghorithmus
              vorschlagen
            </div>
          </div>
          <div className="pt-30">
            <div>
              <Button className="w-full" onClick={() => jumpToNextStep('copy')}>
                Einen vorhandenen Plan kopieren
              </Button>
            </div>
            <div className="text-12 font-extralight text-center pt-5 px-40">
              Kopiere dir einen deiner bereits erstellten Pläne und passe diesen an
            </div>
          </div>
          <div className="pt-30">
            <div>
              <Button className="w-full" onClick={() => jumpToNextStep('alghorithmus')}>
                Plan vom Alghorithmus erstellen lassen
              </Button>
            </div>
            <div className="text-12 font-extralight text-center pt-5 px-40">
              Rezepte und Lebensmittel werden dir komplett von unserem Alghortihmus vorgeschlagen. Du kannst im
              Anschluss auch noch flexibel anpassen
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewPlanStep1;
