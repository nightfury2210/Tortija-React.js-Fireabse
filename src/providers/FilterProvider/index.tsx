import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { AuthContext } from 'providers/AuthProvider';
import {
  defaultCaloriesRange as caloriesRangeConst,
  defaultCarbohydratesRange as carbohydratesRangeConst,
  defaultProteinRange as proteinRangeConst,
  defaultFatRange as fatRangeConst,
} from 'shared/constants/filter';
import { formOfNutrition, intolerancesOption } from 'shared/constants/profile-wizard';

type ContextProps = {
  initialDifficulty: string[];
  changeDifficulty: Function;
  initialEatingHabits: string[];
  changeEatingHabits: Function;
  initialNutrition: string[];
  changeNutrition: Function;
  initialIntolerances: string[];
  changeIncompatibilities: Function;
  caloriesRange: { min: number; max: number };
  changeCaloriesRange: Function;
  carbohydratesRange: { min: number; max: number };
  changeCarbohydratesRange: Function;
  proteinRange: { min: number; max: number };
  changeProteinRange: Function;
  fatRange: { min: number; max: number };
  changeFatRange: Function;
  thermomixValue: boolean;
  changeThermomixValue: (status: boolean, item: string) => void;
  myFavoritesValue: boolean;
  changeMyFavoritesValue: (status: boolean, item: string) => void;
  myRecipesValue: boolean;
  changeMyRecipesValue: (status: boolean, item: string) => void;
  ingredientsFilter: string[];
  changeIngredient: Function;
  ingredientsNotIncludeFilter: string[];
  changeIngredientNotInclude: Function;
  nutritionSearchValue: string;
  setNutritionSearchValue: Function;
};

type Props = {
  children: ReactNode;
};

export const FilterContext = createContext<ContextProps>({
  initialDifficulty: [],
  changeDifficulty: () => {},
  initialEatingHabits: [],
  changeEatingHabits: () => {},
  initialNutrition: [],
  changeNutrition: () => {},
  initialIntolerances: [],
  changeIncompatibilities: () => {},
  caloriesRange: { min: 0, max: 0 },
  changeCaloriesRange: () => {},
  carbohydratesRange: { min: 0, max: 0 },
  changeCarbohydratesRange: () => {},
  proteinRange: { min: 0, max: 0 },
  changeProteinRange: () => {},
  fatRange: { min: 0, max: 0 },
  changeFatRange: () => {},
  thermomixValue: true,
  changeThermomixValue: () => {},
  myFavoritesValue: false,
  changeMyFavoritesValue: () => {},
  myRecipesValue: false,
  changeMyRecipesValue: () => {},
  ingredientsFilter: [],
  changeIngredient: () => {},
  ingredientsNotIncludeFilter: [],
  changeIngredientNotInclude: () => {},
  nutritionSearchValue: '',
  setNutritionSearchValue: () => {},
});

export const FilterProvider = ({ children }: Props) => {
  const [initialDifficulty, changeDifficulty] = useState<string[]>([]);
  const [initialNutrition, changeNutrition] = useState<string[]>([]);
  const [initialEatingHabits, changeEatingHabits] = useState<string[]>([]);
  const [initialIntolerances, changeIncompatibilities] = useState<string[]>([]);
  const [caloriesRange, changeCaloriesRange] = useState({ min: caloriesRangeConst.min, max: caloriesRangeConst.max });
  const [carbohydratesRange, changeCarbohydratesRange] = useState({
    min: carbohydratesRangeConst.min,
    max: carbohydratesRangeConst.max,
  });
  const [proteinRange, changeProteinRange] = useState({ min: proteinRangeConst.min, max: proteinRangeConst.max });
  const [fatRange, changeFatRange] = useState({ min: fatRangeConst.min, max: fatRangeConst.max });
  const [thermomixValue, changeThermomixValue] = useState(true);
  const [myFavoritesValue, changeMyFavoritesValue] = useState(false);
  const [myRecipesValue, changeMyRecipesValue] = useState(false);
  const [nutritionSearchValue, setNutritionSearchValue] = useState('');

  const [ingredientsFilter, changeIngredient] = useState([]);
  const [ingredientsNotIncludeFilter, changeIngredientNotInclude] = useState([]);

  const { userData } = useContext(AuthContext);

  const setInitialRecipeFilterData = () => {
    changeNutrition(formOfNutrition.filter(item => userData?.formOfNutrition.includes(item)));
    // changeEatingHabits(eatingHabitsOption.filter(item => userData?.eatingHabits.includes(item)));
    changeIncompatibilities(intolerancesOption.filter(item => userData?.incompatibilities.includes(item)));
  };

  useEffect(() => {
    // setInitialRecipeFilterData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FilterContext.Provider
      value={{
        initialDifficulty,
        changeDifficulty,
        initialEatingHabits,
        changeEatingHabits,
        initialNutrition,
        changeNutrition,
        initialIntolerances,
        changeIncompatibilities,
        caloriesRange,
        changeCaloriesRange,
        carbohydratesRange,
        changeCarbohydratesRange,
        proteinRange,
        changeProteinRange,
        fatRange,
        changeFatRange,
        thermomixValue,
        changeThermomixValue,
        myFavoritesValue,
        changeMyFavoritesValue,
        myRecipesValue,
        changeMyRecipesValue,
        ingredientsFilter,
        changeIngredient,
        ingredientsNotIncludeFilter,
        changeIngredientNotInclude,
        nutritionSearchValue,
        setNutritionSearchValue,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
