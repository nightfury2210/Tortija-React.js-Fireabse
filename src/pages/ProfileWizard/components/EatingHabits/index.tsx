import React, { useContext, useEffect, useRef } from 'react';
import { AuthContext } from 'providers/AuthProvider';
import { useTranslation } from 'react-i18next';
import SwitchButton from 'components/SwitchButton';
import Headline from 'components/Headline';
import { eatingHabitsOption, stepLists } from 'shared/constants/profile-wizard';

type Props = {
  isProfile?: boolean;
};

export default function EatingHabits({ isProfile = false }: Props) {
  const authContext = useContext(AuthContext);
  const { t } = useTranslation();
  const elRef = useRef<HTMLDivElement>(null);

  const setEatingHabits = (status: boolean, item: string): void => {
    const prevEatingHabits = authContext.userData?.eatingHabits ?? [];
    if (status) {
      prevEatingHabits.push(item);
    } else {
      prevEatingHabits.splice(
        prevEatingHabits.findIndex(element => element === item),
        1
      );
    }
    authContext.setUserData((prevProfile: UserInfo) => ({
      ...prevProfile,
      eatingHabits: prevEatingHabits,
    }));
  };

  useEffect(() => {
    authContext.setUserData((prevProfile: UserInfo) => ({
      ...prevProfile,
      eatingHabits: prevProfile?.eatingHabits ?? [],
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
          {t(stepLists[3].title)}
        </Headline>
      </div>
      {eatingHabitsOption.map((item: string, index: number) => (
        <SwitchButton
          key={index}
          label={item}
          isBackground={index % 2 === 0}
          enabled={authContext.userData?.eatingHabits !== undefined && authContext.userData.eatingHabits.includes(item)}
          onChange={setEatingHabits}
        />
      ))}
    </div>
  );
}
