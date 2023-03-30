import React, { useContext, useEffect, useRef } from 'react';
import { AuthContext } from 'providers/AuthProvider';
import { useTranslation } from 'react-i18next';
import SwitchButton from 'components/SwitchButton';
import Headline from 'components/Headline';
import { GoalDescription, stepLists, yourGoal } from 'shared/constants/profile-wizard';

type Props = {
  isProfile?: boolean;
};

export default function GoalStep({ isProfile = false }: Props) {
  const authContext = useContext(AuthContext);
  const { t } = useTranslation();
  const elRef = useRef<HTMLDivElement>(null);

  const setGoal = (status: boolean, item: string): void => {
    let prevGoal = authContext.userData?.goal ?? '';
    if (status) {
      prevGoal = item;
    } else {
      prevGoal = '';
    }

    authContext.setUserData((prevProfile: UserInfo) => ({
      ...prevProfile,
      goal: prevGoal,
    }));
  };

  useEffect(() => {
    authContext.setUserData((prevProfile: UserInfo) => ({
      ...prevProfile,
      goal: prevProfile?.goal ?? '',
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
          {t(stepLists[1].title)}
        </Headline>
      </div>
      {yourGoal.map((item: string, index: number) => (
        <div key={index}>
          <SwitchButton
            label={item}
            isBackground
            enabled={authContext.userData?.goal !== undefined && authContext.userData.goal === item}
            onChange={setGoal}
          />
          <Headline className="mt-2 capitalize" centered level={6}>
            {t(GoalDescription[index])}
          </Headline>
        </div>
      ))}
    </div>
  );
}
