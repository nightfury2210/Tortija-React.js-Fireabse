import React, { useContext, useMemo } from 'react';
import { OptionTypeBase } from 'react-select';
import { useTranslation } from 'react-i18next';

import CustomInput from 'components/Input/custom-input';
import CustomSelect from 'components/CustomSelect';
import Headline from 'components/Headline';
import { AuthContext } from 'providers/AuthProvider';
import { genderOption, stepLists } from 'shared/constants/profile-wizard';

export default function FirstPersonalInformation() {
  const { t } = useTranslation();
  const authContext = useContext(AuthContext);
  const genderChange = (value: OptionTypeBase) => {
    authContext.setUserData((prevProfile: UserInfo) => ({ ...prevProfile, gender: value.value }));
  };
  const ageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    authContext.setUserData((prevProfile: UserInfo) => ({ ...prevProfile, age: event.target.value }));
  };
  const sizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    authContext.setUserData((prevProfile: UserInfo) => ({ ...prevProfile, bodySize: event.target.value }));
  };
  const weightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    authContext.setUserData((prevProfile: UserInfo) => ({ ...prevProfile, bodyWeight: event.target.value }));
  };

  const defaultGenderValue = useMemo(
    () => genderOption.filter(item => item.value === authContext.userData?.gender),
    [authContext.userData?.gender]
  );

  return (
    <div className="space-y-20">
      <Headline className="capitalize" centered level={1}>
        {t(stepLists[0].title)}
      </Headline>
      <CustomSelect
        name="gender"
        dropDownOption={genderOption}
        label={t('Gender')}
        isSearchable
        onChange={genderChange}
        defaultValue={defaultGenderValue}
      />
      <CustomInput
        name="age"
        type="number"
        label={t('Age')}
        defaultValue={authContext.userData?.age}
        onChange={ageChange}
      />
      <CustomInput
        name="bodySize"
        type="number"
        label={t('Body Size')}
        defaultValue={authContext.userData?.bodySize}
        onChange={sizeChange}
        suffix="cm"
      />
      <CustomInput
        name="bodyWeight"
        type="number"
        label={t('Body Weight')}
        defaultValue={authContext.userData?.bodyWeight}
        onChange={weightChange}
        suffix="kg"
      />
    </div>
  );
}
