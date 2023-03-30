import React, { useContext, useEffect, useRef } from 'react';
import { AuthContext } from 'providers/AuthProvider';
import { useTranslation } from 'react-i18next';
import SwitchButton from 'components/SwitchButton';
import Headline from 'components/Headline';
import { intolerancesOption, stepLists } from 'shared/constants/profile-wizard';

type Props = {
  isProfile?: boolean;
};

export default function Incompatibilities({ isProfile = false }: Props) {
  const authContext = useContext(AuthContext);
  const { t } = useTranslation();
  const elRef = useRef<HTMLDivElement>(null);

  const setIncompatibilities = (status: boolean, item: string): void => {
    const prevIncompatibilities = authContext.userData?.incompatibilities ?? [];
    if (status) {
      prevIncompatibilities.push(item);
    } else {
      prevIncompatibilities.splice(
        prevIncompatibilities.findIndex(element => element === item),
        1
      );
    }
    authContext.setUserData((prevProfile: UserInfo) => ({
      ...prevProfile,
      incompatibilities: prevIncompatibilities,
    }));
  };

  useEffect(() => {
    authContext.setUserData((prevProfile: UserInfo) => ({
      ...prevProfile,
      incompatibilities: prevProfile?.incompatibilities ?? [],
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
          {t(stepLists[4].title)}
        </Headline>
      </div>
      {intolerancesOption.map((item: string, index: number) => (
        <SwitchButton
          key={index}
          label={item}
          isBackground={index % 2 === 0}
          enabled={
            authContext.userData?.incompatibilities !== undefined &&
            authContext.userData.incompatibilities.includes(item)
          }
          onChange={setIncompatibilities}
        />
      ))}
    </div>
  );
}
