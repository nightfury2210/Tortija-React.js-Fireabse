import React from 'react';
import Button from 'components/Button';
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon } from '@heroicons/react/outline';
import { useTranslation } from 'react-i18next';
import ReactLoading from 'react-loading';

type Props = {
  className?: string;
  currentStepValue?: string;
  returnFunction?: any;
  nextFunction?: any;
  isFinished?: boolean;
  totalSteps?: number;
  lazyload?: boolean;
};

const RecipeStepSwitch: React.FC<Props> = ({
  currentStepValue,
  returnFunction,
  nextFunction,
  isFinished,
  totalSteps,
  lazyload = false,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="absolute bottom-30 w-full flex justify-between bg-blackDark -ml-20 -mr-40">
        <div>
          <Button className="w-full rounded-none py-10 px-10" onClick={() => returnFunction()}>
            <ChevronLeftIcon height={30} width={30} />
          </Button>
        </div>
        <div className="my-auto">
          Schritt {currentStepValue} von {totalSteps || 5}
        </div>
        <div>
          <Button className="w-full rounded-none py-10 px-10" onClick={() => !lazyload && nextFunction()}>
            {isFinished ? (
              <CheckIcon height={30} width={30} />
            ) : lazyload ? (
              <ReactLoading type="bars" width={30} height={30} color="white" />
            ) : (
              <ChevronRightIcon height={30} width={30} />
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default RecipeStepSwitch;
