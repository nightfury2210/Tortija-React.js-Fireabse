import React, { useContext, useMemo } from 'react';
import SwitchSelector from 'react-switch-selector';
import { useTranslation } from 'react-i18next';
import ReactLoading from 'react-loading';
import { OptionTypeBase } from 'react-select';
import { AdjustmentsIcon } from '@heroicons/react/outline';
import Drawer from 'components/Drawer';
import Headline from 'components/Headline';
import { OptionType } from 'react-switch-selector/dist/SwitchSelector';
import ButtonGroup from 'components/ButtonGroup';
import MultiRangeSlider from 'components/MultiRangeSlider';
import { eatingHabitsOption, formOfNutrition, intolerancesOption } from 'shared/constants/profile-wizard';
import { MainContext } from 'providers/MainProvider';
import { FilterContext } from 'providers/FilterProvider';
import SwitchButton from 'components/SwitchButton';
import CustomSelect from 'components/CustomSelect';
import {
  difficultyGroup,
  defaultCaloriesRange,
  defaultCarbohydratesRange,
  defaultProteinRange,
  defaultFatRange,
} from 'shared/constants/filter';
import styles from './styles.module.scss';

type Props = {
  isFilterOpen?: boolean;
  closeFilterOpen: (value: boolean) => void;
  filterType: string;
  changeFilterType: (value: any) => void;
  recipesOption: OptionType[];
};

const FilterDrawer: React.FC<Props> = ({
  isFilterOpen = false,
  closeFilterOpen,
  filterType,
  changeFilterType,
  recipesOption,
}) => {
  const { t } = useTranslation();
  const { ingredientList } = useContext(MainContext);
  const {
    initialDifficulty,
    changeDifficulty,
    initialNutrition,
    changeNutrition,
    initialEatingHabits,
    changeEatingHabits,
    initialIntolerances,
    changeIncompatibilities,
    caloriesRange,
    changeCaloriesRange,
    carbohydratesRange,
    changeCarbohydratesRange,
    proteinRange,
    changeProteinRange,
    myFavoritesValue,
    changeMyFavoritesValue,
    myRecipesValue,
    changeMyRecipesValue,
    fatRange,
    changeFatRange,
    ingredientsFilter,
    changeIngredient,
    ingredientsNotIncludeFilter,
    changeIngredientNotInclude,
  } = useContext(FilterContext);

  const ingredientsItems: OptionType[] = useMemo(
    () => ingredientList?.map(ingredient => ({ value: ingredient.name.toLowerCase(), label: ingredient.name })) ?? [],
    [ingredientList]
  );

  const changeIngredientGroup = (value: OptionTypeBase[] | OptionTypeBase) => {
    changeIngredient(value.map((item: OptionTypeBase) => item.value));
  };

  const changeIngredientNotIncludeGroup = (value: OptionTypeBase[] | OptionTypeBase) => {
    changeIngredientNotInclude(value.map((item: OptionTypeBase) => item.value));
  };

  const selectCaloriesRange = ([min, max]: number[]) => {
    if (caloriesRange !== { min, max }) {
      changeCaloriesRange({ min, max });
    }
  };

  const selectCarbohydratesRange = ([min, max]: number[]) => {
    if (carbohydratesRange !== { min, max }) {
      changeCarbohydratesRange({ min, max });
    }
  };

  const selectProteinRange = ([min, max]: number[]) => {
    if (proteinRange !== { min, max }) {
      changeProteinRange({ min, max });
    }
  };

  const selectFatRange = ([min, max]: number[]) => {
    if (fatRange !== { min, max }) {
      changeFatRange({ min, max });
    }
  };

  const changeDifficultyValue = (value: string[] | string) => {
    changeDifficulty(value as string[]);
  };

  const changeEatingHabitsValue = (value: string[] | string) => {
    changeEatingHabits(value as string[]);
  };

  const changeNutritionValue = (value: string[] | string) => {
    changeNutrition(value as string[]);
  };

  const changeIntolerancesValue = (value: string[] | string) => {
    changeIncompatibilities(value as string[]);
  };

  const setMyFavorites = (status: boolean, item: string): void => {
    changeMyFavoritesValue(status, item);
    changeMyRecipesValue(false, 'Meine Rezepte');
  };

  const setMyRecipes = (status: boolean, item: string): void => {
    changeMyRecipesValue(status, item);
    changeMyFavoritesValue(false, 'Meine Favoriten');
  };

  return (
    <Drawer isOpen={isFilterOpen} closeDrawer={closeFilterOpen}>
      <div className={styles.header}>
        <AdjustmentsIcon width={28} height={28} className={styles.filterIcon} />
        <Headline level={3}>{t('Filter')}</Headline>
      </div>
      <SwitchSelector
        onChange={changeFilterType}
        options={recipesOption}
        initialSelectedIndex={0}
        backgroundColor="#3D4045"
        fontColor="white"
        fontSize={20}
        selectionIndicatorMargin={0}
      />
      <div className={styles.wrapper}>
        {filterType === 'recipes' ? (
          <>
            <SwitchButton label="Meine Favoriten" enabled={myFavoritesValue} onChange={setMyFavorites} notContainer />
            <SwitchButton label="Meine Rezepte" enabled={myRecipesValue} onChange={setMyRecipes} notContainer />
            <MultiRangeSlider
              label="Calories"
              min={defaultCaloriesRange.min}
              max={defaultCaloriesRange.max}
              value={caloriesRange}
              onChange={selectCaloriesRange}
            />
            <hr className={styles.divider} />
            <MultiRangeSlider
              label="Carbohydrates"
              min={defaultCarbohydratesRange.min}
              max={defaultCarbohydratesRange.max}
              value={carbohydratesRange}
              onChange={selectCarbohydratesRange}
            />
            <hr className={styles.divider} />
            <MultiRangeSlider
              label="Protein"
              min={defaultProteinRange.min}
              max={defaultProteinRange.max}
              value={proteinRange}
              onChange={selectProteinRange}
            />
            <hr className={styles.divider} />
            <MultiRangeSlider
              label="Fat"
              min={defaultFatRange.min}
              max={defaultFatRange.max}
              value={fatRange}
              onChange={selectFatRange}
            />
            <hr className={styles.divider} />
            <ButtonGroup
              options={difficultyGroup}
              initialOption={initialDifficulty}
              label="Level of difficulty"
              itemsClassName="grid-cols-3"
              changeSelectedItem={changeDifficultyValue}
            />
            <hr className={styles.divider} />
            <ButtonGroup
              options={formOfNutrition}
              initialOption={initialNutrition}
              label="Form of nutrition"
              itemsClassName="grid-cols-3"
              changeSelectedItem={changeNutritionValue}
            />
            <hr className={styles.divider} />
            <ButtonGroup
              options={eatingHabitsOption}
              initialOption={initialEatingHabits}
              label="Eating habits"
              changeSelectedItem={changeEatingHabitsValue}
              itemsClassName="grid-cols-2"
            />
            <hr className={styles.divider} />
            <ButtonGroup
              options={intolerancesOption}
              initialOption={initialIntolerances}
              label="Intolerances"
              itemsClassName="grid-cols-3"
              changeSelectedItem={changeIntolerancesValue}
            />
          </>
        ) : !ingredientList ? (
          <div className={styles.loading}>
            <ReactLoading type="bubbles" width={50} height={20} color="#84502B" />
          </div>
        ) : (
          <>
            <div className="font-extralight">
              Hier kannst du nach Zutaten suchen (Mehrfachauswahl möglich) und der Filter sucht nach Rezepten wo diese
              Zutaten enthalten sind.
            </div>
            <CustomSelect
              label="Zutaten"
              name="goal"
              className={styles.selector}
              dropDownOption={ingredientsItems}
              isSearchable
              isMulti
              onChange={(value: OptionTypeBase[] | OptionTypeBase) => changeIngredientGroup(value)}
              defaultValue={ingredientsFilter?.map(item => ({ value: item.toLowerCase(), label: item }))}
            />
            <CustomSelect
              label="Not Include"
              name="notGoal"
              className={styles.selector}
              dropDownOption={ingredientsItems}
              isSearchable
              isMulti
              onChange={(value: OptionTypeBase[] | OptionTypeBase) => changeIngredientNotIncludeGroup(value)}
              defaultValue={ingredientsNotIncludeFilter?.map(item => ({ value: item.toLowerCase(), label: item }))}
            />
          </>
        )}
      </div>
    </Drawer>
  );
};

export default FilterDrawer;
