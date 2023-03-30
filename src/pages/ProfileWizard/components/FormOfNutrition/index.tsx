import React, { useContext, useEffect, useRef } from 'react';
import { AuthContext } from 'providers/AuthProvider';
import { useTranslation } from 'react-i18next';
import SwitchButton from 'components/SwitchButton';
import Headline from 'components/Headline';
import { formOfNutrition, stepLists } from 'shared/constants/profile-wizard';

type Props = {
  isProfile?: boolean;
};

export default function FormOfNutrition({ isProfile = false }: Props) {
  const authContext = useContext(AuthContext);
  const { t } = useTranslation();
  const elRef = useRef<HTMLDivElement>(null);

  const setFormOfNutrition = (status: boolean, item: string): void => {
    let prevFormOfNutrition = authContext.userData?.formOfNutrition ?? '';
    if (status) {
      prevFormOfNutrition = item;
    } else {
      prevFormOfNutrition = '';
    }
    authContext.setUserData((prevProfile: UserInfo) => ({
      ...prevProfile,
      formOfNutrition: prevFormOfNutrition,
    }));
  };

  useEffect(() => {
    authContext.setUserData((prevProfile: UserInfo) => ({
      ...prevProfile,
      formOfNutrition: prevProfile?.formOfNutrition ?? '',
    }));
    if (!isProfile) {
      elRef.current!.scrollIntoView({ behavior: 'smooth' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-20">
      <div ref={elRef}>
        <Headline className="capitalize" centered level={1}>
          {t(stepLists[2].title)}
        </Headline>
      </div>
      {formOfNutrition.map((item: string, index: number) => (
        <SwitchButton
          key={index}
          label={item}
          isBackground={index % 2 === 0}
          enabled={authContext.userData?.formOfNutrition !== undefined && authContext.userData.formOfNutrition === item}
          onChange={setFormOfNutrition}
        />
      ))}
    </div>
  );
}
