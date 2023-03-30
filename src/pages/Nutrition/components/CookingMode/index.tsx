import React from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  className?: string;
  step?: any;
  stepFunction?: any;
  descriptionArray?: any;
};

const CookingMode: React.FC<Props> = ({ step, stepFunction, descriptionArray }) => {
  const { t } = useTranslation();
  const thisDescriptionArray = descriptionArray?.filter((st: any) => parseFloat(st.id) === step - 1)[0].text;

  return (
    <>
      <div className="pt-40 pb-60 px-40">
        <div className="text-3xl text-brownSemiDark font-bold pr-10 pb-15">{step}.</div>
        <div className="text-3xl font-bold leading-10">{thisDescriptionArray}</div>
      </div>
    </>
  );
};

export default CookingMode;
