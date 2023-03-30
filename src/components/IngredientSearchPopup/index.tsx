import React, { useState, useRef, useMemo, useContext, useEffect } from 'react';
import Select, { OptionTypeBase } from 'react-select';
import SwitchSelector from 'react-switch-selector';
import _ from 'lodash';
import classNames from 'classnames';
import { PlusIcon, XIcon, SearchIcon, TrashIcon, PencilIcon, AdjustmentsIcon } from '@heroicons/react/outline';
import { toast } from 'react-toast';
import { useTranslation } from 'react-i18next';

import Button from 'components/Button';
import CustomUserInput from 'components/CustomUserInput';
import FilterDrawer from 'pages/Nutrition/components/FilterDrawer';
import Headline from 'components/Headline';
import IngredientSearchPopupItem from 'components/IngredientSearchPopupItem';
import SearchBox from 'components/SearchBox';
import { FilterContext } from 'providers/FilterProvider';
import { MainContext } from 'providers/MainProvider';
import { customSelectStyles } from 'shared/constants/global';
import { difficultyGroup } from 'shared/constants/filter';
import { getIngridientMacros, handleOpenClosePopups } from 'shared/functions/global';
import { intolerancesOption } from 'shared/constants/profile-wizard';
import styles from './style.module.scss';

type Props = {
  openerClass?: string;
  setOpenerClass?: any;
  recipeObject?: RecipesType[];
  updateRecipeState?: any;
  recipeStateValue?: any;
  setRecipeChanged?: any;
  mealType?: any;
  popupType?: string;
  updateDayId?: number;
};

const IngredientSearchPopup: React.FC<Props> = ({
  openerClass = 'hidden',
  setOpenerClass,
  updateRecipeState,
  recipeStateValue,
  setRecipeChanged,
  mealType,
  popupType,
  updateDayId,
}) => {
  const { t } = useTranslation();

  const {
    initialNutrition,
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
    initialDifficulty,
  } = useContext(FilterContext);
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');
  const { recipesList, favoritesRecipesList } = useContext(MainContext);
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
        element.name.toLowerCase().includes(currentSearchQuery.toLowerCase()) &&
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
    currentSearchQuery,
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
    proteinRange.max,
    proteinRange.min,
    recipesList,
  ]);

  const [accessToken, setAccessToken] = useState('');
  const [currentIngridientSearchApi, setCurrentIngridientSearchApi] = useState({ foods: { food: [{}] } as any });
  const [currentIngridientSearch, setCurrentIngridientSearch] = useState(false);
  const [currentIngridientSearchAutocomplete, setCurrentIngridientSearchAutocomplete] = useState({
    suggestions: { suggestion: [''] },
  });
  const [directAddedIngridients, setDirectAddedIngridients] = useState<any[]>([]);
  const [currentAddRecipe, setCurrentAddRecipe] = useState<any>({
    ingredients: [],
    description: [],
    kcal_total: '0',
    carbohydrates_total: '0',
    protein_total: '0',
    fat_total: '0',
    vegetarian: false,
    ketogen: false,
    vegan: false,
  });
  const [currentEditIngridientAPIFoodId, setCurrentEditIngridientAPIFoodId] = useState('');
  const [currentEditIngridientType, setCurrentEditIngridientType] = useState('');
  const [currentEditIngridientPiece, setCurrentEditIngridientPiece] = useState('g');
  const [editPopupOverlayClass, setEditPopupOverlayClass] = useState('hidden');
  const [popupOverlayClass, setPopupOverlayClass] = useState('hidden');
  const [currentEditIngridientKcalValue, setCurrentEditIngridientKcalValue] = useState(0);
  const [currentEditIngridientCarbohydratesValue, setCurrentEditIngridientCarbohydratesValue] = useState(0);
  const [currentEditIngridientProteinValue, setCcurrentEditIngridientProteinValue] = useState(0);
  const [currentEditIngridientFatValue, setCurrentEditIngridientFatValue] = useState(0);
  const [currentEditIngridientKcalTotal, setCurrentEditIngridientKcalTotal] = useState(0);
  const [currentEditIngridientCarbohydratesTotal, setCurrentEditIngridientCarbohydratesTotal] = useState(0);
  const [currentEditIngridientProteinTotal, setCurrentEditIngridientProteinTotal] = useState(0);
  const [currentEditIngridientFatTotal, setCurrentEditIngridientFatTotal] = useState(0);
  const [currentEditIngridientPortionValues, setCurrentEditIngridientPortionValues] = useState<OptionTypeBase[]>([]);
  const [currentEditIngridientDefaultPiece, setCurrentEditIngridientDefaultPiece] = useState('g');
  const [currentEditIngridientPreselectG, setCurrentEditIngridientPreselectG] = useState('');
  const [currentEditIngridientPreselectType, setCurrentEditIngridientPreselectType] = useState('');
  const [currentEditIngridientKcal100g, setCurrentEditIngridientKcal100g] = useState('');
  const [currentEditIngridientCarbohydrates100g, setCurrentEditIngridientCarbohydrates100g] = useState('');
  const [currentEditIngridientProtein100g, setCurrentEditIngridientProtein100g] = useState('');
  const [currentEditIngridientFat100g, setCurrentEditIngridientFat100g] = useState('');
  const [currentEditIngridientCategory, setCurrentEditIngridientCategory] = useState('');
  const [currentEditIngridientName, setCurrentEditIngridientName] = useState('');
  const [currentEditIngridientID, setCurrentEditIngridientID] = useState('1');
  const [currentEditInitialIngridientAmount, setCurrentEditInitialIngridientAmount] = useState('1');
  const [currentEditIngridientAmount, setCurrentEditIngridientAmount] = useState('1');
  const [currentEditIngridientImageUrl, setCurrentEditIngridientImageUrl] = useState('');
  const [currentEditIngridientMetricServingAmountValue, setCurrentEditIngridientMetricServingAmountValue] =
    useState('');

  const searchIngridientRef = useRef<HTMLInputElement>(null);
  const editIngridientRef = useRef<HTMLInputElement>(null);

  const recipesOption = [
    {
      label: t('Recipes'),
      value: 'recipes',
    },
    {
      label: t('Food'),
      value: 'food',
    },
  ];
  const [isFilterOpen, setFilterOpen] = useState(false);

  const filterOpen = () => {
    setFilterOpen(true);
  };

  const [filterType, setFilterType] = useState(recipesOption[0].value);
  const [currentSection, setCurrentSection] = useState<any>(recipesOption[0].value);

  const { ingredientList } = useContext(MainContext);

  const ingredientFilteredList = useMemo(
    () => ingredientList?.filter(element => element.name.toLowerCase().includes(currentSearchQuery.toLowerCase())),
    [ingredientList, currentSearchQuery]
  );

  function addChangedIngridientAPI() {
    let thisCurrentKcalComplete = 0;
    let thisCurrentKHComplete = 0;
    let thisCurrentEWComplete = 0;
    let thisCurrentFTComplete = 0;

    let getIngridientServingData;
    let currentServingDescription;
    let ingridientKcal100g;
    let ingridientKH100g;
    let ingridientEW100g;
    let ingridientFT100g;
    let thisPieceValue = currentEditIngridientPiece;

    let thisCurrentPlanDayObject = {} as any;

    if (popupType === 'plan') {
      thisCurrentPlanDayObject = recipeStateValue?.dayEntries.filter((item: any) => item.id === updateDayId)[0];
    }

    fetch(
      `https://static.tortija.de/interfaces/apis/getIngridientApi.php?token=${accessToken}&id=${currentEditIngridientAPIFoodId}`
    )
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.food.servings.serving)) {
          getIngridientServingData = data.food.servings.serving.filter((item: any) => item.is_default === '1');
          currentServingDescription = getIngridientServingData[0].serving_description.replace(/\s+/g, '');
        } else {
          getIngridientServingData = [data.food.servings.serving];
          currentServingDescription = data.food.servings.serving.serving_description.replace(/\s+/g, '');
        }

        if (currentEditIngridientPiece.includes('(')) {
          thisPieceValue = currentEditIngridientPiece.substr(0, currentEditIngridientPiece.indexOf('(') - 1);
        }

        if (getIngridientServingData[0].metric_serving_amount) {
          ingridientKcal100g = Math.round(
            (parseFloat(getIngridientServingData[0].calories) * 100) /
              parseFloat(getIngridientServingData[0].metric_serving_amount)
          );
          ingridientKH100g = Math.round(
            (parseFloat(getIngridientServingData[0].carbohydrate) * 100) /
              parseFloat(getIngridientServingData[0].metric_serving_amount)
          );
          ingridientEW100g = Math.round(
            (parseFloat(getIngridientServingData[0].protein) * 100) /
              parseFloat(getIngridientServingData[0].metric_serving_amount)
          );
          ingridientFT100g = Math.round(
            (parseFloat(getIngridientServingData[0].fat) * 100) /
              parseFloat(getIngridientServingData[0].metric_serving_amount)
          );
        } else {
          ingridientKcal100g = Math.round(parseFloat(getIngridientServingData[0].calories));
          ingridientKH100g = Math.round(parseFloat(getIngridientServingData[0].carbohydrate));
          ingridientEW100g = Math.round(parseFloat(getIngridientServingData[0].protein));
          ingridientFT100g = Math.round(parseFloat(getIngridientServingData[0].fat));
        }

        if (popupType === 'plan') {
          thisCurrentKcalComplete = Math.round(
            parseFloat(thisCurrentPlanDayObject?.kcal_total!) + currentEditIngridientKcalTotal
          );

          thisCurrentKHComplete = Math.round(
            parseFloat(thisCurrentPlanDayObject?.carbohydrates_total!) + currentEditIngridientCarbohydratesTotal
          );

          thisCurrentEWComplete = Math.round(
            parseFloat(thisCurrentPlanDayObject?.protein_total!) + currentEditIngridientProteinTotal
          );

          thisCurrentFTComplete = Math.round(
            parseFloat(thisCurrentPlanDayObject?.fat_total!) + currentEditIngridientFatTotal
          );
        } else {
          thisCurrentKcalComplete = Math.round(
            parseFloat(recipeStateValue?.kcal_total!) + currentEditIngridientKcalTotal
          );

          thisCurrentKHComplete = Math.round(
            parseFloat(recipeStateValue?.carbohydrates_total!) + currentEditIngridientCarbohydratesTotal
          );

          thisCurrentEWComplete = Math.round(
            parseFloat(recipeStateValue?.protein_total!) + currentEditIngridientProteinTotal
          );

          thisCurrentFTComplete = Math.round(parseFloat(recipeStateValue?.fat_total!) + currentEditIngridientFatTotal);
        }

        let thisFoodCategory = 'Sonstiges';
        if (data.food.food_sub_categories) {
          if (Array.isArray(data.food.food_sub_categories.food_sub_category)) {
            thisFoodCategory = data.food.food_sub_categories.food_sub_category[1].toString();
          } else {
            thisFoodCategory = data.food.food_sub_categories.food_sub_category;
          }
        }

        const thisIngridientObject = {
          id: currentEditIngridientAPIFoodId,
          name: currentEditIngridientName,
          amount: parseFloat(currentEditIngridientAmount),
          initial_amount: parseFloat(currentEditIngridientAmount),
          piece: thisPieceValue,
          kcal_100g: ingridientKcal100g,
          carbohydrates_100g: ingridientKH100g,
          protein_100g: ingridientEW100g,
          fat_100g: ingridientFT100g,
          kcal_total: currentEditIngridientKcalTotal,
          carbohydrates_total: currentEditIngridientCarbohydratesTotal,
          protein_total: currentEditIngridientProteinTotal,
          fat_total: currentEditIngridientFatTotal,
          preselect_g:
            (getIngridientServingData[0].metric_serving_amount &&
              getIngridientServingData[0].metric_serving_amount.substr(
                0,
                getIngridientServingData[0].metric_serving_amount.indexOf('.')
              )) ||
            100,
          category: thisFoodCategory,
          serving_id: getIngridientServingData[0].serving_id,
          serving_unit: getIngridientServingData[0].metric_serving_unit,
          serving_data: data.food.servings,
        };

        let newColumns = {
          ...recipeStateValue,
          kcal_total: thisCurrentKcalComplete,
          carbohydrates_total: thisCurrentKHComplete,
          protein_total: thisCurrentEWComplete,
          fat_total: thisCurrentFTComplete,
        };

        if (popupType === 'plan') {
          newColumns = {
            ...recipeStateValue,
            dayEntries: recipeStateValue.dayEntries.map((entries: any) => {
              if (parseFloat(entries.id) !== updateDayId) return entries;
              return {
                ...entries,
                kcal_total: thisCurrentKcalComplete,
                carbohydrates_total: thisCurrentKHComplete,
                protein_total: thisCurrentEWComplete,
                fat_total: thisCurrentFTComplete,
                [mealType]: {
                  ...entries[mealType],
                  ingredients: [thisIngridientObject, ...entries[mealType].ingredients],
                },
              };
            }),
          };
        } else {
          newColumns = {
            ...newColumns,
            ingredients: [...recipeStateValue.ingredients, thisIngridientObject],
          };
        }

        setCurrentIngridientSearchAutocomplete({ suggestions: { suggestion: [''] } });
        if (!Number.isNaN(parseFloat(currentEditIngridientAmount))) {
          toast.success('Das Lebensmittel wurde erfolgreich hinzugefügt!');
          console.log(newColumns);
          updateRecipeState(newColumns);
          if (popupType !== 'plan') {
            setCurrentIngridientSearch(false);
            setCurrentSearchQuery('');
            setRecipeChanged(true);
            setDirectAddedIngridients([thisIngridientObject, ...directAddedIngridients]);
          }
        } else {
          toast.error('Die eigegebenen Daten enthielten Fehler!');
        }
        handleOpenClosePopups(setEditPopupOverlayClass, setPopupOverlayClass, 'both');
      });
  }

  const changeIngridientAmountAPI = (event: any) => {
    const thisCurrentInitialAmount = event.target.value;
    let thisCurrentAmount = event.target.value;
    let ingridientKcalNew: number;
    let ingridientKhNew: number;
    let ingridientEwNew: number;
    let ingridientFtNew: number;

    // Replace Comma with Point for calculating results
    thisCurrentAmount = thisCurrentAmount.replace(',', '.');

    if (Number.isNaN(parseFloat(thisCurrentAmount))) {
      thisCurrentAmount = 0;
    }

    if (thisCurrentAmount === '') {
      thisCurrentAmount = 0;
    }

    if (currentEditIngridientPiece !== 'g' && currentEditIngridientPiece !== 'ml') {
      ingridientKcalNew = Math.round(parseFloat(thisCurrentAmount) * currentEditIngridientKcalValue);

      ingridientKhNew = Math.round(parseFloat(thisCurrentAmount) * currentEditIngridientCarbohydratesValue);

      ingridientEwNew = Math.round(parseFloat(thisCurrentAmount) * currentEditIngridientProteinValue);

      ingridientFtNew = Math.round(parseFloat(thisCurrentAmount) * currentEditIngridientFatValue);
    } else if (currentEditIngridientMetricServingAmountValue !== '') {
      ingridientKcalNew = Math.round(
        (parseFloat(thisCurrentAmount) /
          parseFloat(
            currentEditIngridientMetricServingAmountValue.substr(
              0,
              currentEditIngridientMetricServingAmountValue.indexOf('.')
            )
          )) *
          currentEditIngridientKcalValue
      );

      ingridientKhNew = Math.round(
        (parseFloat(thisCurrentAmount) /
          parseFloat(
            currentEditIngridientMetricServingAmountValue.substr(
              0,
              currentEditIngridientMetricServingAmountValue.indexOf('.')
            )
          )) *
          currentEditIngridientCarbohydratesValue
      );

      ingridientEwNew = Math.round(
        (parseFloat(thisCurrentAmount) /
          parseFloat(
            currentEditIngridientMetricServingAmountValue.substr(
              0,
              currentEditIngridientMetricServingAmountValue.indexOf('.')
            )
          )) *
          currentEditIngridientProteinValue
      );

      ingridientFtNew = Math.round(
        (parseFloat(thisCurrentAmount) /
          parseFloat(
            currentEditIngridientMetricServingAmountValue.substr(
              0,
              currentEditIngridientMetricServingAmountValue.indexOf('.')
            )
          )) *
          currentEditIngridientFatValue
      );
    } else {
      ingridientKcalNew = (parseFloat(thisCurrentAmount) / 100) * currentEditIngridientKcalValue;
      ingridientKhNew = (parseFloat(thisCurrentAmount) / 100) * currentEditIngridientCarbohydratesValue;
      ingridientEwNew = (parseFloat(thisCurrentAmount) / 100) * currentEditIngridientProteinValue;
      ingridientFtNew = (parseFloat(thisCurrentAmount) / 100) * currentEditIngridientFatValue;
    }

    setCurrentEditIngridientAmount(thisCurrentInitialAmount);
    setCurrentEditIngridientKcalTotal(Math.round(ingridientKcalNew));
    setCurrentEditIngridientCarbohydratesTotal(Math.round(ingridientKhNew));
    setCurrentEditIngridientProteinTotal(Math.round(ingridientEwNew));
    setCurrentEditIngridientFatTotal(Math.round(ingridientFtNew));
    // setCurrentEditIngridientMetricServingAmountValue('');
  };

  const changeIngridientAmount = (event: any) => {
    const thisCurrentInitialAmount = event.target.value;
    let thisCurrentAmount = event.target.value;
    let ingridientKcalNew;
    let ingridientKhNew;
    let ingridientEwNew;
    let ingridientFtNew;
    let getIngridientRecipeData = [] as any;
    let getIngridient = [] as any;

    // Replace Comma with Point for calculating results
    thisCurrentAmount = thisCurrentAmount.replace(',', '.');

    if (Number.isNaN(parseFloat(thisCurrentAmount))) {
      thisCurrentAmount = 0;
    }

    if (thisCurrentAmount === '') {
      thisCurrentAmount = 1;
    }

    if (currentEditIngridientType === 'notAdded') {
      getIngridientRecipeData = ingredientList?.filter((item: any) => item.name === currentEditIngridientName);
    } else {
      getIngridientRecipeData = currentAddRecipe?.ingredients.filter(
        (item: any) => item.id === currentEditIngridientID
      );
    }

    getIngridient = ingredientList?.filter((item: any) => item.name === currentEditIngridientName);

    if (currentEditIngridientPiece !== 'g' && currentEditIngridientPiece !== 'ml') {
      ingridientKcalNew = Math.round(
        ((parseFloat(thisCurrentAmount) * parseFloat(getIngridientRecipeData[0].preselect_g)) / 100) *
          parseFloat(getIngridient[0].kcal_100g)
      );

      ingridientKhNew = Math.round(
        ((parseFloat(thisCurrentAmount) * parseFloat(getIngridientRecipeData[0].preselect_g)) / 100) *
          parseFloat(getIngridient[0].carbohydrates_100g)
      );

      ingridientEwNew = Math.round(
        ((parseFloat(thisCurrentAmount) * parseFloat(getIngridientRecipeData[0].preselect_g)) / 100) *
          parseFloat(getIngridient[0].protein_100g)
      );

      ingridientFtNew = Math.round(
        ((parseFloat(thisCurrentAmount) * parseFloat(getIngridientRecipeData[0].preselect_g)) / 100) *
          parseFloat(getIngridient[0].fat_100g)
      );
    } else {
      ingridientKcalNew = Math.round((parseFloat(getIngridient[0].kcal_100g) / 100) * thisCurrentAmount);

      ingridientKhNew = Math.round((parseFloat(getIngridient[0].carbohydrates_100g) / 100) * thisCurrentAmount);

      ingridientEwNew = Math.round((parseFloat(getIngridient[0].protein_100g) / 100) * thisCurrentAmount);

      ingridientFtNew = Math.round((parseFloat(getIngridient[0].fat_100g) / 100) * thisCurrentAmount);
    }

    setCurrentEditIngridientAmount(thisCurrentInitialAmount);
    setCurrentEditIngridientKcalTotal(ingridientKcalNew);
    setCurrentEditIngridientCarbohydratesTotal(ingridientKhNew);
    setCurrentEditIngridientProteinTotal(ingridientEwNew);
    setCurrentEditIngridientFatTotal(ingridientFtNew);
  };

  function getPrimaryPieceValue(ingridientData: any) {
    let thisPieceValue = '';

    if (ingridientData.serving_data.serving && ingridientData.serving_data.serving instanceof Array) {
      ingridientData.serving_data.serving.map((serving: any, index: any) => {
        if (
          serving.measurement_description !== 'g' &&
          serving.measurement_description !== 'ml' &&
          serving.serving_description !== '100ml' &&
          serving.serving_description !== '100g' &&
          serving.is_default === '1' &&
          !serving.serving_description.includes('(')
        ) {
          thisPieceValue =
            (serving.serving_description.includes('1 ') &&
              serving.serving_description.substr(2, serving.serving_description.length)) ||
            `${serving.serving_description} `;

          if (
            serving.measurement_description !== 'g' &&
            serving.measurement_description !== 'ml' &&
            !serving.measurement_description.includes('g)') &&
            !serving.measurement_description.includes('ml)')
          ) {
            thisPieceValue = `${thisPieceValue} (${serving.metric_serving_amount.substr(
              0,
              serving.metric_serving_amount.indexOf('.')
            )} ${serving.metric_serving_unit})`;
          }
        }

        if (
          serving.measurement_description !== 'g' &&
          serving.measurement_description !== 'ml' &&
          serving.serving_description !== '100ml' &&
          serving.serving_description !== '100g' &&
          serving.is_default === '1' &&
          serving.serving_description.includes('(')
        ) {
          thisPieceValue =
            (serving.serving_description.includes('1 ') &&
              serving.serving_description.substr(2, serving.serving_description.indexOf('(') - 3)) ||
            `${serving.serving_description.substr(0, serving.serving_description.indexOf('(') - 3)} `;

          if (
            serving.measurement_description !== 'g' &&
            serving.measurement_description !== 'ml' &&
            !serving.measurement_description.includes('g)') &&
            !serving.measurement_description.includes('ml)')
          ) {
            thisPieceValue = `${thisPieceValue} (${serving.metric_serving_amount.substr(
              0,
              serving.metric_serving_amount.indexOf('.')
            )} ${serving.metric_serving_unit})`;
          }
        }

        return '';
      });

      return thisPieceValue;
    }

    if (
      ingridientData.serving_data.serving &&
      !(ingridientData.serving_data.serving instanceof Array) &&
      ingridientData.serving_data.serving.serving_description !== '100ml' &&
      ingridientData.serving_data.serving.serving_description !== '100g' &&
      !ingridientData.serving_data.serving.serving_description.includes('(')
    ) {
      thisPieceValue =
        (ingridientData.serving_data.serving.serving_description.includes('1 ') &&
          ingridientData.serving_data.serving.serving_description.substr(
            2,
            ingridientData.serving_data.serving.serving_description.length
          )) ||
        ingridientData.serving_data.serving.serving_description;

      if (
        ingridientData.serving_data.serving.measurement_description !== 'g' &&
        ingridientData.serving_data.serving.measurement_description !== 'ml' &&
        !ingridientData.serving_data.serving.measurement_description.includes('g)') &&
        !ingridientData.serving_data.serving.measurement_description.includes('ml)') &&
        ingridientData.serving_data.serving.metric_serving_amount
      ) {
        thisPieceValue = `${thisPieceValue} (${ingridientData.serving_data.serving.metric_serving_amount.substr(
          0,
          ingridientData.serving_data.serving.metric_serving_amount.indexOf('.')
        )} ${ingridientData.serving_data.serving.metric_serving_unit})`;
      }

      return thisPieceValue;
    }

    if (
      ingridientData.serving_data.serving &&
      !(ingridientData.serving_data.serving instanceof Array) &&
      ingridientData.serving_data.serving.serving_description !== '100ml' &&
      ingridientData.serving_data.serving.serving_description !== '100g' &&
      ingridientData.serving_data.serving.serving_description.includes('(')
    ) {
      thisPieceValue =
        (ingridientData.serving_data.serving.serving_description.includes('1 ') &&
          ingridientData.serving_data.serving.serving_description.substr(
            2,
            ingridientData.serving_data.serving.serving_description.indexOf('(') - 3
          )) ||
        ingridientData.serving_data.serving.serving_description.substr(
          0,
          ingridientData.serving_data.serving.serving_description.indexOf('(') - 3
        );

      if (
        ingridientData.serving_data.serving.measurement_description !== 'g' &&
        ingridientData.serving_data.serving.measurement_description !== 'ml' &&
        !ingridientData.serving_data.serving.measurement_description.includes('g)') &&
        !ingridientData.serving_data.serving.measurement_description.includes('ml)') &&
        ingridientData.serving_data.serving.metric_serving_amount
      ) {
        thisPieceValue = `${thisPieceValue} (${ingridientData.serving_data.serving.metric_serving_amount.substr(
          0,
          ingridientData.serving_data.serving.metric_serving_amount.indexOf('.')
        )} ${ingridientData.serving_data.serving.metric_serving_unit})`;
      }

      return thisPieceValue;
    }
    return thisPieceValue;
  }

  function addIngridientDirectAPI(food_id: string) {
    let thisCurrentKcalComplete = 0;
    let thisCurrentKHComplete = 0;
    let thisCurrentEWComplete = 0;
    let thisCurrentFTComplete = 0;

    let getIngridientServingData;
    let currentServingDescription;
    let thisAmount;
    let ingridientKcal100g;
    let ingridientKH100g;
    let ingridientEW100g;
    let ingridientFT100g;

    let thisCurrentPlanDayObject = {} as any;

    if (popupType === 'plan') {
      thisCurrentPlanDayObject = recipeStateValue?.dayEntries.filter((item: any) => item.id === updateDayId)[0];
    }

    fetch(`https://static.tortija.de/interfaces/apis/getIngridientApi.php?token=${accessToken}&id=${food_id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.food.servings.serving)) {
          getIngridientServingData = data.food.servings.serving.filter((item: any) => item.is_default === '1');
          currentServingDescription = getIngridientServingData[0].serving_description.replace(/\s+/g, '');
        } else {
          getIngridientServingData = [data.food.servings.serving];
          currentServingDescription = data.food.servings.serving.serving_description.replace(/\s+/g, '');
        }

        let thisPiece;
        if (getIngridientServingData[0].serving_description.includes('1 ')) {
          if (
            getIngridientServingData[0].serving_description.includes('g)') ||
            getIngridientServingData[0].serving_description.includes('ml)')
          ) {
            thisPiece = getIngridientServingData[0].serving_description.substr(
              2,
              getIngridientServingData[0].serving_description.indexOf(' (') - 2
            );
          } else {
            thisPiece = getIngridientServingData[0].serving_description.substr(
              2,
              getIngridientServingData[0].serving_description.length
            );
          }
        } else {
          thisPiece = getIngridientServingData[0].serving_description;
        }
        if (thisPiece.includes('(')) {
          thisPiece = thisPiece.substr(0, thisPiece.indexOf('(') - 1);
        }

        if (
          currentServingDescription === '100ml' ||
          currentServingDescription === '100g' ||
          getIngridientServingData[0].measurement_description === 'g' ||
          getIngridientServingData[0].measurement_description === 'ml'
        ) {
          if (
            getIngridientServingData[0].metric_serving_unit === 'ml' ||
            getIngridientServingData[0].measurement_description === 'ml'
          ) {
            thisPiece = 'ml';
          } else {
            thisPiece = 'g';
          }
        }

        if (
          currentServingDescription !== '100ml' &&
          currentServingDescription !== '100g' &&
          getIngridientServingData[0].measurement_description !== 'g' &&
          getIngridientServingData[0].measurement_description !== 'ml'
        ) {
          thisAmount = getIngridientServingData[0].number_of_units.substr(
            0,
            getIngridientServingData[0].number_of_units.indexOf('.')
          );
        } else {
          thisAmount = 100;
        }

        if (getIngridientServingData[0].metric_serving_amount) {
          ingridientKcal100g = Math.round(
            (parseFloat(getIngridientServingData[0].calories) * 100) /
              parseFloat(getIngridientServingData[0].metric_serving_amount)
          );
          ingridientKH100g = Math.round(
            (parseFloat(getIngridientServingData[0].carbohydrate) * 100) /
              parseFloat(getIngridientServingData[0].metric_serving_amount)
          );
          ingridientEW100g = Math.round(
            (parseFloat(getIngridientServingData[0].protein) * 100) /
              parseFloat(getIngridientServingData[0].metric_serving_amount)
          );
          ingridientFT100g = Math.round(
            (parseFloat(getIngridientServingData[0].fat) * 100) /
              parseFloat(getIngridientServingData[0].metric_serving_amount)
          );
        } else {
          ingridientKcal100g = Math.round(parseFloat(getIngridientServingData[0].calories));
          ingridientKH100g = Math.round(parseFloat(getIngridientServingData[0].carbohydrate));
          ingridientEW100g = Math.round(parseFloat(getIngridientServingData[0].protein));
          ingridientFT100g = Math.round(parseFloat(getIngridientServingData[0].fat));
        }

        if (popupType === 'plan') {
          thisCurrentKcalComplete = Math.round(
            parseFloat(thisCurrentPlanDayObject?.kcal_total!) +
              Math.round(parseFloat(getIngridientServingData[0].calories))
          );

          thisCurrentKHComplete = Math.round(
            parseFloat(thisCurrentPlanDayObject?.carbohydrates_total!) +
              Math.round(parseFloat(getIngridientServingData[0].carbohydrate))
          );

          thisCurrentEWComplete = Math.round(
            parseFloat(thisCurrentPlanDayObject?.protein_total!) +
              Math.round(parseFloat(getIngridientServingData[0].protein))
          );

          thisCurrentFTComplete = Math.round(
            parseFloat(thisCurrentPlanDayObject?.fat_total!) + Math.round(parseFloat(getIngridientServingData[0].fat))
          );
        } else {
          thisCurrentKcalComplete = Math.round(
            parseFloat(recipeStateValue?.kcal_total!) + Math.round(parseFloat(getIngridientServingData[0].calories))
          );

          thisCurrentKHComplete = Math.round(
            parseFloat(recipeStateValue?.carbohydrates_total!) +
              Math.round(parseFloat(getIngridientServingData[0].carbohydrate))
          );

          thisCurrentEWComplete = Math.round(
            parseFloat(recipeStateValue?.protein_total!) + Math.round(parseFloat(getIngridientServingData[0].protein))
          );

          thisCurrentFTComplete = Math.round(
            parseFloat(recipeStateValue?.fat_total!) + Math.round(parseFloat(getIngridientServingData[0].fat))
          );
        }

        let thisFoodName = data.food.food_name;
        if (data.food.brand_name) {
          thisFoodName += ` (${data.food.brand_name})`;
        }

        let thisFoodCategory = 'Sonstiges';
        if (data.food.food_sub_categories) {
          if (Array.isArray(data.food.food_sub_categories.food_sub_category)) {
            thisFoodCategory = data.food.food_sub_categories.food_sub_category[1].toString();
          } else {
            thisFoodCategory = data.food.food_sub_categories.food_sub_category;
          }
        }

        const thisIngridientObject = {
          id: food_id,
          name: thisFoodName,
          amount: parseFloat(thisAmount),
          initial_amount: parseFloat(thisAmount),
          piece: thisPiece,
          kcal_100g: ingridientKcal100g,
          carbohydrates_100g: ingridientKH100g,
          protein_100g: ingridientEW100g,
          fat_100g: ingridientFT100g,
          kcal_total: Math.round(parseFloat(getIngridientServingData[0].calories)),
          carbohydrates_total: Math.round(parseFloat(getIngridientServingData[0].carbohydrate)),
          protein_total: Math.round(parseFloat(getIngridientServingData[0].protein)),
          fat_total: Math.round(parseFloat(getIngridientServingData[0].fat)),
          preselect_g:
            (getIngridientServingData[0].metric_serving_amount &&
              getIngridientServingData[0].metric_serving_amount.substr(
                0,
                getIngridientServingData[0].metric_serving_amount.indexOf('.')
              )) ||
            100,
          category: thisFoodCategory,
          serving_id: getIngridientServingData[0].serving_id,
          serving_unit: getIngridientServingData[0].metric_serving_unit,
          serving_data: data.food.servings,
        };

        let newColumns = {
          ...recipeStateValue,
          kcal_total: thisCurrentKcalComplete,
          carbohydrates_total: thisCurrentKHComplete,
          protein_total: thisCurrentEWComplete,
          fat_total: thisCurrentFTComplete,
        };

        if (popupType === 'plan') {
          newColumns = {
            ...recipeStateValue,
            dayEntries: recipeStateValue.dayEntries.map((entries: any) => {
              if (parseFloat(entries.id) !== updateDayId) return entries;
              return {
                ...entries,
                kcal_total: thisCurrentKcalComplete,
                carbohydrates_total: thisCurrentKHComplete,
                protein_total: thisCurrentEWComplete,
                fat_total: thisCurrentFTComplete,
                [mealType]: {
                  ...entries[mealType],
                  ingredients: [thisIngridientObject, ...entries[mealType].ingredients],
                },
              };
            }),
          };
        } else {
          newColumns = {
            ...newColumns,
            ingredients: [...recipeStateValue.ingredients, thisIngridientObject],
          };
        }

        if (popupType !== 'plan') {
          setCurrentIngridientSearch(false);
          setCurrentSearchQuery('');
        }

        setCurrentIngridientSearchAutocomplete({ suggestions: { suggestion: [''] } });
        if (!Number.isNaN(thisAmount)) {
          toast.success('Das Lebensmittel wurde erfolgreich hinzugefügt!');
          console.log(newColumns);
          updateRecipeState(newColumns);
          if (popupType !== 'plan') {
            setRecipeChanged(true);
            setDirectAddedIngridients([thisIngridientObject, ...directAddedIngridients]);
          }
        } else {
          toast.error('Die eigegebenen Daten enthielten Fehler!');
        }
      });
  }

  function getAPIIngridientData(food_id: string) {
    let getIngridientServingData;
    let currentServingDescription;
    let thisAmount;
    let ingridientKcal100g;
    let ingridientKH100g;
    let ingridientEW100g;
    let ingridientFT100g;

    fetch(`https://static.tortija.de/interfaces/apis/getIngridientApi.php?token=${accessToken}&id=${food_id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.food.servings.serving)) {
          getIngridientServingData = data.food.servings.serving.filter((item: any) => item.is_default === '1');
          currentServingDescription = getIngridientServingData[0].serving_description.replace(/\s+/g, '');
        } else {
          getIngridientServingData = [data.food.servings.serving];
          currentServingDescription = data.food.servings.serving.serving_description.replace(/\s+/g, '');
        }

        let thisPiece;
        if (getIngridientServingData[0].serving_description.includes('1 ')) {
          if (
            getIngridientServingData[0].serving_description.includes('g)') ||
            getIngridientServingData[0].serving_description.includes('ml)')
          ) {
            thisPiece = getIngridientServingData[0].serving_description.substr(
              2,
              getIngridientServingData[0].serving_description.indexOf(' (') - 2
            );
          } else {
            thisPiece = getIngridientServingData[0].serving_description.substr(
              2,
              getIngridientServingData[0].serving_description.length
            );
          }
        } else {
          thisPiece = getIngridientServingData[0].serving_description;
        }
        if (thisPiece.includes('(')) {
          thisPiece = thisPiece.substr(0, thisPiece.indexOf('(') - 1);
        }

        if (
          currentServingDescription === '100ml' ||
          currentServingDescription === '100g' ||
          getIngridientServingData[0].measurement_description === 'g' ||
          getIngridientServingData[0].measurement_description === 'ml'
        ) {
          if (
            getIngridientServingData[0].metric_serving_unit === 'ml' ||
            getIngridientServingData[0].measurement_description === 'ml'
          ) {
            thisPiece = 'ml';
          } else {
            thisPiece = 'g';
          }
        }

        if (
          currentServingDescription !== '100ml' &&
          currentServingDescription !== '100g' &&
          getIngridientServingData[0].measurement_description !== 'g' &&
          getIngridientServingData[0].measurement_description !== 'ml'
        ) {
          thisAmount = getIngridientServingData[0].number_of_units.substr(
            0,
            getIngridientServingData[0].number_of_units.indexOf('.')
          );
        } else {
          thisAmount = 100;
        }

        if (getIngridientServingData[0].metric_serving_amount) {
          ingridientKcal100g = Math.round(
            (parseFloat(getIngridientServingData[0].calories) * 100) /
              parseFloat(getIngridientServingData[0].metric_serving_amount)
          );
          ingridientKH100g = Math.round(
            (parseFloat(getIngridientServingData[0].carbohydrate) * 100) /
              parseFloat(getIngridientServingData[0].metric_serving_amount)
          );
          ingridientEW100g = Math.round(
            (parseFloat(getIngridientServingData[0].protein) * 100) /
              parseFloat(getIngridientServingData[0].metric_serving_amount)
          );
          ingridientFT100g = Math.round(
            (parseFloat(getIngridientServingData[0].fat) * 100) /
              parseFloat(getIngridientServingData[0].metric_serving_amount)
          );
        } else {
          ingridientKcal100g = Math.round(parseFloat(getIngridientServingData[0].calories));
          ingridientKH100g = Math.round(parseFloat(getIngridientServingData[0].carbohydrate));
          ingridientEW100g = Math.round(parseFloat(getIngridientServingData[0].protein));
          ingridientFT100g = Math.round(parseFloat(getIngridientServingData[0].fat));
        }

        let thisFoodName = data.food.food_name;
        if (data.food.brand_name) {
          thisFoodName += ` (${data.food.brand_name})`;
        }

        let thisFoodCategory = 'Sonstiges';
        if (data.food.food_sub_categories) {
          if (Array.isArray(data.food.food_sub_categories.food_sub_category)) {
            thisFoodCategory = data.food.food_sub_categories.food_sub_category[1].toString();
          } else {
            thisFoodCategory = data.food.food_sub_categories.food_sub_category;
          }
        }

        const thisIngridientObject = {
          id: food_id,
          name: thisFoodName,
          amount: thisAmount,
          piece: thisPiece,
          newAdded: true,
          kcal_100g: ingridientKcal100g,
          carbohydrates_100g: ingridientKH100g,
          protein_100g: ingridientEW100g,
          fat_100g: ingridientFT100g,
          kcal_total: Math.round(parseFloat(getIngridientServingData[0].calories)),
          carbohydrates_total: Math.round(parseFloat(getIngridientServingData[0].carbohydrate)),
          protein_total: Math.round(parseFloat(getIngridientServingData[0].protein)),
          fat_total: Math.round(parseFloat(getIngridientServingData[0].fat)),
          preselect_g:
            (getIngridientServingData[0].metric_serving_amount &&
              getIngridientServingData[0].metric_serving_amount.substr(
                0,
                getIngridientServingData[0].metric_serving_amount.indexOf('.')
              )) ||
            100,
          category: thisFoodCategory,
          serving_id: getIngridientServingData[0].serving_id,
          serving_unit: getIngridientServingData[0].metric_serving_unit,
          serving_data: data.food.servings,
        };

        setCurrentEditIngridientAPIFoodId(food_id);
        setCurrentEditIngridientType('notAdded');
        handleEditIngridientPopupAPI(thisIngridientObject);
      });
  }

  // DIRECT ADD: Add a non API ingridient without setting amount and piece (Plus icon)
  function addIngridientDirectInternal(
    piece: string,
    amount: number,
    preselect_g: string,
    kcal_100g: string,
    carbohydrates_100g: string,
    protein_100g: string,
    fat_100g: string,
    name: string,
    category: string,
    imageUrl: string,
    preselect_type: string,
    default_piece: string
  ) {
    let thisCurrentKcalComplete = 0;
    let thisCurrentKHComplete = 0;
    let thisCurrentEWComplete = 0;
    let thisCurrentFTComplete = 0;
    let thisCurrentPlanDayObject = {} as any;

    if (popupType === 'plan') {
      thisCurrentPlanDayObject = recipeStateValue?.dayEntries.filter((item: any) => item.id === updateDayId)[0];
    }

    if (piece !== 'g' && piece !== 'ml') {
      if (popupType !== 'plan') {
        thisCurrentKcalComplete = Math.round(
          parseFloat(recipeStateValue?.kcal_total!) + ((amount * parseFloat(preselect_g)) / 100) * parseFloat(kcal_100g)
        );

        thisCurrentKHComplete = Math.round(
          parseFloat(recipeStateValue?.carbohydrates_total!) +
            ((amount * parseFloat(preselect_g)) / 100) * parseFloat(carbohydrates_100g)
        );

        thisCurrentEWComplete = Math.round(
          parseFloat(recipeStateValue?.protein_total!) +
            ((amount * parseFloat(preselect_g)) / 100) * parseFloat(protein_100g)
        );

        thisCurrentFTComplete = Math.round(
          parseFloat(recipeStateValue?.fat_total!) + ((amount * parseFloat(preselect_g)) / 100) * parseFloat(fat_100g)
        );
      } else {
        thisCurrentKcalComplete = Math.round(
          parseFloat(thisCurrentPlanDayObject?.kcal_total!) +
            ((amount * parseFloat(preselect_g)) / 100) * parseFloat(kcal_100g)
        );

        thisCurrentKHComplete = Math.round(
          parseFloat(thisCurrentPlanDayObject?.carbohydrates_total!) +
            ((amount * parseFloat(preselect_g)) / 100) * parseFloat(carbohydrates_100g)
        );

        thisCurrentEWComplete = Math.round(
          parseFloat(thisCurrentPlanDayObject?.protein_total!) +
            ((amount * parseFloat(preselect_g)) / 100) * parseFloat(protein_100g)
        );

        thisCurrentFTComplete = Math.round(
          parseFloat(thisCurrentPlanDayObject?.fat_total!) +
            ((amount * parseFloat(preselect_g)) / 100) * parseFloat(fat_100g)
        );
      }
    } else if (popupType !== 'plan') {
      thisCurrentKcalComplete = Math.round(
        parseFloat(recipeStateValue?.kcal_total!) + (amount / 100) * parseFloat(kcal_100g)
      );

      thisCurrentKHComplete = Math.round(
        parseFloat(recipeStateValue?.carbohydrates_total!) + (amount / 100) * parseFloat(carbohydrates_100g)
      );

      thisCurrentEWComplete = Math.round(
        parseFloat(recipeStateValue?.protein_total!) + (amount / 100) * parseFloat(protein_100g)
      );

      thisCurrentFTComplete = Math.round(
        parseFloat(recipeStateValue?.fat_total!) + (amount / 100) * parseFloat(fat_100g)
      );
    } else {
      thisCurrentKcalComplete = Math.round(
        parseFloat(thisCurrentPlanDayObject?.kcal_total!) + (amount / 100) * parseFloat(kcal_100g)
      );

      thisCurrentKHComplete = Math.round(
        parseFloat(thisCurrentPlanDayObject?.carbohydrates_total!) + (amount / 100) * parseFloat(carbohydrates_100g)
      );

      thisCurrentEWComplete = Math.round(
        parseFloat(thisCurrentPlanDayObject?.protein_total!) + (amount / 100) * parseFloat(protein_100g)
      );

      thisCurrentFTComplete = Math.round(
        parseFloat(thisCurrentPlanDayObject?.fat_total!) + (amount / 100) * parseFloat(fat_100g)
      );
    }

    const thisPiece = piece;

    let thisIngridientObject = {
      id: Math.random().toString(),
      name,
      amount,
      initial_amount: amount,
      piece: thisPiece,
      kcal_100g,
      carbohydrates_100g,
      protein_100g,
      fat_100g,
      default_piece,
      preselect_g,
      category,
      imageUrl,
      preselect_type,
      kcal_total: 0,
      carbohydrates_total: 0,
      protein_total: 0,
      fat_total: 0,
    };

    const thisKcalTotal = getIngridientMacros(thisIngridientObject, thisIngridientObject, 'kcal');
    const thisCarbohydratesTotal = getIngridientMacros(thisIngridientObject, thisIngridientObject, 'carbohydrates');
    const thisProteinTotal = getIngridientMacros(thisIngridientObject, thisIngridientObject, 'protein');
    const thisFatTotal = getIngridientMacros(thisIngridientObject, thisIngridientObject, 'fat');

    thisIngridientObject = {
      ...thisIngridientObject,
      kcal_total: thisKcalTotal,
      carbohydrates_total: thisCarbohydratesTotal,
      protein_total: thisProteinTotal,
      fat_total: thisFatTotal,
    };

    let thisRecipeData = recipeStateValue;

    let newColumns = {
      ...recipeStateValue,
      kcal_total: thisCurrentKcalComplete,
      carbohydrates_total: thisCurrentKHComplete,
      protein_total: thisCurrentEWComplete,
      fat_total: thisCurrentFTComplete,
    };

    if (popupType === 'plan') {
      newColumns = {
        ...recipeStateValue,
        dayEntries: recipeStateValue.dayEntries.map((entries: any) => {
          if (parseFloat(entries.id) !== updateDayId) return entries;
          return {
            ...entries,
            kcal_total: thisCurrentKcalComplete,
            carbohydrates_total: thisCurrentKHComplete,
            protein_total: thisCurrentEWComplete,
            fat_total: thisCurrentFTComplete,
            [mealType]: {
              ...entries[mealType],
              ingredients: [thisIngridientObject, ...entries[mealType].ingredients],
            },
          };
        }),
      };
    } else {
      newColumns = {
        ...newColumns,
        ingredients: [...recipeStateValue.ingredients, thisIngridientObject],
      };
    }

    const checkIncompabilityArray = [] as any;

    if (popupType !== 'plan') {
      // check incombality options of ingredients
      for (let i = 0; i < newColumns.ingredients.length; i += 1) {
        const thisIngridientList = ingredientList as any;
        const getThisIngridient = thisIngridientList?.find((item: any) => item.name === newColumns.ingredients[i].name);

        intolerancesOption.forEach(function (key) {
          if (
            getThisIngridient !== undefined &&
            typeof getThisIngridient[key.toLowerCase()] !== undefined &&
            getThisIngridient[key.toLowerCase()] !== null
          ) {
            if (getThisIngridient[key.toLowerCase()] === true) {
              checkIncompabilityArray.push({ name: [key.toLowerCase()], status: true });
            }
          }
        });
      }
    } else {
      // check incombality options of ingredients
      for (let i = 0; i < thisCurrentPlanDayObject[mealType].ingredients.length; i += 1) {
        const thisIngridientList = ingredientList as any;
        const getThisIngridient = thisIngridientList?.find(
          (item: any) => item.name === thisCurrentPlanDayObject[mealType].ingredients[i].name
        );

        intolerancesOption.forEach(function (key) {
          if (
            getThisIngridient !== undefined &&
            typeof getThisIngridient[key.toLowerCase()] !== undefined &&
            getThisIngridient[key.toLowerCase()] !== null
          ) {
            if (getThisIngridient[key.toLowerCase()] === true) {
              checkIncompabilityArray.push({ name: [key.toLowerCase()], status: true });
            }
          }
        });
      }
    }

    // Copy newColumns to variable because this needs to be updated in the following sections
    thisRecipeData = { ...newColumns };

    // First set all to false
    for (let f = 0; f < intolerancesOption.length; f += 1) {
      thisRecipeData = { ...thisRecipeData, [intolerancesOption[f].toLowerCase()]: false };
    }

    // Set elements true if incompatibility exists
    for (let g = 0; g < checkIncompabilityArray.length; g += 1) {
      thisRecipeData = { ...thisRecipeData, [checkIncompabilityArray[g].name]: true };
    }

    if (currentEditIngridientType === 'add') {
      handleOpenClosePopups(setEditPopupOverlayClass, '', 'close');
      handleOpenClosePopups(setPopupOverlayClass, '', 'close');
    }
    if (popupType !== 'plan') {
      setCurrentIngridientSearch(false);
      setCurrentSearchQuery('');
    }

    // this.setState({ currentIngridientPieceIdentifier: '' });
    setCurrentIngridientSearchAutocomplete({ suggestions: { suggestion: [''] } });
    if (!Number.isNaN(amount)) {
      toast.success('Das Lebensmittel wurde erfolgreich hinzugefügt!');
      console.log(newColumns);
      updateRecipeState(thisRecipeData);

      if (popupType !== 'plan') {
        setDirectAddedIngridients([thisIngridientObject, ...directAddedIngridients]);
        setRecipeChanged(true);
      }
    } else {
      toast.error('Die eingegebenen Daten enthielten Fehler!');
    }

    if (currentEditIngridientType === 'notAdded') {
      handleOpenClosePopups(setEditPopupOverlayClass, setPopupOverlayClass, 'both');
    }
  }

  // Delete item from direct added list and ingridient list
  function deleteDirectAddedIngridient(
    thisId: string,
    amount: number,
    piece: string,
    preselect_g: string,
    kcal_100g: string,
    carbohydrates_100g: string,
    protein_100g: string,
    fat_100g: string
  ) {
    let ingridientKcal;
    let ingridientKh;
    let ingridientEw;
    let ingridientFt;

    if (piece !== 'g' && piece !== 'ml') {
      ingridientKcal = Math.round(((amount * parseFloat(preselect_g)) / 100) * parseFloat(kcal_100g));
      ingridientKh = Math.round(((amount * parseFloat(preselect_g)) / 100) * parseFloat(carbohydrates_100g));
      ingridientEw = Math.round(((amount * parseFloat(preselect_g)) / 100) * parseFloat(protein_100g));
      ingridientFt = Math.round(((amount * parseFloat(preselect_g)) / 100) * parseFloat(fat_100g));
    } else {
      ingridientKcal = Math.round((parseFloat(kcal_100g) / 100) * amount);
      ingridientKh = Math.round((parseFloat(carbohydrates_100g) / 100) * amount);
      ingridientEw = Math.round((parseFloat(protein_100g) / 100) * amount);
      ingridientFt = Math.round((parseFloat(fat_100g) / 100) * amount);
    }

    const checkIncompabilityArray = [] as any;
    let thisRecipeData = currentAddRecipe;

    const newColumns = {
      ...currentAddRecipe,
      kcal_total: Math.round(parseFloat(currentAddRecipe.kcal_total) - ingridientKcal),
      carbohydrates_total: `${Math.round(parseFloat(currentAddRecipe.carbohydrates_total) - ingridientKh)}`,
      protein_total: `${Math.round(parseFloat(currentAddRecipe.protein_total) - ingridientEw)}`,
      fat_total: `${Math.round(parseFloat(currentAddRecipe.fat_total) - ingridientFt)}`,
      ingredients: [...currentAddRecipe.ingredients.filter((item: any) => item.id !== thisId)],
    };

    // check incombality options of ingredients
    for (let i = 0; i < newColumns.ingredients.length; i += 1) {
      const thisIngridientList = ingredientList as any;
      const getThisIngridient = thisIngridientList?.find((item: any) => item.name === newColumns.ingredients[i].name);

      intolerancesOption.forEach(function (key) {
        if (
          getThisIngridient !== undefined &&
          typeof getThisIngridient[key.toLowerCase()] !== undefined &&
          getThisIngridient[key.toLowerCase()] !== null
        ) {
          if (getThisIngridient[key.toLowerCase()] === true) {
            checkIncompabilityArray.push({ name: [key.toLowerCase()], status: true });
          }
        }
      });
    }

    // Copy newColumns to variable because this needs to be updated in the following sections
    thisRecipeData = { ...newColumns };

    // First set all to false
    for (let f = 0; f < intolerancesOption.length; f += 1) {
      thisRecipeData = { ...thisRecipeData, [intolerancesOption[f].toLowerCase()]: false };
    }

    // Set elements true if incompatibility exists
    for (let g = 0; g < checkIncompabilityArray.length; g += 1) {
      thisRecipeData = { ...thisRecipeData, [checkIncompabilityArray[g].name]: true };
    }

    setDirectAddedIngridients(directAddedIngridients.filter(item => item.id !== thisId));
    updateRecipeState(thisRecipeData);
    setRecipeChanged(true);
  }

  function clickIngridientChange() {
    if (editIngridientRef.current) {
      editIngridientRef.current.select();
    }
  }

  const changeIngridientExecuteAPI = () => {
    let currentKcal: any = recipeStateValue?.kcal_total;
    let currentKH: any = recipeStateValue?.carbohydrates_total;
    let currentEW: any = recipeStateValue?.protein_total;
    let currentFT: any = recipeStateValue?.fat_total;
    let getIngridientRecipeData = [] as any;
    let thisPieceValue = currentEditIngridientPiece;

    getIngridientRecipeData = recipeStateValue.ingredients.filter((item: any) => item.id === currentEditIngridientID);

    currentKcal = Math.round(
      parseFloat(currentKcal) - parseFloat(getIngridientRecipeData[0].kcal_total) + currentEditIngridientKcalTotal
    );
    currentKH = Math.round(
      parseFloat(currentKH) -
        parseFloat(getIngridientRecipeData[0].carbohydrates_total) +
        currentEditIngridientCarbohydratesTotal
    );
    currentEW = Math.round(
      parseFloat(currentEW) - parseFloat(getIngridientRecipeData[0].protein_total) + currentEditIngridientProteinTotal
    );
    currentFT = Math.round(
      parseFloat(currentFT) - parseFloat(getIngridientRecipeData[0].fat_total) + currentEditIngridientFatTotal
    );

    if (currentEditIngridientPiece.includes('(')) {
      thisPieceValue = currentEditIngridientPiece.substr(0, currentEditIngridientPiece.indexOf('(') - 1);
    }

    const newColumns = {
      ...recipeStateValue,
      kcal_total: currentKcal,
      carbohydrates_total: currentKH,
      protein_total: currentEW,
      fat_total: currentFT,
      ingredients: recipeStateValue?.ingredients.map((ingridients: any) => {
        if (parseFloat(ingridients.id) !== parseFloat(currentEditIngridientID)) return ingridients;
        return {
          ...ingridients,
          amount: currentEditIngridientAmount,
          piece: thisPieceValue,
          kcal_total: currentEditIngridientKcalTotal,
          carbohydrates_total: currentEditIngridientCarbohydratesTotal,
          protein_total: currentEditIngridientProteinTotal,
          fat_total: currentEditIngridientFatTotal,
        };
      }),
    };

    const newColumnsDirectAdd = directAddedIngridients.map((ingridients: any) => {
      if (parseFloat(ingridients.id) !== parseFloat(currentEditIngridientID)) return ingridients;
      return {
        ...ingridients,
        amount: currentEditIngridientAmount,
        piece: thisPieceValue,
        kcal_total: currentEditIngridientKcalTotal,
        carbohydrates_total: currentEditIngridientCarbohydratesTotal,
        protein_total: currentEditIngridientProteinTotal,
        fat_total: currentEditIngridientFatTotal,
      };
    });

    setCurrentEditIngridientKcalValue(0);
    setCurrentEditIngridientCarbohydratesValue(0);
    setCcurrentEditIngridientProteinValue(0);
    setCurrentEditIngridientFatValue(0);
    if (!Number.isNaN(parseFloat(currentEditIngridientAmount))) {
      updateRecipeState(newColumns);
      setRecipeChanged(true);
      setDirectAddedIngridients(newColumnsDirectAdd);
    } else {
      toast.error('Die eigegebenen Daten enthielten Fehler!');
    }
    handleOpenClosePopups(setEditPopupOverlayClass, setPopupOverlayClass, 'both');
  };

  const changeIngridientExecute = () => {
    let currentCalculatedKcal;
    let currentCalculatedKH;
    let currentCalculatedEW;
    let currentCalculatedFT;
    let currentKcal: any = recipeStateValue?.kcal_total;
    let currentKH: any = recipeStateValue?.carbohydrates_total;
    let currentEW: any = recipeStateValue?.protein_total;
    let currentFT: any = recipeStateValue?.fat_total;
    let getIngridientRecipeData = [] as any;
    let getIngridient = [] as any;

    getIngridientRecipeData = recipeStateValue.ingredients.filter((item: any) => item.id === currentEditIngridientID);
    getIngridient = ingredientList?.filter((item: any) => item.name === currentEditIngridientName);

    if (getIngridientRecipeData[0].piece !== 'g' && getIngridientRecipeData[0].piece !== 'ml') {
      currentCalculatedKcal =
        ((parseFloat(getIngridientRecipeData[0].amount) * parseFloat(getIngridientRecipeData[0].preselect_g)) / 100) *
        parseFloat(getIngridient[0].kcal_100g);

      currentCalculatedKH =
        ((parseFloat(getIngridientRecipeData[0].amount) * parseFloat(getIngridientRecipeData[0].preselect_g)) / 100) *
        parseFloat(getIngridient[0].carbohydrates_100g);

      currentCalculatedEW =
        ((parseFloat(getIngridientRecipeData[0].amount) * parseFloat(getIngridientRecipeData[0].preselect_g)) / 100) *
        parseFloat(getIngridient[0].protein_100g);

      currentCalculatedFT =
        ((parseFloat(getIngridientRecipeData[0].amount) * parseFloat(getIngridientRecipeData[0].preselect_g)) / 100) *
        parseFloat(getIngridient[0].fat_100g);
    } else {
      currentCalculatedKcal =
        (parseFloat(getIngridientRecipeData[0].amount) / 100) * parseFloat(getIngridient[0].kcal_100g);

      currentCalculatedKH =
        (parseFloat(getIngridientRecipeData[0].amount) / 100) * parseFloat(getIngridient[0].carbohydrates_100g);

      currentCalculatedEW =
        (parseFloat(getIngridientRecipeData[0].amount) / 100) * parseFloat(getIngridient[0].protein_100g);

      currentCalculatedFT =
        (parseFloat(getIngridientRecipeData[0].amount) / 100) * parseFloat(getIngridient[0].fat_100g);
    }

    currentKcal = Math.round(parseFloat(currentKcal) - currentCalculatedKcal + currentEditIngridientKcalTotal);
    currentKH = Math.round(parseFloat(currentKH) - currentCalculatedKH + currentEditIngridientCarbohydratesTotal);
    currentEW = Math.round(parseFloat(currentEW) - currentCalculatedEW + currentEditIngridientProteinTotal);
    currentFT = Math.round(parseFloat(currentFT) - currentCalculatedFT + currentEditIngridientFatTotal);

    const newColumns = {
      ...recipeStateValue,
      kcal_total: currentKcal,
      carbohydrates_total: currentKH,
      protein_total: currentEW,
      fat_total: currentFT,
      ingredients: recipeStateValue?.ingredients.map((ingridients: any) => {
        if (parseFloat(ingridients.id) !== parseFloat(currentEditIngridientID)) return ingridients;
        return {
          ...ingridients,
          amount: currentEditIngridientAmount,
          piece: currentEditIngridientPiece,
        };
      }),
    };

    const newColumnsDirectAdd = directAddedIngridients.map((ingridients: any) => {
      if (parseFloat(ingridients.id) !== parseFloat(currentEditIngridientID)) return ingridients;
      return {
        ...ingridients,
        amount: currentEditIngridientAmount,
        amountBefore: ingridients.amount,
        piece: currentEditIngridientPiece,
      };
    });

    if (!Number.isNaN(parseFloat(currentEditIngridientAmount))) {
      updateRecipeState(newColumns);
      setRecipeChanged(true);
      setDirectAddedIngridients(newColumnsDirectAdd);
    } else {
      toast.error('Die eigegebenen Daten enthielten Fehler!');
    }
    handleOpenClosePopups(setEditPopupOverlayClass, setPopupOverlayClass, 'both');
  };

  // Delete api item from direct added list and ingridient list
  function deleteDirectAddedIngridientAPI(
    thisId: string,
    kcal_total: string,
    carbohydrates_total: string,
    protein_total: string,
    fat_total: string
  ) {
    let thisCurrentKcalComplete = 0;
    let thisCurrentKHComplete = 0;
    let thisCurrentEWComplete = 0;
    let thisCurrentFTComplete = 0;

    thisCurrentKcalComplete = Math.round(parseFloat(currentAddRecipe.kcal_total) - parseFloat(kcal_total));
    thisCurrentKHComplete = Math.round(
      parseFloat(currentAddRecipe.carbohydrates_total) - parseFloat(carbohydrates_total)
    );
    thisCurrentEWComplete = Math.round(parseFloat(currentAddRecipe.protein_total) - parseFloat(protein_total));
    thisCurrentFTComplete = Math.round(parseFloat(currentAddRecipe.fat_total) - parseFloat(fat_total));

    const newColumns = {
      ...currentAddRecipe,
      kcal_total: thisCurrentKcalComplete,
      carbohydrates_total: thisCurrentKHComplete,
      protein_total: thisCurrentEWComplete,
      fat_total: thisCurrentFTComplete,
      ingredients: [...currentAddRecipe.ingredients.filter((item: any) => item.id !== thisId)],
    };

    setDirectAddedIngridients(directAddedIngridients.filter(item => item.id !== thisId));
    updateRecipeState(newColumns);
    setRecipeChanged(true);
  }

  const changeIngridientPieceAPI = (event: any) => {
    let thisCurrentPieceLabel = event.value;
    let ingridientKcalNew: number;
    let ingridientKhNew: number;
    let ingridientEwNew: number;
    let ingridientFtNew: number;

    if (thisCurrentPieceLabel !== 'g' && thisCurrentPieceLabel !== 'ml') {
      ingridientKcalNew = Math.round(parseFloat(currentEditIngridientAmount) * currentEditIngridientKcalValue);

      ingridientKhNew = Math.round(parseFloat(currentEditIngridientAmount) * currentEditIngridientCarbohydratesValue);

      ingridientEwNew = Math.round(parseFloat(currentEditIngridientAmount) * currentEditIngridientProteinValue);

      ingridientFtNew = Math.round(parseFloat(currentEditIngridientAmount) * currentEditIngridientFatValue);
    } else if (currentEditIngridientMetricServingAmountValue !== '') {
      ingridientKcalNew = Math.round(
        (parseFloat(currentEditIngridientAmount) /
          parseFloat(
            currentEditIngridientMetricServingAmountValue.substr(
              0,
              currentEditIngridientMetricServingAmountValue.indexOf('.')
            )
          )) *
          currentEditIngridientKcalValue
      );

      ingridientKhNew = Math.round(
        (parseFloat(currentEditIngridientAmount) /
          parseFloat(
            currentEditIngridientMetricServingAmountValue.substr(
              0,
              currentEditIngridientMetricServingAmountValue.indexOf('.')
            )
          )) *
          currentEditIngridientCarbohydratesValue
      );

      ingridientEwNew = Math.round(
        (parseFloat(currentEditIngridientAmount) /
          parseFloat(
            currentEditIngridientMetricServingAmountValue.substr(
              0,
              currentEditIngridientMetricServingAmountValue.indexOf('.')
            )
          )) *
          currentEditIngridientProteinValue
      );

      ingridientFtNew = Math.round(
        (parseFloat(currentEditIngridientAmount) /
          parseFloat(
            currentEditIngridientMetricServingAmountValue.substr(
              0,
              currentEditIngridientMetricServingAmountValue.indexOf('.')
            )
          )) *
          currentEditIngridientFatValue
      );
    } else {
      ingridientKcalNew = (parseFloat(currentEditIngridientAmount) / 100) * currentEditIngridientKcalValue;
      ingridientKhNew = (parseFloat(currentEditIngridientAmount) / 100) * currentEditIngridientCarbohydratesValue;
      ingridientEwNew = (parseFloat(currentEditIngridientAmount) / 100) * currentEditIngridientProteinValue;
      ingridientFtNew = (parseFloat(currentEditIngridientAmount) / 100) * currentEditIngridientFatValue;
    }

    setCurrentEditIngridientKcalTotal(Math.round(ingridientKcalNew));
    setCurrentEditIngridientCarbohydratesTotal(Math.round(ingridientKhNew));
    setCurrentEditIngridientProteinTotal(Math.round(ingridientEwNew));
    setCurrentEditIngridientFatTotal(Math.round(ingridientFtNew));
    // setCurrentEditIngridientMetricServingAmountValue('');

    if (thisCurrentPieceLabel.includes('(')) {
      thisCurrentPieceLabel = thisCurrentPieceLabel.substr(0, thisCurrentPieceLabel.indexOf('(') - 1);
    }

    if (thisCurrentPieceLabel === 'Gramm') {
      setCurrentEditIngridientPiece('g');
    } else {
      setCurrentEditIngridientPiece(event.value);
    }
  };

  const changeIngridientPiece = (event: any) => {
    const thisCurrentPiece = event.value;
    let thisCurrentPieceLabel = event.label;
    let ingridientKcalNew;
    let ingridientKhNew;
    let ingridientEwNew;
    let ingridientFtNew;
    let getIngridientRecipeData = [] as any;
    let getIngridient = [] as any;

    if (thisCurrentPieceLabel.includes('(')) {
      thisCurrentPieceLabel = thisCurrentPieceLabel.substr(0, thisCurrentPieceLabel.indexOf('(') - 1);
    }

    if (popupType === 'plan') {
      getIngridientRecipeData = recipeStateValue?.dayEntries.filter((item: any) => item.id === updateDayId);
      getIngridientRecipeData = getIngridientRecipeData[0][mealType].ingredients.filter(
        (item: any) => item.id === currentEditIngridientID
      );
    } else {
      getIngridientRecipeData = recipeStateValue?.ingredients.filter(
        (item: any) => item.id === currentEditIngridientID
      );
    }

    getIngridient = ingredientList?.filter((item: any) => item.name === currentEditIngridientName);

    if (thisCurrentPiece !== 'g' && thisCurrentPiece !== 'ml') {
      ingridientKcalNew = Math.round(
        ((parseFloat(currentEditIngridientAmount) * parseFloat(getIngridient[0].preselect_g)) / 100) *
          parseFloat(getIngridient[0].kcal_100g)
      );

      ingridientKhNew = Math.round(
        ((parseFloat(currentEditIngridientAmount) * parseFloat(getIngridient[0].preselect_g)) / 100) *
          parseFloat(getIngridient[0].carbohydrates_100g)
      );

      ingridientEwNew = Math.round(
        ((parseFloat(currentEditIngridientAmount) * parseFloat(getIngridient[0].preselect_g)) / 100) *
          parseFloat(getIngridient[0].protein_100g)
      );

      ingridientFtNew = Math.round(
        ((parseFloat(currentEditIngridientAmount) * parseFloat(getIngridient[0].preselect_g)) / 100) *
          parseFloat(getIngridient[0].fat_100g)
      );
    } else {
      ingridientKcalNew = Math.round(
        (parseFloat(getIngridient[0].kcal_100g) / 100) * parseFloat(currentEditIngridientAmount)
      );

      ingridientKhNew = Math.round(
        (parseFloat(getIngridient[0].carbohydrates_100g) / 100) * parseFloat(currentEditIngridientAmount)
      );

      ingridientEwNew = Math.round(
        (parseFloat(getIngridient[0].protein_100g) / 100) * parseFloat(currentEditIngridientAmount)
      );

      ingridientFtNew = Math.round(
        (parseFloat(getIngridient[0].fat_100g) / 100) * parseFloat(currentEditIngridientAmount)
      );
    }

    if (thisCurrentPieceLabel === 'Gramm') {
      setCurrentEditIngridientPiece('g');
    } else if (thisCurrentPieceLabel === 'Milliliter') {
      setCurrentEditIngridientPiece('ml');
    } else {
      setCurrentEditIngridientPiece(thisCurrentPieceLabel);
    }

    setCurrentEditIngridientKcalTotal(ingridientKcalNew);
    setCurrentEditIngridientCarbohydratesTotal(ingridientKhNew);
    setCurrentEditIngridientProteinTotal(ingridientEwNew);
    setCurrentEditIngridientFatTotal(ingridientFtNew);
  };

  function handleEditIngridientPopup(
    ingridientId: string,
    name: string,
    amount: string,
    piece: string,
    imageUrl: string,
    preselect_g: string,
    preselect_type: string,
    kcal_100g: string,
    carbohydrates_100g: string,
    protein_100g: string,
    fat_100g: string,
    default_piece: string,
    type: string
  ) {
    setCurrentEditIngridientKcalValue(0);
    setCurrentEditIngridientCarbohydratesValue(0);
    setCcurrentEditIngridientProteinValue(0);
    setCurrentEditIngridientFatValue(0);
    setOpenerClass('hidden');

    if (piece !== 'g' && piece !== 'ml') {
      setCurrentEditIngridientKcalTotal(
        Math.round(((parseFloat(amount) * parseFloat(preselect_g)) / 100) * parseFloat(kcal_100g))
      );
      setCurrentEditIngridientCarbohydratesTotal(
        Math.round(((parseFloat(amount) * parseFloat(preselect_g)) / 100) * parseFloat(carbohydrates_100g))
      );
      setCurrentEditIngridientProteinTotal(
        Math.round(((parseFloat(amount) * parseFloat(preselect_g)) / 100) * parseFloat(protein_100g))
      );
      setCurrentEditIngridientFatTotal(
        Math.round(((parseFloat(amount) * parseFloat(preselect_g)) / 100) * parseFloat(fat_100g))
      );
    } else {
      setCurrentEditIngridientKcalTotal(Math.round((parseFloat(amount) / 100) * parseFloat(kcal_100g)));
      setCurrentEditIngridientCarbohydratesTotal(
        Math.round((parseFloat(amount) / 100) * parseFloat(carbohydrates_100g))
      );
      setCurrentEditIngridientProteinTotal(Math.round((parseFloat(amount) / 100) * parseFloat(protein_100g)));
      setCurrentEditIngridientFatTotal(Math.round((parseFloat(amount) / 100) * parseFloat(fat_100g)));
    }

    const thisPortionValues: OptionTypeBase[] = [
      { value: preselect_type.toLowerCase(), label: `${preselect_type} (${preselect_g}g)` },
      { value: 'g', label: 'Gramm' },
    ];

    const thisPortionValuesWithDefaultPiece: OptionTypeBase[] = [
      { value: preselect_type.toLowerCase(), label: `${preselect_type} (${preselect_g}${default_piece})` },
      { value: default_piece === 'ml' ? 'ml' : 'g', label: default_piece === 'ml' ? 'Milliliter' : 'Gramm' },
    ];

    if (default_piece !== undefined) {
      setCurrentEditIngridientPortionValues(thisPortionValuesWithDefaultPiece);
      setCurrentEditIngridientDefaultPiece(default_piece);
    } else {
      setCurrentEditIngridientPortionValues(thisPortionValues);
    }

    setCurrentEditIngridientPreselectG(preselect_g);
    setCurrentEditIngridientPreselectType(preselect_type);
    setCurrentEditIngridientKcal100g(kcal_100g);
    setCurrentEditIngridientCarbohydrates100g(carbohydrates_100g);
    setCurrentEditIngridientProtein100g(protein_100g);
    setCurrentEditIngridientFat100g(fat_100g);
    setCurrentEditIngridientCategory('Obst');

    setCurrentEditIngridientName(name);
    setCurrentEditIngridientType(type);
    setCurrentEditIngridientID(ingridientId);
    setCurrentEditInitialIngridientAmount(amount);
    setCurrentEditIngridientAmount(amount);
    setCurrentEditIngridientPiece(piece);
    if (imageUrl !== undefined) {
      setCurrentEditIngridientImageUrl(imageUrl);
    }
    setEditPopupOverlayClass('block');
  }

  function handleEditIngridientPopupAPI(ingridientData: any) {
    let thisServingDataArray = [] as any;
    let getIngridientServingData: any;
    const thisIngridientData = ingridientData;

    thisServingDataArray = thisIngridientData.serving_data.serving;

    if (thisIngridientData.serving_data.serving instanceof Array) {
      if (thisIngridientData.piece === 'g' || thisIngridientData.piece === 'ml') {
        getIngridientServingData = thisServingDataArray.filter(
          (item: any) => item.serving_id === thisIngridientData.serving_id
        );
      } else {
        getIngridientServingData = thisServingDataArray.filter(
          (item: any) => item.serving_id === thisIngridientData.serving_id
        );
      }
    } else {
      getIngridientServingData = [thisIngridientData.serving_data.serving];
    }

    setCurrentEditIngridientKcalValue(parseFloat(getIngridientServingData[0].calories));
    setCurrentEditIngridientCarbohydratesValue(parseFloat(getIngridientServingData[0].carbohydrate));
    setCcurrentEditIngridientProteinValue(parseFloat(getIngridientServingData[0].protein));
    setCurrentEditIngridientFatValue(parseFloat(getIngridientServingData[0].fat));
    setOpenerClass('hidden');
    setEditPopupOverlayClass('block');
    if (getIngridientServingData[0].metric_serving_amount) {
      setCurrentEditIngridientMetricServingAmountValue(getIngridientServingData[0].metric_serving_amount);
    }

    let thisPortionValues: OptionTypeBase[];
    let thisPieceValue = '';

    if (getPrimaryPieceValue(thisIngridientData).length > 0) {
      thisPortionValues = [
        {
          value: getPrimaryPieceValue(thisIngridientData)?.toLowerCase(),
          label: getPrimaryPieceValue(thisIngridientData),
        },
        { value: 'g', label: 'Gramm' },
      ];
      thisPieceValue = getPrimaryPieceValue(thisIngridientData);
    } else {
      thisPortionValues = [{ value: 'g', label: 'Gramm' }];
      thisPieceValue = 'g';
    }

    if (thisIngridientData.piece !== 'g' && thisIngridientData.piece !== 'ml') {
      setCurrentEditIngridientKcalTotal(
        Math.round(
          ((parseFloat(thisIngridientData.amount) * parseFloat(thisIngridientData.preselect_g)) / 100) *
            parseFloat(thisIngridientData.kcal_100g)
        )
      );
      setCurrentEditIngridientCarbohydratesTotal(
        Math.round(
          ((parseFloat(thisIngridientData.amount) * parseFloat(thisIngridientData.preselect_g)) / 100) *
            parseFloat(thisIngridientData.carbohydrates_100g)
        )
      );
      setCurrentEditIngridientProteinTotal(
        Math.round(
          ((parseFloat(thisIngridientData.amount) * parseFloat(thisIngridientData.preselect_g)) / 100) *
            parseFloat(thisIngridientData.protein_100g)
        )
      );
      setCurrentEditIngridientFatTotal(
        Math.round(
          ((parseFloat(thisIngridientData.amount) * parseFloat(thisIngridientData.preselect_g)) / 100) *
            parseFloat(thisIngridientData.fat_100g)
        )
      );
    } else {
      setCurrentEditIngridientKcalTotal(
        Math.round((parseFloat(thisIngridientData.amount) / 100) * parseFloat(thisIngridientData.kcal_100g))
      );
      setCurrentEditIngridientCarbohydratesTotal(
        Math.round((parseFloat(thisIngridientData.amount) / 100) * parseFloat(thisIngridientData.carbohydrates_100g))
      );
      setCurrentEditIngridientProteinTotal(
        Math.round((parseFloat(thisIngridientData.amount) / 100) * parseFloat(thisIngridientData.protein_100g))
      );
      setCurrentEditIngridientFatTotal(
        Math.round((parseFloat(thisIngridientData.amount) / 100) * parseFloat(thisIngridientData.fat_100g))
      );
    }

    setCurrentEditIngridientPortionValues(thisPortionValues);
    if (thisIngridientData.piece === 'g' || thisIngridientData.piece === 'ml') {
      setCurrentEditIngridientPiece(thisIngridientData.piece);
    } else {
      setCurrentEditIngridientPiece(thisPieceValue);
    }
    setCurrentEditIngridientAmount(thisIngridientData.amount);
    setCurrentEditInitialIngridientAmount(thisIngridientData.amount);
    setCurrentEditIngridientName(thisIngridientData.name);
    setCurrentEditIngridientID(thisIngridientData.id);
    setCurrentEditIngridientImageUrl('');
    if (!ingridientData.newAdded) {
      setCurrentEditIngridientType('edit');
    }
  }

  // Execute FatSecret ingridient search
  function ingridientApiSearch(query: string) {
    setCurrentSearchQuery(query);
    fetch(`https://static.tortija.de/interfaces/apis/ingridientApiSearch.php?token=${accessToken}&query=${query}`)
      .then(res => res.json())
      .then(data => {
        setCurrentIngridientSearchApi(data);
        setCurrentIngridientSearch(true);
        setCurrentIngridientSearchAutocomplete({ suggestions: { suggestion: [''] } });
      });
  }

  // Get FatSecret Autocomplete results
  const ingridientAutoCompleteSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSearchQuery(event.target.value);
    if (currentSection === 'recipes') {
      ingridientApiSearch(event.target.value);
    } else {
      ingridientAutoCompleteSearchExecute();
    }
  };

  // Execute FatSecret ingridient autocomplete search
  const ingridientAutoCompleteSearchExecute = _.debounce(() => {
    fetch(
      `https://static.tortija.de/interfaces/apis/ingridientAutoCompleteSearch.php?token=${accessToken}&query=${currentSearchQuery}`
    )
      .then(res => res.json())
      .then(data => {
        setCurrentIngridientSearchAutocomplete(data);
        setCurrentIngridientSearch(false);
      });
  }, 200);

  // Generate FatSecret API Token on component load
  useEffect(() => {
    fetch('https://static.tortija.de/interfaces/apis/getIngridientApiToken.php')
      .then(res => res.json())
      .then(data => {
        setAccessToken(data.access_token);
      });

    if (openerClass === 'block' && searchIngridientRef.current) {
      searchIngridientRef.current.focus();
    }
  }, [openerClass]);

  return (
    <>
      <div className={editPopupOverlayClass}>
        <div className={styles.backgroundPopupLayer}>
          <div className={styles.addIngridientPopup}>
            <div className="flex justify-between pt-20 pl-20">
              <div className="flex">
                <div className="my-auto pr-10">
                  <PencilIcon width={25} height={25} className="text-brownSemiDark mx-auto" />
                </div>
                <div className="text-xl my-auto font-light">Bearbeiten</div>
              </div>
              <div className="my-auto pr-20">
                <XIcon
                  width={25}
                  height={25}
                  className="text-brownSemiDark mx-auto cursor-pointer"
                  onClick={() => handleOpenClosePopups(setEditPopupOverlayClass, setOpenerClass, 'both')}
                />
              </div>
            </div>
            <div className={styles.ingridientPopupContentEdit}>
              <div className="pt-15 pl-20 pb-30 pr-15">
                <div className="font-light text-base">
                  Bitte setzen Sie noch die Menge und die Einheit für das Lebensmittel!
                </div>
                <div className="pt-10">
                  <div className="flex gap-20 pt-4">
                    <div className="font-light my-auto w-130">Menge auswählen:</div>
                    <div>
                      {currentEditIngridientType === 'notAdded' && (
                        <>
                          <CustomUserInput
                            thisRef={editIngridientRef}
                            name="amount"
                            thisValue={currentEditIngridientAmount}
                            submitFunction={() =>
                              currentEditIngridientKcalValue !== 0
                                ? addChangedIngridientAPI()
                                : addIngridientDirectInternal(
                                    currentEditIngridientPiece,
                                    parseFloat(currentEditIngridientAmount),
                                    currentEditIngridientPreselectG,
                                    currentEditIngridientKcal100g,
                                    currentEditIngridientCarbohydrates100g,
                                    currentEditIngridientProtein100g,
                                    currentEditIngridientFat100g,
                                    currentEditIngridientName,
                                    currentEditIngridientCategory,
                                    currentEditIngridientImageUrl,
                                    currentEditIngridientPreselectType,
                                    currentEditIngridientDefaultPiece
                                  )
                            }
                            onChange={e =>
                              currentEditIngridientKcalValue !== 0
                                ? changeIngridientAmountAPI(e)
                                : changeIngridientAmount(e)
                            }
                            onClick={clickIngridientChange}
                            width={currentEditIngridientAmount.length}
                          />
                        </>
                      )}
                      {currentEditIngridientType !== 'notAdded' && (
                        <>
                          <CustomUserInput
                            thisValue={currentEditIngridientAmount}
                            thisRef={editIngridientRef}
                            name="amount"
                            submitFunction={() =>
                              currentEditIngridientKcalValue !== 0
                                ? changeIngridientExecuteAPI()
                                : changeIngridientExecute()
                            }
                            onChange={e =>
                              currentEditIngridientKcalValue !== 0
                                ? changeIngridientAmountAPI(e)
                                : changeIngridientAmount(e)
                            }
                            onClick={clickIngridientChange}
                            width={currentEditIngridientAmount.length}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex gap-20 pt-4">
                    <div className="font-light my-auto w-130">Einheit auswählen:</div>
                    <div className="flex-1">
                      <div>
                        <Select
                          options={currentEditIngridientPortionValues}
                          styles={customSelectStyles}
                          onChange={e =>
                            currentEditIngridientKcalValue !== 0
                              ? changeIngridientPieceAPI(e)
                              : changeIngridientPiece(e)
                          }
                          value={currentEditIngridientPortionValues.filter(
                            (item: any) => item.value === currentEditIngridientPiece.toLowerCase()
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pb-20 md:pb-40">
                <div className="text-xl pl-20">Nährwertangabe</div>
                <div className="pt-10 flex pl-20">
                  <div className={styles.nutritionBorderItemFirst}>
                    <div>
                      <div className="font-semibold text-base">{currentEditIngridientKcalTotal}</div>
                      <div className={styles.recipeLabel}>kcal</div>
                    </div>
                    <span className="divider" />
                  </div>
                  <div className={styles.nutritionBorderItem}>
                    <div className="font-semibold text-base">{currentEditIngridientCarbohydratesTotal}g</div>
                    <div className={styles.recipeLabel}>{t('Carbohydrates')}</div>
                  </div>
                  <div className={styles.nutritionBorderItem}>
                    <div className="font-semibold text-base">{currentEditIngridientProteinTotal}g</div>
                    <div className={styles.recipeLabel}>{t('Protein')}</div>
                  </div>
                  <div className="text-center px-20">
                    <div className="font-semibold text-base">{currentEditIngridientFatTotal}g</div>
                    <div className={styles.recipeLabel}>{t('Fat')}</div>
                  </div>
                </div>
                {currentEditIngridientImageUrl.length > 0 && (
                  <>
                    <div className="pt-30 md:pt-40 pl-25">
                      <img
                        src={currentEditIngridientImageUrl}
                        alt="Ingridient"
                        className="rounded-2xl h-90 md:h-auto w-full object-cover"
                      />
                    </div>
                  </>
                )}
                <div className="pl-20 pt-30 md:pt-40 bottom-20">
                  {currentEditIngridientType === 'add' && (
                    <Button
                      className="w-full"
                      onClick={() =>
                        currentEditIngridientKcalValue !== 0
                          ? changeIngridientExecuteAPI()
                          : addIngridientDirectInternal(
                              currentEditIngridientPiece,
                              parseFloat(currentEditIngridientAmount),
                              '100',
                              '100',
                              '100',
                              '100',
                              '100',
                              currentEditIngridientName,
                              '100',
                              currentEditIngridientImageUrl,
                              currentEditIngridientPiece,
                              currentEditIngridientDefaultPiece
                            )
                      }
                    >
                      {t('Save')}
                    </Button>
                  )}
                  {currentEditIngridientType === 'edit' && (
                    <Button
                      className="w-full"
                      onClick={() =>
                        currentEditIngridientKcalValue !== 0 ? changeIngridientExecuteAPI() : changeIngridientExecute()
                      }
                    >
                      {t('Save')}
                    </Button>
                  )}
                  {currentEditIngridientType === 'notAdded' && (
                    <Button
                      className="w-full"
                      onClick={() =>
                        currentEditIngridientKcalValue !== 0
                          ? addChangedIngridientAPI()
                          : addIngridientDirectInternal(
                              currentEditIngridientPiece,
                              parseFloat(currentEditIngridientAmount),
                              currentEditIngridientPreselectG,
                              currentEditIngridientKcal100g,
                              currentEditIngridientCarbohydrates100g,
                              currentEditIngridientProtein100g,
                              currentEditIngridientFat100g,
                              currentEditIngridientName,
                              currentEditIngridientCategory,
                              currentEditIngridientImageUrl,
                              currentEditIngridientPreselectType,
                              currentEditIngridientDefaultPiece
                            )
                      }
                    >
                      {t('Add')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={openerClass}>
        <div className={styles.backgroundPopupLayer}>
          <div className={styles.popupWrapper}>
            <div className="flex justify-between pt-20 pl-20">
              <div className="flex">
                <div className="my-auto pr-10">
                  <PlusIcon width={25} height={25} className="text-brownSemiDark mx-auto" />
                </div>
                <div className="text-xl my-auto font-light">Neues Lebensmittel oder Rezept hinzufügen</div>
              </div>
              <div className="my-auto pr-20">
                <XIcon
                  width={25}
                  height={25}
                  className="text-brownSemiDark mx-auto cursor-pointer"
                  onClick={() => setOpenerClass('hidden')}
                />
              </div>
            </div>
            <div className={styles.popupContent}>
              <div className="pt-30 pl-20 pr-20">
                <SwitchSelector
                  onChange={setCurrentSection}
                  options={recipesOption}
                  initialSelectedIndex={0}
                  backgroundColor="#3D4045"
                  fontColor="white"
                  fontSize={20}
                  selectionIndicatorMargin={0}
                />
              </div>
              <div className="pt-20 pl-20 pr-20 pb-20">
                <div>
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      ingridientApiSearch(currentSearchQuery);
                    }}
                    className={styles.searchContainer}
                  >
                    <SearchBox
                      thisRef={searchIngridientRef}
                      searchValue={currentSearchQuery}
                      onChange={ingridientAutoCompleteSearch}
                      className={styles.searchDesktop}
                    />
                    <div
                      role="button"
                      aria-hidden
                      className={classNames('flex items-center space-x-3', {})}
                      onClick={filterOpen}
                    >
                      <AdjustmentsIcon
                        width={28}
                        height={28}
                        aria-hidden="true"
                        className={classNames(styles.filterIcon, {})}
                      />
                      <Headline level={3}>{t('Filter')}</Headline>
                    </div>
                  </form>
                </div>
              </div>

              <div className="pt-15 pl-20 pb-40">
                {currentIngridientSearchAutocomplete.suggestions !== null &&
                  Array.isArray(currentIngridientSearchAutocomplete.suggestions.suggestion) &&
                  currentIngridientSearchAutocomplete.suggestions.suggestion.map((plans, index) => (
                    <div key={index}>
                      {plans.length > 1 && (
                        <div className="flex border-b py-7 border-blackSemiDark hover:bg-white hover:bg-opacity-20 cursor-pointer mr-30">
                          <div className="pl-10 pr-15 my-auto">
                            <SearchIcon width={15} height={15} className="text-brownSemiDark" />
                          </div>
                          <div key={index}>
                            <button type="button" onClick={() => ingridientApiSearch(plans)}>
                              {plans}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                {currentIngridientSearchAutocomplete.suggestions !== null &&
                  !Array.isArray(currentIngridientSearchAutocomplete.suggestions.suggestion) && (
                    <div className="flex border-b py-7 border-blackSemiDark hover:bg-white hover:bg-opacity-20 cursor-pointer mr-30">
                      <div className="pl-10 pr-15 my-auto">
                        <SearchIcon width={15} height={15} className="text-brownSemiDark" />
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() =>
                            ingridientApiSearch(currentIngridientSearchAutocomplete.suggestions.suggestion.toString())
                          }
                        >
                          {currentIngridientSearchAutocomplete.suggestions.suggestion}
                        </button>
                      </div>
                    </div>
                  )}
                <div className={((currentSearchQuery.length > 0 || popupType === 'plan') && 'hidden') || 'visible'}>
                  {directAddedIngridients.length > 0 && (
                    <div className="pb-10 font-light text-base">Aktuell hinzugefügt:</div>
                  )}
                  {directAddedIngridients.length > 0 &&
                    directAddedIngridients.map((ingridient, index) => {
                      return (
                        <>
                          <div className="pr-20 flex" key={index}>
                            <div
                              className={styles.contentItem}
                              onClick={() =>
                                ingridient.serving_data
                                  ? handleEditIngridientPopupAPI(ingridient)
                                  : handleEditIngridientPopup(
                                      ingridient.id,
                                      ingridient.name,
                                      ingridient.amount,
                                      ingridient.piece,
                                      ingridient.imageUrl,
                                      ingridient.preselect_g,
                                      ingridient.preselect_type,
                                      ingridient.kcal_100g,
                                      ingridient.carbohydrates_100g,
                                      ingridient.protein_100g,
                                      ingridient.fat_100g,
                                      ingridient.default_piece,
                                      'edit'
                                    )
                              }
                              onKeyDown={() =>
                                ingridient.serving_data
                                  ? handleEditIngridientPopupAPI(ingridient)
                                  : handleEditIngridientPopup(
                                      ingridient.id,
                                      ingridient.name,
                                      ingridient.amount,
                                      ingridient.piece,
                                      ingridient.imageUrl,
                                      ingridient.preselect_g,
                                      ingridient.preselect_type,
                                      ingridient.kcal_100g,
                                      ingridient.carbohydrates_100g,
                                      ingridient.protein_100g,
                                      ingridient.fat_100g,
                                      ingridient.default_piece,
                                      'edit'
                                    )
                              }
                              aria-hidden="true"
                            >
                              <div className={styles.imageWrapper}>
                                <img
                                  src={ingridient.imageUrl}
                                  alt=""
                                  width={45}
                                  height={45}
                                  loading="lazy"
                                  className={styles.image}
                                />
                              </div>
                              <div className={styles.description}>
                                <div className="pr-5">
                                  <div className="text-14 truncate w-100" title={ingridient.name}>
                                    {ingridient.name}{' '}
                                  </div>
                                  <div className="text-10 font-light">
                                    {ingridient.amount}
                                    {ingridient.piece.match(/^\d/) && 'x'} {ingridient.piece}{' '}
                                    {ingridient.piece !== 'g' &&
                                      ingridient.piece !== 'ml' &&
                                      `(${ingridient.amount * ingridient.preselect_g}`}
                                    {ingridient.serving_unit &&
                                      ingridient.piece !== 'g' &&
                                      ingridient.piece !== 'ml' &&
                                      `${ingridient.serving_unit})`}
                                    {!ingridient.serving_data &&
                                      ingridient.piece !== 'g' &&
                                      ingridient.piece !== 'ml' &&
                                      ingridient.default_piece === undefined &&
                                      'g)'}
                                    {!ingridient.serving_data &&
                                      ingridient.piece !== 'g' &&
                                      ingridient.piece !== 'ml' &&
                                      ingridient.default_piece !== undefined &&
                                      `${ingridient.default_piece})`}
                                    {ingridient.serving_data &&
                                      !ingridient.serving_unit &&
                                      ingridient.piece !== 'g' &&
                                      ingridient.piece !== 'ml' &&
                                      'g)'}
                                  </div>
                                </div>
                                <div className={styles.category}>
                                  <div className={styles.item}>
                                    <div className="text-12">
                                      {(ingridient.piece !== 'g' &&
                                        ingridient.piece !== 'ml' &&
                                        Math.round(
                                          ((parseFloat(ingridient.amount) * parseFloat(ingridient.preselect_g)) / 100) *
                                            parseFloat(ingridient.kcal_100g)
                                        )) ||
                                        Math.round(
                                          (parseFloat(ingridient.amount) / 100) * parseFloat(ingridient.kcal_100g)
                                        )}
                                    </div>
                                    <div>kcal</div>
                                  </div>
                                  <div className={styles.itemSecondary}>
                                    <div className="text-12">
                                      {(ingridient.piece !== 'g' &&
                                        ingridient.piece !== 'ml' &&
                                        Math.round(
                                          ((parseFloat(ingridient.amount) * parseFloat(ingridient.preselect_g)) / 100) *
                                            parseFloat(ingridient.carbohydrates_100g)
                                        )) ||
                                        Math.round(
                                          (parseFloat(ingridient.amount) / 100) *
                                            parseFloat(ingridient.carbohydrates_100g)
                                        )}
                                    </div>
                                    <div>KH</div>
                                  </div>
                                  <div className={styles.itemSecondary}>
                                    <div className="text-12">
                                      {(ingridient.piece !== 'g' &&
                                        ingridient.piece !== 'ml' &&
                                        Math.round(
                                          ((parseFloat(ingridient.amount) * parseFloat(ingridient.preselect_g)) / 100) *
                                            parseFloat(ingridient.protein_100g)
                                        )) ||
                                        Math.round(
                                          (parseFloat(ingridient.amount) / 100) * parseFloat(ingridient.protein_100g)
                                        )}
                                    </div>
                                    <div>EW</div>
                                  </div>
                                  <div className={styles.itemSecondary}>
                                    <div className="text-12">
                                      {(ingridient.piece !== 'g' &&
                                        ingridient.piece !== 'ml' &&
                                        Math.round(
                                          ((parseFloat(ingridient.amount) * parseFloat(ingridient.preselect_g)) / 100) *
                                            parseFloat(ingridient.fat_100g)
                                        )) ||
                                        Math.round(
                                          (parseFloat(ingridient.amount) / 100) * parseFloat(ingridient.fat_100g)
                                        )}
                                    </div>
                                    <div>Fett</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="pl-5 pt-15">
                              {ingridient.serving_data && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    deleteDirectAddedIngridientAPI(
                                      ingridient.id,
                                      ingridient.kcal_total,
                                      ingridient.carbohydrates_total,
                                      ingridient.protein_total,
                                      ingridient.fat_total
                                    )
                                  }
                                >
                                  <TrashIcon width={25} height={25} className="text-brownSemiDark mx-auto" />
                                </button>
                              )}
                              {!ingridient.serving_data && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    deleteDirectAddedIngridient(
                                      ingridient.id,
                                      ingridient.amount,
                                      ingridient.piece,
                                      ingridient.preselect_g,
                                      ingridient.kcal_100g,
                                      ingridient.carbohydrates_100g,
                                      ingridient.protein_100g,
                                      ingridient.fat_100g
                                    )
                                  }
                                >
                                  <TrashIcon width={25} height={25} className="text-brownSemiDark mx-auto" />
                                </button>
                              )}
                            </div>
                          </div>
                        </>
                      );
                    })}
                  <div className={(currentSearchQuery.length > 0 && 'hidden') || 'visible'}>
                    <div className="pt-20 pr-20">
                      <Button className="w-full" onClick={() => setOpenerClass('hidden')}>
                        {t('Finish')}
                      </Button>
                    </div>
                  </div>
                </div>
                <div className={styles.ingridientPopupContent}>
                  {currentSection === 'recipes' ? (
                    currentIngridientSearch &&
                    recipesFilteredList.map((recipe: RecipesType, index: number) => (
                      <div key={index}>
                        <IngredientSearchPopupItem
                          itemObject={recipe}
                          updateDayId={updateDayId}
                          mealType={mealType}
                          planState={updateRecipeState}
                          planStateValue={recipeStateValue}
                        />
                      </div>
                    ))
                  ) : (
                    <>
                      {currentIngridientSearch &&
                        ingredientFilteredList?.length === 0 &&
                        currentIngridientSearchApi.foods.food === undefined && (
                          <div className="font-extralight px-20">
                            <p>Es wurden leider keine Lebensmittel zu deinem Suchbegriff gefunden.</p>
                            <p className="pt-10">Bitte versuche es mit einem anderen Suchbegriff.</p>
                          </div>
                        )}
                      {currentIngridientSearch &&
                        ingredientFilteredList &&
                        ingredientFilteredList?.length > 0 &&
                        ingredientFilteredList?.map((item, index) => (
                          <div className="flex" key={index}>
                            <div
                              className={styles.contentItem}
                              onClick={() =>
                                handleEditIngridientPopup(
                                  Math.random().toString(),
                                  item.name,
                                  item.preselect_amount,
                                  item.preselect_type,
                                  item.imageUrl,
                                  item.preselect_g,
                                  item.preselect_type,
                                  item.kcal_100g,
                                  item.carbohydrates_100g,
                                  item.protein_100g,
                                  item.fat_100g,
                                  item.default_piece,
                                  'notAdded'
                                )
                              }
                              onKeyDown={() =>
                                handleEditIngridientPopup(
                                  Math.random().toString(),
                                  item.name,
                                  item.preselect_amount,
                                  item.preselect_type,
                                  item.imageUrl,
                                  item.preselect_g,
                                  item.preselect_type,
                                  item.kcal_100g,
                                  item.carbohydrates_100g,
                                  item.protein_100g,
                                  item.fat_100g,
                                  item.default_piece,
                                  'notAdded'
                                )
                              }
                              aria-hidden="true"
                            >
                              <div className={styles.imageWrapper}>
                                <img
                                  src={item.imageUrl}
                                  alt=""
                                  width={45}
                                  height={45}
                                  loading="lazy"
                                  className={styles.image}
                                />
                              </div>
                              <div className={styles.description}>
                                <div className="pr-5">
                                  <div className="text-14 truncate w-100" title={item.name}>
                                    {item.name}
                                  </div>

                                  <div className="text-10 font-light">
                                    {item.preselect_amount} {item.preselect_type}{' '}
                                    {item.preselect_type !== 'g' &&
                                      item.preselect_type !== 'ml' &&
                                      item.default_piece === undefined &&
                                      `(${parseFloat(item.preselect_amount) * parseFloat(item.preselect_g)}g)`}
                                    {item.preselect_type !== 'g' &&
                                      item.preselect_type !== 'ml' &&
                                      item.default_piece !== undefined &&
                                      `(${parseFloat(item.preselect_amount) * parseFloat(item.preselect_g)}${
                                        item.default_piece
                                      })`}
                                  </div>
                                </div>
                                <div className={styles.category}>
                                  <div className={styles.item}>
                                    <div className="text-12">
                                      {Math.round(
                                        ((parseFloat(item.preselect_amount) * parseFloat(item.preselect_g)) / 100) *
                                          parseFloat(item.kcal_100g)
                                      )}
                                    </div>
                                    <div>kcal</div>
                                  </div>
                                  <div className={styles.itemSecondary}>
                                    <div className="text-12">
                                      {Math.round(
                                        ((parseFloat(item.preselect_amount) * parseFloat(item.preselect_g)) / 100) *
                                          parseFloat(item.carbohydrates_100g)
                                      )}
                                    </div>
                                    <div>KH</div>
                                  </div>
                                  <div className={styles.itemSecondary}>
                                    <div className="text-12">
                                      {Math.round(
                                        ((parseFloat(item.preselect_amount) * parseFloat(item.preselect_g)) / 100) *
                                          parseFloat(item.protein_100g)
                                      )}
                                    </div>
                                    <div>EW</div>
                                  </div>
                                  <div className={styles.itemSecondary}>
                                    <div className="text-12">
                                      {Math.round(
                                        ((parseFloat(item.preselect_amount) * parseFloat(item.preselect_g)) / 100) *
                                          parseFloat(item.fat_100g)
                                      )}
                                    </div>
                                    <div>Fett</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="pl-5 pt-15">
                              <PlusIcon
                                width={25}
                                height={25}
                                className="text-brownSemiDark cursor-pointer"
                                onClick={() =>
                                  addIngridientDirectInternal(
                                    item.preselect_type,
                                    parseFloat(item.preselect_amount),
                                    item.preselect_g,
                                    item.kcal_100g,
                                    item.carbohydrates_100g,
                                    item.protein_100g,
                                    item.fat_100g,
                                    item.name,
                                    item.category,
                                    item.imageUrl,
                                    item.preselect_type,
                                    item.default_piece !== undefined ? item.default_piece : 'g'
                                  )
                                }
                              />
                            </div>
                          </div>
                        ))}
                      {currentIngridientSearch &&
                        currentIngridientSearchApi.foods?.food?.length > 0 &&
                        currentIngridientSearchApi.foods.food.map((plans: any) => {
                          return (
                            <>
                              <div className="flex">
                                <div
                                  className={styles.contentItem}
                                  onClick={() => getAPIIngridientData(plans.food_id)}
                                  onKeyDown={() => getAPIIngridientData(plans.food_id)}
                                  aria-hidden="true"
                                >
                                  <div className={styles.imageWrapper}>
                                    <img
                                      src="https://static.tortija.de/ingridient_images/default_ingridient.png"
                                      alt=""
                                      width={45}
                                      height={45}
                                      loading="lazy"
                                      className={styles.image}
                                    />
                                  </div>
                                  <div className={styles.description}>
                                    <div className="pr-5">
                                      <div className="text-14 truncate w-100" title={plans.food_name}>
                                        {plans.food_name} {plans.brand_name !== undefined && `(${plans.brand_name})`}
                                      </div>
                                      <div className="text-10 font-light">
                                        {plans.food_description.substr(4, plans.food_description.indexOf('-') - 4)}
                                      </div>
                                    </div>
                                    <div className={styles.category}>
                                      <div className={styles.item}>
                                        <div className="text-12">
                                          {plans.food_description.match('Kalorien: (.*)kcal')[1]}
                                        </div>
                                        <div>kcal</div>
                                      </div>
                                      <div className={styles.itemSecondary}>
                                        <div className="text-12">
                                          {Math.round(parseFloat(plans.food_description.match('Kohlh: (.*)g')[1]))}
                                        </div>
                                        <div>KH</div>
                                      </div>
                                      <div className={styles.itemSecondary}>
                                        <div className="text-12">
                                          {Math.round(parseFloat(plans.food_description.match('Eiw: (.*)g')[1]))}
                                        </div>
                                        <div>EW</div>
                                      </div>
                                      <div className={styles.itemSecondary}>
                                        <div className="text-12">
                                          {Math.round(parseFloat(plans.food_description.match('Fett: (.*)g')[1]))}
                                        </div>
                                        <div>Fett</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="pl-5 pt-15">
                                  <PlusIcon
                                    width={25}
                                    height={25}
                                    className="text-brownSemiDark cursor-pointer"
                                    onClick={() => addIngridientDirectAPI(plans.food_id)}
                                  />
                                </div>
                              </div>
                            </>
                          );
                        })}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FilterDrawer
        isFilterOpen={isFilterOpen}
        closeFilterOpen={setFilterOpen}
        filterType={filterType}
        changeFilterType={setFilterType}
        recipesOption={recipesOption}
      />
    </>
  );
};

export default IngredientSearchPopup;
