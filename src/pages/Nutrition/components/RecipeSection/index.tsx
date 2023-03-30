import React, { useContext, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/outline';

import Card from 'components/Card';
import Skeleton from 'components/skeleton';
import { FilterContext } from 'providers/FilterProvider';
import { MainContext } from 'providers/MainProvider';
import { getRoundedValue } from 'shared/functions/global';
import { difficultyGroup } from 'shared/constants/filter';
import styles from './styles.module.scss';

const RecipeSection: React.FC = () => {
  const {
    initialNutrition,
    initialDifficulty,
    initialEatingHabits,
    initialIntolerances,
    myFavoritesValue,
    myRecipesValue,
    caloriesRange,
    carbohydratesRange,
    proteinRange,
    fatRange,
    ingredientsFilter,
    ingredientsNotIncludeFilter,
    nutritionSearchValue,
  } = useContext(FilterContext);

  const { recipesList, favoritesRecipesList } = useContext(MainContext);

  const history = useHistory();

  const recipesFilteredList: RecipesType[] = useMemo(() => {
    if (!recipesList) return [];
    return recipesList.filter(
      element =>
        (initialDifficulty.length === 0 ||
          initialDifficulty.findIndex(
            item => element.difficulty_level === difficultyGroup.findIndex(difficulty => difficulty === item) + 1
          ) > -1) &&
        (initialNutrition.length === 0 || initialNutrition.findIndex(item => element[item.toLowerCase()]) > -1) &&
        (initialEatingHabits.length === 0 || initialEatingHabits.findIndex(item => element[item.toLowerCase()]) > -1) &&
        (initialIntolerances.length === 0 ||
          initialIntolerances.findIndex(item => element[item.toLowerCase()]) === -1) &&
        (myRecipesValue === false || (myRecipesValue === true && element.userRecipe === true)) &&
        (myFavoritesValue === false ||
          (myFavoritesValue === true &&
            favoritesRecipesList?.find(item => item.origId === element.uid) !== undefined)) &&
        parseFloat(element.kcal_total) >= caloriesRange.min &&
        parseFloat(element.kcal_total) <= caloriesRange.max &&
        parseFloat(element.carbohydrates_total) >= carbohydratesRange.min &&
        parseFloat(element.carbohydrates_total) <= carbohydratesRange.max &&
        parseFloat(element.protein_total) >= proteinRange.min &&
        parseFloat(element.protein_total) <= proteinRange.max &&
        parseFloat(element.fat_total) >= fatRange.min &&
        parseFloat(element.fat_total) <= fatRange.max &&
        element.name.toLowerCase().includes(nutritionSearchValue.toLowerCase()) &&
        (ingredientsFilter.length === 0 ||
          ingredientsFilter.findIndex(
            (name: string) =>
              element.ingredients.findIndex((item: Ingredients) => item.name.toLowerCase() === name.toLowerCase()) ===
              -1
          ) === -1) &&
        (ingredientsNotIncludeFilter.length === 0 ||
          ingredientsNotIncludeFilter.findIndex(
            (name: string) =>
              element.ingredients.findIndex((item: Ingredients) => item.name.toLowerCase() === name.toLowerCase()) > -1
          ) === -1)
    );
  }, [
    caloriesRange.max,
    caloriesRange.min,
    carbohydratesRange.max,
    carbohydratesRange.min,
    fatRange.max,
    fatRange.min,
    favoritesRecipesList,
    ingredientsFilter,
    ingredientsNotIncludeFilter,
    initialDifficulty,
    initialEatingHabits,
    initialIntolerances,
    initialNutrition,
    myFavoritesValue,
    myRecipesValue,
    nutritionSearchValue,
    proteinRange.max,
    proteinRange.min,
    recipesList,
  ]);

  function goToDetailPage(uid: string) {
    const thisScrollPos = document.getElementById('mainContainer')?.scrollTop;

    history.push({
      pathname: `/nutrition/recipes/${uid}`,
      state: { from: 'nutrition', scrollPos: thisScrollPos },
    });
  }

  return (
    <div className={styles.wrapper}>
      {/* skeleton loading */}
      {!recipesList
        ? Array.from(Array(15).keys()).map((_, index) => (
            <Card className="mx-auto" key={`skeleton${index}`} isLoading>
              <Skeleton className={styles.skeletonTitle} translucent />
              <div className={styles.description}>
                <div className={styles.center}>
                  <Skeleton className={styles.skeletonValue} translucent />
                  <p className="text-8">KC</p>
                </div>
                <div className={styles.center}>
                  <Skeleton className={styles.skeletonValue} translucent />
                  <p className="text-8">EW</p>
                </div>
                <div className={styles.center}>
                  <Skeleton className={styles.skeletonValue} translucent />
                  <p className="text-8">FT</p>
                </div>
                <div className={styles.center}>
                  <Skeleton className={styles.skeletonValue} translucent />
                  <p className="text-8">KH</p>
                </div>
              </div>
            </Card>
          ))
        : recipesFilteredList.map((recipe: RecipesType, index: number) => (
            <div
              className="cursor-pointer"
              key={index}
              onClick={() => goToDetailPage(recipe.uid)}
              onKeyDown={() => goToDetailPage(recipe.uid)}
              aria-hidden="true"
            >
              <Card image={recipe.imageUrl} className="mx-auto relative">
                {favoritesRecipesList?.find(item => item.origId === recipe.uid) !== undefined && (
                  <div className="absolute top-7 right-10 bg-white rounded-full p-5">
                    <div>
                      <HeartIcon width={20} height={20} className="text-brownSemiDark" fill="#C97132" />
                    </div>
                  </div>
                )}
                {recipe.userRecipe && (
                  <div className="absolute top-10 left-10 bg-brownSemiDark text-10 font-bold rounded-full px-10 py-1">
                    <div>Eigenes Rezept</div>
                  </div>
                )}
                <div className={styles.title}>{recipe.name}</div>
                <div className={styles.description}>
                  <div className={styles.center}>
                    <p>{getRoundedValue(recipe.kcal_total)}</p>
                    <p className="text-8">KC</p>
                  </div>
                  <div className={styles.center}>
                    <p>{getRoundedValue(recipe.protein_total)}</p>
                    <p className="text-8">EW</p>
                  </div>
                  <div className={styles.center}>
                    <p>{getRoundedValue(recipe.fat_total)}</p>
                    <p className="text-8">FT</p>
                  </div>
                  <div className={styles.center}>
                    <p>{getRoundedValue(recipe.carbohydrates_total)}</p>
                    <p className="text-8">KH</p>
                  </div>
                </div>
              </Card>
            </div>
          ))}
    </div>
  );
};

export default RecipeSection;
