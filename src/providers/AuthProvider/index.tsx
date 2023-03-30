import React, { createContext, ReactNode, useEffect, useState } from 'react';
import firebase from 'services/firebase';
import { physicalStrainOption, yourGoal } from 'shared/constants/profile-wizard';

type ContextProps = {
  user?: firebase.User | null;
  userData?: UserInfo;
  authenticated?: boolean;
  setUser: React.Dispatch<React.SetStateAction<firebase.User | null>>;
  setUserData: React.Dispatch<React.SetStateAction<UserInfo>>;
  loadingAuthState?: boolean;
};

type Props = {
  children: ReactNode;
};

export const AuthContext = createContext<ContextProps>({ setUser: () => {}, setUserData: () => {} });

const dCaloriesList = [-300, 300, 0];

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [userData, setUserData] = useState<UserInfo>({} as UserInfo);
  const [loadingAuthState, setLoadingAuthState] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const updateUserData = async (authUser: firebase.User | null) => {
    setLoadingAuthState(true);
    try {
      setAuthenticated(authUser !== null);
      const userInfo = (await firebase.firestore().collection('users').doc(authUser?.uid).get()).data();
      setUser(authUser);
      setUserData(userInfo as UserInfo);
      setLoadingAuthState(false);
    } catch (error: any) {
      setLoadingAuthState(false);
    }
  };

  useEffect(() => {
    const age = parseFloat(userData?.age ?? '') ?? 0;
    const height = parseFloat(userData?.bodySize ?? '') ?? 0;
    const weight = parseFloat(userData?.bodyWeight ?? '') ?? 0;
    let calories = 0;
    if (userData?.gender === 'man') {
      calories = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (userData?.gender === 'woman') {
      calories = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    const pal = physicalStrainOption.find(item => item.value === userData?.physicalStrainChange)?.pal ?? 1;
    calories *= pal;

    const dCalories = dCaloriesList[yourGoal.findIndex(goal => goal === userData.goal)] ?? 0;
    calories += dCalories;

    setUserData((prevProfile: UserInfo) => ({ ...prevProfile, calories: calories.toFixed(2) }));
  }, [
    userData?.age,
    userData?.bodySize,
    userData?.bodyWeight,
    userData?.gender,
    userData.goal,
    userData?.physicalStrainChange,
  ]);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((authUser: firebase.User | null) => {
      updateUserData(authUser as firebase.User);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        authenticated,
        setUser,
        setUserData,
        loadingAuthState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
