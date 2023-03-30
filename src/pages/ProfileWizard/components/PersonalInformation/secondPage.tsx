import React, { useContext, useMemo } from 'react';
import { OptionTypeBase } from 'react-select';
import { useTranslation } from 'react-i18next';

import CustomInput from 'components/Input/custom-input';
import CustomSelect from 'components/CustomSelect';
import Headline from 'components/Headline';
import { AuthContext } from 'providers/AuthProvider';
import { physicalStrainOption, stepLists } from 'shared/constants/profile-wizard';

type Props = {
  hiddenHeader?: boolean;
};

export default function SecondPersonalInformation({ hiddenHeader = false }: Props) {
  const { t } = useTranslation();
  const authContext = useContext(AuthContext);
  const caloriesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    authContext.setUserData((prevProfile: UserInfo) => ({ ...prevProfile, calories: event.target.value }));
  };
  const physicalStrainChange = (value: OptionTypeBase) => {
    authContext.setUserData((prevProfile: UserInfo) => ({
      ...prevProfile,
      physicalStrainChange: value.value,
    }));
  };

  const defaultPhysicalStrainValue = useMemo(
    () => physicalStrainOption.filter(item => item.value === authContext.userData?.physicalStrainChange),
    [authContext.userData?.physicalStrainChange]
  );

  return (
    <div className="space-y-20">
      {!hiddenHeader && (
        <Headline className="capitalize" centered level={1}>
          {t(stepLists[0].title)}
        </Headline>
      )}
      <CustomSelect
        name="physicalStrain"
        dropDownOption={physicalStrainOption}
        defaultValue={defaultPhysicalStrainValue}
        label={t('Physical strain')}
        isSearchable
        onChange={physicalStrainChange}
      />
      <CustomInput
        name="calories"
        type="number"
        label={t('Calories')}
        value={authContext.userData?.calories}
        onChange={caloriesChange}
      />
    </div>
  );
}
