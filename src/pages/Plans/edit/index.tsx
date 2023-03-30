import React, { useContext, useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useHistory, useParams, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  PencilIcon,
  PlusIcon,
  TrashIcon,
  DotsVerticalIcon,
  XIcon,
  DocumentDuplicateIcon,
  CalendarIcon,
  RefreshIcon,
  PlusCircleIcon,
  CogIcon,
  ExclamationIcon,
} from '@heroicons/react/outline';
import { MainContext } from 'providers/MainProvider';
import { AuthContext } from 'providers/AuthProvider';
import ButtonBack from 'components/ButtonBack';
import Button from 'components/Button';
import SwitchButton from 'components/SwitchButton';
import HashTagBadge from 'pages/Plans/components/HashTagBadge';
import { formOfNutrition, intolerancesOption } from 'shared/constants/profile-wizard';
import MakroCircles from 'components/MakroCircles';
import firebase from 'services/firebase';
import IngredientSearchPopup from 'components/IngredientSearchPopup';
import { toast } from 'react-toast';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import Checkbox from 'components/Checkbox';
import Select, { OptionTypeBase } from 'react-select';
import { customSelectStyles } from 'shared/constants/global';
import { handleOpenClosePopups, scrollToElement } from 'shared/functions/global';
import PopupMealItem from './components/PopupMealItem';
import NewRecipeStep1 from '../../Nutrition/components/NewRecipeStep1';
import NewRecipeStep2 from '../../Nutrition/components/NewRecipeStep2';
import NewRecipeStep3 from '../../Nutrition/components/NewRecipeStep3';
import NewRecipeStep4 from '../../Nutrition/components/NewRecipeStep4';
import NewRecipeStep5 from '../../Nutrition/components/NewRecipeStep5';
import NewRecipeStep6 from '../../Nutrition/components/NewRecipeStep6';
import ClosePopup from '../../Nutrition/components/ClosePopup';
import EditMealCard from './components/EditMealCard';
import styles from './styles.module.scss';

type ParamsType = {
  id: string;
};

const PlanEdit: React.FC = () => {
  const { id } = useParams<ParamsType>();
  const { t } = useTranslation();
  const [currentDayId, setCurrentDayId] = useState(1);
  const plan = useContext(MainContext).planList?.find(item => item.uid === id);
  const favoritesPlansList = useContext(MainContext).favoritesPlansList?.find(item => item.origId === id);
  const authContext = useContext(AuthContext);
  const [currentPlan, setCurrentPlan] = useState(plan) as any;
  const currentDayItem = currentPlan?.dayEntries.filter((item: any) => item.id === currentDayId)[0];

  const [currentCopyMealItem, setCurrentCopyMealItem] = useState({
    kcal_total: 0,
    carbohydrates_total: 0,
    protein_total: 0,
    fat_total: 0,
    recipes: [],
    ingredients: [],
  });

  const [planFavorite, setPlanFavorite] = useState(false);

  const [planDateArray, setPlanDateArray] = useState([]) as any;

  const [popupDynamicAddCopyClass, setPopupDynamicAddCopyClass] = useState('hidden');
  const [startDateIndexPage, setStartDateIndexPage] = useState(null);
  const changeCopyDateIndexPage = (dates: any) => {
    setStartDateIndexPage(dates);
  };
  const CustomInputIndexPage = (props: React.HTMLProps<HTMLInputElement>, ref: React.Ref<HTMLInputElement>) => {
    return (
      <label>
        <div className="flex w-full">
          <div className="flex-1">
            <input {...props} />
          </div>
          <div className="ml-10 my-auto">
            <CalendarIcon width={25} height={25} className="text-brownSemiDark mx-auto cursor-pointer" />
          </div>
        </div>
      </label>
    );
  };
  const [currentCopyMealTypeValueIndexPage, setCurrentCopyMealTypeValueIndexPage] = useState('breakfast');

  const [editFormOfNutritionOverlayClass, setEditFormOfNutritionOverlayClass] = useState('hidden');

  const [showIncombalitiesOverlayClass, setShowIncombalitiesOverlayClass] = useState('hidden');

  const [currentStep, setCurrentStep] = useState('1');
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
  const [newRecipeOverlayClass, setNewRecipeOverlayClass] = useState('hidden');
  const [closeRecipeOverlayClass, setCloseRecipeOverlayClass] = useState('hidden');
  const [ingredientSearchPopupClass, setIngredientSearchPopupClass] = useState('hidden');

  const [currentPlanName, setCurrentPlanName] = useState(currentPlan?.name);

  const [currentMealType, setCurrentMealType] = useState('breakfast');
  const [currentMealLabel, setCurrentMealLabel] = useState('Frühstück');

  const [currentDayBreakfastImage, setCurrentDayBreakfastImage] = useState('');
  const [currentDayBreakfastMealLabel, setCurrentDayBreakfastMealLabel] = useState('');
  const [currentDayBreakfastMealCounter, setCurrentDayBreakfastMealCounter] = useState(0);
  const [currentDayBreakfastType, setCurrentDayBreakfastType] = useState('add');
  const [currentDayBreakfastKcalTotal, setCurrentDayBreakfastKcalTotal] = useState(0);
  const [currentDayBreakfastCarbohydratesTotal, setCurrentDayBreakfastCarbohydratesTotal] = useState(0);
  const [currentDayBreakfastProteinTotal, setCurrentDayBreakfastProteinTotal] = useState(0);
  const [currentDayBreakfastFatTotal, setCurrentDayBreakfastFatTotal] = useState(0);

  const [currentDayLunchImage, setCurrentDayLunchImage] = useState('');
  const [currentDayLunchMealLabel, setCurrentDayLunchMealLabel] = useState('');
  const [currentDayLunchMealCounter, setCurrentDayLunchMealCounter] = useState(0);
  const [currentDayLunchType, setCurrentDayLunchType] = useState('add');
  const [currentDayLunchKcalTotal, setCurrentDayLunchKcalTotal] = useState(0);
  const [currentDayLunchCarbohydratesTotal, setCurrentDayLunchCarbohydratesTotal] = useState(0);
  const [currentDayLunchProteinTotal, setCurrentDayLunchProteinTotal] = useState(0);
  const [currentDayLunchFatTotal, setCurrentDayLunchFatTotal] = useState(0);

  const [currentDayDinnerImage, setCurrentDayDinnerImage] = useState('');
  const [currentDayDinnerMealLabel, setCurrentDayDinnerMealLabel] = useState('');
  const [currentDayDinnerMealCounter, setCurrentDayDinnerMealCounter] = useState(0);
  const [currentDayDinnerType, setCurrentDayDinnerType] = useState('add');
  const [currentDayDinnerKcalTotal, setCurrentDayDinnerKcalTotal] = useState(0);
  const [currentDayDinnerCarbohydratesTotal, setCurrentDayDinnerCarbohydratesTotal] = useState(0);
  const [currentDayDinnerProteinTotal, setCurrentDayDinnerProteinTotal] = useState(0);
  const [currentDayDinnerFatTotal, setCurrentDayDinnerFatTotal] = useState(0);

  const [currentDaySnacksImage, setCurrentDaySnacksImage] = useState('');
  const [currentDaySnacksMealLabel, setCurrentDaySnacksMealLabel] = useState('');
  const [currentDaySnacksMealCounter, setCurrentDaySnacksMealCounter] = useState(0);
  const [currentDaySnacksType, setCurrentDaySnacksType] = useState('add');
  const [currentDaySnacksKcalTotal, setCurrentDaySnacksKcalTotal] = useState(0);
  const [currentDaySnacksCarbohydratesTotal, setCurrentDaySnacksCarbohydratesTotal] = useState(0);
  const [currentDaySnacksProteinTotal, setCurrentDaySnacksProteinTotal] = useState(0);
  const [currentDaySnacksFatTotal, setCurrentDaySnacksFatTotal] = useState(0);

  const [viewMealPopupClass, setViewMealPopupClass] = useState('hidden');

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerMacroCircles = useRef<HTMLDivElement>(null);
  const recipePopupContentRef = useRef<HTMLDivElement>(null);

  const [currentCopyTypeValueIndexPage, setCurrentCopyTypeValueIndexPage] = useState('date');
  const copyTypeValuesIndexPage: OptionTypeBase[] = [
    { value: 'date', label: 'Auf ein bestimmtes Datum kopieren' },
    { value: 'days', label: 'Auf bestimmte Wochentage kopieren' },
    { value: 'all', label: 'In jeden Tag kopieren' },
  ];
  const mealTypeValuesIndexPage: OptionTypeBase[] = [
    { value: 'breakfast', label: 'Frühstück' },
    { value: 'lunch', label: 'Mittagessen' },
    { value: 'dinner', label: 'Abendessen' },
    { value: 'snacks', label: 'Snacks' },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    centerMode: true,
    dotsClass: 'slick-dots text-white',
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
          arrows: false,
          centerMode: false,
          fade: true,
          adaptiveHeight: true,
        },
      },
    ],
  };

  const mainLeftColumnRef = useRef<HTMLDivElement>(null);

  const changePlanDay = (dayId: number) => {
    setCurrentDayId(dayId);

    getMealImage('breakfast', dayId);
    getMealImage('lunch', dayId);
    getMealImage('dinner', dayId);
    getMealImage('snacks', dayId);
  };

  function copyMeal() {
    const getYear = moment(startDateIndexPage).format('YYYY');
    const getMonth = moment(startDateIndexPage).format('MM');
    const getDay = moment(startDateIndexPage).format('DD');
    const mergedDate = getYear + getMonth + getDay;
    let planExists = false;
    let thisCopyDayId = 0;

    let thisCopyTypeValue = currentCopyMealTypeValueIndexPage;
    if (thisCopyTypeValue === undefined || thisCopyTypeValue.length === 0) {
      thisCopyTypeValue = 'breakfast';
    }

    if (currentCopyTypeValueIndexPage === 'date') {
      const dayExistsInPlan = currentPlan?.dayEntries?.filter((item: any) => {
        const getItemYear = moment.unix(item.date?.seconds).format('YYYY');
        const getItemMonth = moment.unix(item.date?.seconds).format('MM');
        const getItemDay = moment.unix(item.date?.seconds).format('DD');
        const mergedItemDate = getItemYear + getItemMonth + getItemDay;

        if (mergedItemDate === mergedDate) {
          planExists = true;
          thisCopyDayId = item.id;
          return true;
        }
        return false;
      });

      if (planExists && currentPlan !== undefined) {
        handleOpenClosePopups(setPopupDynamicAddCopyClass, '', 'close');

        const thisGoalElement = currentPlan?.dayEntries.filter((item: any) => item.id === thisCopyDayId)[0];
        const thisKcalTotalGoalElement = thisGoalElement[currentCopyMealTypeValueIndexPage].kcal_total;
        const thisCarbohydratesTotalGoalElement =
          thisGoalElement[currentCopyMealTypeValueIndexPage].carbohydrates_total;
        const thisProteinTotalGoalElement = thisGoalElement[currentCopyMealTypeValueIndexPage].protein_total;
        const thisFatTotalGoalElement = thisGoalElement[currentCopyMealTypeValueIndexPage].fat_total;

        let thisCalculatedKcal = 0;
        let thisCalculatedCarbohydrates = 0;
        let thisCalculatedProtein = 0;
        let thisCalculatedFat = 0;

        if (parseFloat(thisGoalElement.kcal_total) - parseFloat(thisKcalTotalGoalElement) > 0) {
          thisCalculatedKcal = parseFloat(thisGoalElement.kcal_total) - parseFloat(thisKcalTotalGoalElement);
        }

        if (parseFloat(thisGoalElement.carbohydrates_total) - parseFloat(thisCarbohydratesTotalGoalElement) > 0) {
          thisCalculatedCarbohydrates =
            parseFloat(thisGoalElement.carbohydrates_total) - parseFloat(thisCarbohydratesTotalGoalElement);
        }

        if (parseFloat(thisGoalElement.protein_total) - parseFloat(thisProteinTotalGoalElement) > 0) {
          thisCalculatedProtein = parseFloat(thisGoalElement.protein_total) - parseFloat(thisProteinTotalGoalElement);
        }

        if (parseFloat(thisGoalElement.fat_total) - parseFloat(thisFatTotalGoalElement) > 0) {
          thisCalculatedFat = parseFloat(thisGoalElement.fat_total) - parseFloat(thisFatTotalGoalElement);
        }

        const newColumnsAdd = {
          ...currentPlan,
          dayEntries: currentPlan.dayEntries.map((entries: any) => {
            if (parseFloat(entries.id) !== thisCopyDayId) return entries;
            return {
              ...entries,
              kcal_total: thisCalculatedKcal + currentCopyMealItem.kcal_total,
              carbohydrates_total: thisCalculatedCarbohydrates + currentCopyMealItem.carbohydrates_total,
              protein_total: thisCalculatedProtein + currentCopyMealItem.protein_total,
              fat_total: thisCalculatedFat + currentCopyMealItem.fat_total,
              [currentCopyMealTypeValueIndexPage]: {
                ...currentCopyMealItem,
              },
            };
          }),
        };

        toast.success('Die Mahlzeit wurde erfolgreich kopiert!');
        setCurrentPlan(newColumnsAdd);
        scrollToElement(scrollContainerMacroCircles);
        setCurrentCopyMealTypeValueIndexPage('breakfast');
        setCurrentCopyTypeValueIndexPage('date');
      } else {
        toast.error('Dieses Datum existiert nicht in dem Plan. Bitte wähle ein anderes Datum!');
      }
    } else if (currentCopyTypeValueIndexPage === 'all') {
      handleOpenClosePopups(setPopupDynamicAddCopyClass, '', 'close');

      const newColumnsAdd = {
        ...currentPlan,
        dayEntries: currentPlan?.dayEntries.map((entries: any) => {
          let thisCalculatedKcal = 0;
          let thisCalculatedCarbohydrates = 0;
          let thisCalculatedProtein = 0;
          let thisCalculatedFat = 0;

          if (parseFloat(entries.kcal_total) - parseFloat(entries[currentCopyMealTypeValueIndexPage].kcal_total) > 0) {
            thisCalculatedKcal =
              parseFloat(entries.kcal_total) - parseFloat(entries[currentCopyMealTypeValueIndexPage].kcal_total);
          }

          if (
            parseFloat(entries.carbohydrates_total) -
              parseFloat(entries[currentCopyMealTypeValueIndexPage].carbohydrates_total) >
            0
          ) {
            thisCalculatedCarbohydrates =
              parseFloat(entries.carbohydrates_total) -
              parseFloat(entries[currentCopyMealTypeValueIndexPage].carbohydrates_total);
          }

          if (
            parseFloat(entries.protein_total) - parseFloat(entries[currentCopyMealTypeValueIndexPage].protein_total) >
            0
          ) {
            thisCalculatedProtein =
              parseFloat(entries.protein_total) - parseFloat(entries[currentCopyMealTypeValueIndexPage].protein_total);
          }

          if (parseFloat(entries.fat_total) - parseFloat(entries[currentCopyMealTypeValueIndexPage].fat_total) > 0) {
            thisCalculatedFat =
              parseFloat(entries.fat_total) - parseFloat(entries[currentCopyMealTypeValueIndexPage].fat_total);
          }
          if (parseFloat(entries.id) === currentDayId) return entries;
          return {
            ...entries,
            kcal_total: thisCalculatedKcal + currentCopyMealItem.kcal_total,
            carbohydrates_total: thisCalculatedCarbohydrates + currentCopyMealItem.carbohydrates_total,
            protein_total: thisCalculatedProtein + currentCopyMealItem.protein_total,
            fat_total: thisCalculatedFat + currentCopyMealItem.fat_total,
            [currentCopyMealTypeValueIndexPage]: {
              ...currentCopyMealItem,
            },
          };
        }),
      };

      toast.success('Das Rezept wurde erfolgreich in jeden Tag kopiert!');
      setCurrentPlan(newColumnsAdd);
      setCurrentCopyMealTypeValueIndexPage('breakfast');
      setCurrentCopyTypeValueIndexPage('date');
    }
  }

  function closeRecipePopup() {
    setNewRecipeOverlayClass('hidden');
    setCloseRecipeOverlayClass('block');
  }

  function closeRecipe() {
    setCloseRecipeOverlayClass('hidden');
  }

  function reOpenRecipe() {
    setCloseRecipeOverlayClass('hidden');
    setNewRecipeOverlayClass('block');
  }

  const getMealImage = (type: string, dayId: number) => {
    if (type === 'breakfast') {
      const thisBreakfastItem = plan?.dayEntries.filter((item: any) => item.id === dayId)[0].breakfast;

      let thisCounter = 0;
      if (thisBreakfastItem) {
        if (thisBreakfastItem.recipes.length > 0 || thisBreakfastItem.ingredients.length > 0) {
          setCurrentDayBreakfastType('show');
          if (thisBreakfastItem.recipes.length > 0) {
            setCurrentDayBreakfastImage(thisBreakfastItem.recipes[0].imageUrl);
            setCurrentDayBreakfastMealLabel(thisBreakfastItem.recipes[0].name);
            thisCounter += thisBreakfastItem.recipes.length;
          }
          if (thisBreakfastItem.ingredients.length > 0) {
            thisCounter += thisBreakfastItem.ingredients.length;
          }
          if (thisBreakfastItem.ingredients.length > 0 && thisBreakfastItem.recipes.length === 0) {
            setCurrentDayBreakfastImage(thisBreakfastItem.ingredients[0].imageUrl);
            setCurrentDayBreakfastMealLabel(thisBreakfastItem.ingredients[0].name);
          }
        } else {
          setCurrentDayBreakfastImage('');
          setCurrentDayBreakfastMealLabel('');
          setCurrentDayBreakfastType('add');
        }

        setCurrentDayBreakfastKcalTotal(thisBreakfastItem.kcal_total);
        setCurrentDayBreakfastCarbohydratesTotal(thisBreakfastItem.carbohydrates_total);
        setCurrentDayBreakfastProteinTotal(thisBreakfastItem.protein_total);
        setCurrentDayBreakfastFatTotal(thisBreakfastItem.fat_total);
        setCurrentDayBreakfastMealCounter(thisCounter - 1);
      }
    }

    if (type === 'lunch') {
      const thisLunchItem = plan?.dayEntries.filter((item: any) => item.id === dayId)[0].lunch;

      let thisCounter = 0;
      if (thisLunchItem) {
        if (thisLunchItem.recipes.length > 0 || thisLunchItem.ingredients.length > 0) {
          setCurrentDayLunchType('show');
          if (thisLunchItem.recipes.length > 0) {
            setCurrentDayLunchImage(thisLunchItem.recipes[0].imageUrl);
            setCurrentDayLunchMealLabel(thisLunchItem.recipes[0].name);
            thisCounter += thisLunchItem.recipes.length;
          }
          if (thisLunchItem.ingredients.length > 0) {
            thisCounter += thisLunchItem.ingredients.length;
          }
          if (thisLunchItem.ingredients.length > 0 && thisLunchItem.recipes.length === 0) {
            setCurrentDayLunchImage(thisLunchItem.ingredients[0].imageUrl);
            setCurrentDayLunchMealLabel(thisLunchItem.ingredients[0].name);
          }
        } else {
          setCurrentDayLunchImage('');
          setCurrentDayLunchMealLabel('');
          setCurrentDayLunchType('add');
        }

        setCurrentDayLunchKcalTotal(thisLunchItem.kcal_total);
        setCurrentDayLunchCarbohydratesTotal(thisLunchItem.carbohydrates_total);
        setCurrentDayLunchProteinTotal(thisLunchItem.protein_total);
        setCurrentDayLunchFatTotal(thisLunchItem.fat_total);
        setCurrentDayLunchMealCounter(thisCounter - 1);
      }
    }

    if (type === 'dinner') {
      const thisDinnerItem = plan?.dayEntries.filter((item: any) => item.id === dayId)[0].dinner!;

      let thisCounter = 0;
      if (thisDinnerItem) {
        if (thisDinnerItem.recipes.length > 0 || thisDinnerItem.ingredients.length > 0) {
          setCurrentDayDinnerType('show');
          if (thisDinnerItem.recipes.length > 0) {
            setCurrentDayDinnerImage(thisDinnerItem.recipes[0].imageUrl);
            setCurrentDayDinnerMealLabel(thisDinnerItem.recipes[0].name);
            thisCounter += thisDinnerItem.recipes.length;
          }
          if (thisDinnerItem.ingredients.length > 0) {
            thisCounter += thisDinnerItem.ingredients.length;
          }
          if (thisDinnerItem.ingredients.length > 0 && thisDinnerItem.recipes.length === 0) {
            setCurrentDayDinnerImage(thisDinnerItem.ingredients[0].imageUrl);
            setCurrentDayDinnerMealLabel(thisDinnerItem.ingredients[0].name);
          }
        } else {
          setCurrentDayDinnerImage('');
          setCurrentDayDinnerMealLabel('');
          setCurrentDayDinnerType('add');
        }

        setCurrentDayDinnerKcalTotal(thisDinnerItem.kcal_total);
        setCurrentDayDinnerCarbohydratesTotal(thisDinnerItem.carbohydrates_total);
        setCurrentDayDinnerProteinTotal(thisDinnerItem.protein_total);
        setCurrentDayDinnerFatTotal(thisDinnerItem.fat_total);
        setCurrentDayDinnerMealCounter(thisCounter - 1);
      }
    }

    if (type === 'snacks') {
      const thisSnacksItem = plan?.dayEntries.filter((item: any) => item.id === dayId)[0].snacks;

      let thisCounter = 0;
      if (thisSnacksItem) {
        if (thisSnacksItem.recipes.length > 0 || thisSnacksItem.ingredients.length > 0) {
          setCurrentDaySnacksType('show');
          if (thisSnacksItem.recipes.length > 0) {
            setCurrentDaySnacksImage(thisSnacksItem.recipes[0].imageUrl);
            setCurrentDaySnacksMealLabel(thisSnacksItem.recipes[0].name);
            thisCounter += thisSnacksItem.recipes.length;
          }
          if (thisSnacksItem.ingredients.length > 0) {
            thisCounter += thisSnacksItem.ingredients.length;
          }
          if (thisSnacksItem.ingredients.length > 0 && thisSnacksItem.recipes.length === 0) {
            setCurrentDaySnacksImage(thisSnacksItem.ingredients[0].imageUrl);
            setCurrentDaySnacksMealLabel(thisSnacksItem.ingredients[0].name);
          }
        } else {
          setCurrentDaySnacksImage('');
          setCurrentDaySnacksMealLabel('');
          setCurrentDaySnacksType('add');
        }

        setCurrentDaySnacksKcalTotal(thisSnacksItem.kcal_total);
        setCurrentDaySnacksCarbohydratesTotal(thisSnacksItem.carbohydrates_total);
        setCurrentDaySnacksProteinTotal(thisSnacksItem.protein_total);
        setCurrentDaySnacksFatTotal(thisSnacksItem.fat_total);
        setCurrentDaySnacksMealCounter(thisCounter - 1);
      }
    }
  };

  function getDateRange(startRangeDate: any, endRangeDate: any) {
    const day1 = moment(endRangeDate);
    const day2 = moment(startRangeDate);
    const result = [];

    while (day1.date() !== day2.date()) {
      day2.add(1, 'day');
      result.push(moment(day2).toDate());
    }

    return result;
  }

  const openMealPopup = (mealType: string, mealLabel: string) => {
    setViewMealPopupClass('block');
    setCurrentMealType(mealType);
    setCurrentMealLabel(mealLabel);
  };

  // Change plan name
  const updatePlanName = (event: any) => {
    setCurrentPlanName(event.currentTarget.textContent.trim());
  };

  function openIngredientSearchPopup() {
    setIngredientSearchPopupClass('block');
  }

  // Change form of nutrition items
  const setFormOfNutritions = (status: boolean, item: string): void => {
    const newColumns = {
      ...currentPlan,
      [item.toLowerCase()]: status,
    };

    setCurrentPlan(newColumns);
  };

  const savePlanToFavorites = async () => {
    const newColumns = {
      uid: plan?.uid,
      name: plan?.name,
      origId: plan?.uid,
    };

    if (planFavorite) {
      try {
        await firebase
          .firestore()
          .collection('users')
          .doc(authContext.user?.uid)
          .collection('favorites_plans')
          .doc(favoritesPlansList?.uid)
          .delete();

        setPlanFavorite(false);
        toast.success('Der Plan wurde erfolgreich von deinen Favoriten entfernt!');
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        toast.error('Es ist leider etwas schief gegangen!');
      }
    } else {
      try {
        await firebase
          .firestore()
          .collection('users')
          .doc(authContext.user?.uid)
          .collection('favorites_plans')
          .doc()
          .set(newColumns as object);

        setPlanFavorite(true);
        toast.success('Der Plan wurde erfolgreich zu deinen Favoriten gespeichert!');
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        toast.error('Es ist leider etwas schief gegangen!');
      }
    }
  };

  useEffect(() => {
    if (currentDayItem?.kcal_total) {
      getMealImage('breakfast', currentDayId);
      getMealImage('lunch', currentDayId);
      getMealImage('dinner', currentDayId);
      getMealImage('snacks', currentDayId);

      if (planDateArray.length === 0) {
        setPlanDateArray(
          getDateRange(
            moment.unix(currentPlan?.startDate.seconds).utc().format('YYYY-MM-DD'),
            moment.unix(currentPlan?.endDate.seconds).utc().format('YYYY-MM-DD')
          )
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (favoritesPlansList !== undefined) {
      setPlanFavorite(true);
    }
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollIntoView();
      }
    }, 1);
  }, [favoritesPlansList]);

  return (
    <>
      <IngredientSearchPopup
        mealType={currentMealType}
        popupType="plan"
        openerClass={ingredientSearchPopupClass}
        setOpenerClass={setIngredientSearchPopupClass}
        updateRecipeState={setCurrentPlan}
        recipeStateValue={currentPlan}
        updateDayId={currentDayId}
      />
      <div className={popupDynamicAddCopyClass}>
        <div className={styles.backgroundPopupLayer}>
          <div className={styles.editPicturePopup}>
            <div className="flex justify-between pt-20 pl-20">
              <div className="flex">
                <div className="my-auto pr-10">
                  <DocumentDuplicateIcon width={25} height={25} className="text-brownSemiDark mx-auto" />
                </div>
                <div className="text-xl my-auto font-light">Mahlzeit kopieren</div>
              </div>
              <div className="my-auto pr-20">
                <XIcon
                  width={25}
                  height={25}
                  className="text-brownSemiDark mx-auto cursor-pointer"
                  onClick={() => handleOpenClosePopups(setPopupDynamicAddCopyClass, '', 'close')}
                />
              </div>
            </div>
            <div className={styles.editPictureIngridientPopupContent}>
              <div className="pt-15 pl-20 pb-30 font-extralight">
                <div className="pb-15">
                  <div className="pb-10">Wie möchtest du diese Mahlzeit kopieren?</div>
                  <Select
                    options={copyTypeValuesIndexPage}
                    styles={customSelectStyles}
                    value={copyTypeValuesIndexPage.filter((item: any) => item.value === currentCopyTypeValueIndexPage)}
                    onChange={e => setCurrentCopyTypeValueIndexPage(e?.value)}
                  />
                </div>
                {currentCopyTypeValueIndexPage === 'date' && (
                  <>
                    <div>
                      <div className="flex gap-20 pt-4">
                        <div className="font-light my-auto w-130">Zu welchem Datum?</div>
                        <div className="flex-1">
                          <div>
                            <DatePicker
                              className="w-full appearance-none block py-1 px-2 rounded-md text-base placeholder-gray-400 focus:outline-none bg-lightDarkGray bg-opacity-20 text-white border-solid border border-white border-opacity-30"
                              dateFormat="dd.MM.yyyy"
                              selected={startDateIndexPage}
                              includeDates={planDateArray}
                              onChange={changeCopyDateIndexPage}
                              customInput={React.createElement(React.forwardRef(CustomInputIndexPage))}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {currentCopyTypeValueIndexPage === 'days' && (
                  <>
                    <div>
                      <div className="text-14">
                        Wähle die Wochentage aus und das Rezept wird zu diesen Tagen kopiert!
                      </div>
                      <div className="flex flex-wrap gap-10 pt-10">
                        <Checkbox label="Montag" name="monday" register="t" />
                        <Checkbox label="Dienstag" name="monday" register="t" />
                        <Checkbox label="Mittwoch" name="monday" register="t" />
                        <Checkbox label="Donnerstag" name="monday" register="t" />
                        <Checkbox label="Freitag" name="monday" register="t" />
                        <Checkbox label="Samstag" name="monday" register="t" />
                        <Checkbox label="Sonntag" name="monday" register="t" />
                      </div>
                    </div>
                  </>
                )}
                <div>
                  <div className="flex gap-20 pt-4">
                    <div className="font-light my-auto w-130">Zu welcher Mahlzeit?</div>
                    <div className="flex-1">
                      <div>
                        <Select
                          options={mealTypeValuesIndexPage}
                          styles={customSelectStyles}
                          value={mealTypeValuesIndexPage.filter(
                            (item: any) => item.value === currentCopyMealTypeValueIndexPage
                          )}
                          onChange={e => setCurrentCopyMealTypeValueIndexPage(e?.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-20">Hier werden die Rezepte und Lebensmittel von deiner Mahlzeit angezeigt.</div>
                <div className="pt-15">
                  {currentCopyMealItem?.ingredients.map((item: any, index: number) => (
                    <div key={index}>
                      <PopupMealItem
                        itemObject={item}
                        planState={setCurrentCopyMealItem}
                        planStateValue={currentCopyMealItem}
                        type="Lebensmittel"
                      />
                    </div>
                  ))}
                  {currentCopyMealItem?.recipes.map((item: any, index: number) => (
                    <div key={index}>
                      <PopupMealItem
                        itemObject={item}
                        planState={setCurrentCopyMealItem}
                        planStateValue={currentCopyMealItem}
                        type="Rezept"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <strong>Hinweis: </strong>Wenn du diese Mahlzeit an eine andere Stelle kopierst werden die bisherigen
                  Rezepte und Lebensmittel an dem neuen Ort ersetzt!
                </div>
                <div className="pt-40">
                  <Button className="w-full" onClick={() => copyMeal()}>
                    Kopieren
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={newRecipeOverlayClass}>
        <div className={styles.backgroundPopupLayer}>
          <div className={styles.editIngridientPopup}>
            <div className="flex justify-between pt-20 pl-20">
              <div className="flex">
                <div className="my-auto pr-10">
                  <PlusIcon width={25} height={25} className="text-brownSemiDark mx-auto" />
                </div>
                <div className="text-xl my-auto font-light">Neues Rezept hinzufügen</div>
              </div>
              <div className="my-auto pr-20">
                <XIcon
                  width={25}
                  height={25}
                  className="text-brownSemiDark mx-auto cursor-pointer"
                  onClick={() => closeRecipePopup()}
                />
              </div>
            </div>
            <div className={styles.addRecipePopupContent} ref={recipePopupContentRef}>
              <div className="pt-15 pb-30 px-20">
                {currentStep === '1' && (
                  <NewRecipeStep1
                    currentStep={setCurrentStep}
                    currentStepValue={currentStep}
                    recipeState={setCurrentAddRecipe}
                    recipeStateValue={currentAddRecipe}
                    popupContainerRef={recipePopupContentRef}
                  />
                )}
                {currentStep === '2' && (
                  <NewRecipeStep2
                    currentStep={setCurrentStep}
                    currentStepValue={currentStep}
                    recipeState={setCurrentAddRecipe}
                    recipeStateValue={currentAddRecipe}
                    popupContainerRef={recipePopupContentRef}
                  />
                )}
                {currentStep === '3' && (
                  <NewRecipeStep3
                    currentStep={setCurrentStep}
                    currentStepValue={currentStep}
                    recipeState={setCurrentAddRecipe}
                    recipeStateValue={currentAddRecipe}
                    mainPopup={setNewRecipeOverlayClass}
                    popupContainerRef={recipePopupContentRef}
                  />
                )}
                {currentStep === '4' && (
                  <NewRecipeStep4
                    currentStep={setCurrentStep}
                    currentStepValue={currentStep}
                    recipeState={setCurrentAddRecipe}
                    recipeStateValue={currentAddRecipe}
                    popupContainerRef={recipePopupContentRef}
                  />
                )}
                {currentStep === '5' && (
                  <NewRecipeStep5
                    currentStep={setCurrentStep}
                    currentStepValue={currentStep}
                    recipeState={setCurrentAddRecipe}
                    recipeStateValue={currentAddRecipe}
                    popupContainerRef={recipePopupContentRef}
                  />
                )}
                {currentStep === '6' && (
                  <NewRecipeStep6
                    currentStep={setCurrentStep}
                    currentStepValue={currentStep}
                    recipeState={setCurrentAddRecipe}
                    recipeStateValue={currentAddRecipe}
                    mainPopup={setNewRecipeOverlayClass}
                    popupContainerRef={recipePopupContentRef}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={closeRecipeOverlayClass}>
        <ClosePopup closeFunction={closeRecipe} reOpenFunction={reOpenRecipe} />
      </div>

      <div className={editFormOfNutritionOverlayClass}>
        <div className={styles.backgroundPopupLayer}>
          <div className={styles.editPicturePopup}>
            <div className="flex justify-between pt-20 pl-20">
              <div className="flex">
                <div className="my-auto pr-10">
                  <PencilIcon width={25} height={25} className="text-brownSemiDark mx-auto" />
                </div>
                <div className="text-xl my-auto font-light">Ernährungsform bearbeiten</div>
              </div>
              <div className="my-auto pr-20">
                <XIcon
                  width={25}
                  height={25}
                  className="text-brownSemiDark mx-auto cursor-pointer"
                  onClick={() => handleOpenClosePopups(setEditFormOfNutritionOverlayClass, '', 'close')}
                />
              </div>
            </div>
            <div className={styles.editPictureIngridientPopupContent}>
              <div className="pt-30 font-extralight text-base pl-20 pr-15 pb-30">
                <div>Folgende Ernährungsformen passen zu diesem Plan.</div>
                <div className="pt-1">Du kannst diese bei Bedarf anpassen (Mehrfachauswahl möglich).</div>
                <div className="pt-40">
                  {formOfNutrition.map((item: string, index: number) => (
                    <>
                      <SwitchButton
                        key={index}
                        label={item}
                        enabled={
                          currentPlan?.name !== undefined && typeof currentPlan[item.toLowerCase()] !== undefined
                            ? Boolean(currentPlan[item.toLowerCase()])
                            : false
                        }
                        isBackground={index % 2 === 0}
                        onChange={setFormOfNutritions}
                      />
                    </>
                  ))}
                </div>
              </div>
              <div className="pl-20 pr-10 pb-40">
                <Button
                  className="w-full"
                  onClick={() => handleOpenClosePopups(setEditFormOfNutritionOverlayClass, '', 'close')}
                >
                  {t('Finish')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={showIncombalitiesOverlayClass}>
        <div className={styles.backgroundPopupLayer}>
          <div className={styles.editPicturePopup}>
            <div className="flex justify-between pt-20 pl-20">
              <div className="flex">
                <div className="my-auto pr-10">
                  <ExclamationIcon width={25} height={25} className="text-brownSemiDark mx-auto" />
                </div>
                <div className="text-xl my-auto font-light">Unverträglichkeiten</div>
              </div>
              <div className="my-auto pr-20">
                <XIcon
                  width={25}
                  height={25}
                  className="text-brownSemiDark mx-auto cursor-pointer"
                  onClick={() => handleOpenClosePopups(setShowIncombalitiesOverlayClass, '', 'close')}
                />
              </div>
            </div>
            <div className={styles.editPictureIngridientPopupContent}>
              <div className="pt-30 font-extralight text-base pl-20 pr-15 pb-30">
                <div>Folgende Unverträglichkeiten haben wir in diesem Plan erkannt:</div>
                <div className="pt-40">
                  {intolerancesOption.map((item: string, index: number) => (
                    <>
                      {currentPlan?.name !== undefined &&
                        typeof currentPlan[item.toLowerCase()] !== undefined &&
                        Boolean(currentPlan[item.toLowerCase()]) && (
                          <SwitchButton
                            key={index}
                            label={item}
                            enabled={
                              currentPlan?.name !== undefined && typeof currentPlan[item.toLowerCase()] !== undefined
                                ? Boolean(currentPlan[item.toLowerCase()])
                                : false
                            }
                            isBackground={index % 2 === 0}
                          />
                        )}
                    </>
                  ))}
                </div>
              </div>
              <div className="pl-20 pr-10 pb-40">
                <Button
                  className="w-full"
                  onClick={() => handleOpenClosePopups(setShowIncombalitiesOverlayClass, '', 'close')}
                >
                  {t('Close')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="md:flex hidden">
        <div className="w-1/2">
          <div className="sticky top-0">
            <div className="w-32 pt-60">
              <div>
                <Link
                  to={{
                    pathname: '/plans',
                  }}
                >
                  <ButtonBack
                    text={t('Return')}
                    className="rounded-2xl pr-15 border-transparent border-2 hover:border-brownSemiDark"
                  />
                </Link>
              </div>
            </div>
            <div className="flex pt-40">
              <div
                onInput={updatePlanName}
                className="text-white leading-8 border border-opacity-30 border-white p-10 rounded-xl font-semibold text-30"
                contentEditable
                suppressContentEditableWarning
              >
                {plan?.name}
              </div>
              <div className="z-10 cursor-pointer my-auto ml-10">
                <PencilIcon width={25} height={25} className="text-brownSemiDark" />
              </div>
            </div>
            <div className="pt-20">
              <img className="object-cover rounded-3xl h-300 w-full" src={plan?.imageUrl} alt="" />
            </div>
            <div className="pt-40">
              <Button>{t('SaveAsNewPlan')}</Button>
            </div>
            <div className="pt-40 flex">
              <HashTagBadge planObject={currentPlan} onlyNutritionForm edit setPlanObject={setCurrentPlan} />
              {currentPlan?.ketogen === false || currentPlan?.vegetarian === false || currentPlan?.vegan === false ? (
                <>
                  <div
                    className="font-extralight text-12 gap-1 flex cursor-pointer rounded-lg px-2 border-transparent border-2 hover:border-brownSemiDark"
                    onClick={() => setEditFormOfNutritionOverlayClass('block')}
                    onKeyDown={() => setEditFormOfNutritionOverlayClass('block')}
                    aria-hidden="true"
                  >
                    <div className="my-auto">
                      <PlusIcon width={15} height={15} className="text-brownSemiDark" />
                    </div>
                    <div className="my-auto">Weitere hinzufügen</div>
                  </div>
                </>
              ) : (
                <div />
              )}
            </div>
            <div className="pt-20">
              <Button className="text-12 py-2" onClick={() => setShowIncombalitiesOverlayClass('block')}>
                Unverträglichkeiten von diesem Plan anzeigen
              </Button>
            </div>
          </div>
        </div>
        <div className="w-1/2 pt-130" ref={mainLeftColumnRef}>
          <div className="mx-40">
            <div className="pt-60 font-semibold text-20">Tagesübersicht</div>
            <div className="pt-20 flex gap-15 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 pb-10">
              {plan?.dayEntries &&
                plan?.dayEntries.map((item: any, index: number) => (
                  <>
                    <div
                      key={index}
                      onClick={() => changePlanDay(item.id)}
                      onKeyDown={() => changePlanDay(item.id)}
                      aria-hidden="true"
                      className="cursor-pointer"
                    >
                      <div
                        className={
                          currentDayId === index + 1
                            ? 'bg-brownSemiDark rounded-full  w-50 h-50 pt-5 border-transparent border-2 hover:border-brownSemiDark'
                            : 'bg-lightDarkGray rounded-full  w-50 h-50 pt-5 border-transparent border-2 hover:border-brownSemiDark'
                        }
                      >
                        <div className="font-thin text-10 text-center">Tag</div>
                        <div className="text-17 font-light text-center">{index + 1}</div>
                      </div>
                    </div>
                  </>
                ))}
            </div>
            <div className="rounded-3xl bg-lightDarkGray mt-10 pb-40" ref={scrollContainerMacroCircles}>
              <div className="font-extralight pt-20 pb-30 px-20 text-14">
                Dieser Tag würden deinen aktuellen Bedarf folgendermaßen decken
              </div>
              <MakroCircles
                kcal_value={currentDayItem?.kcal_total}
                carbohydrates_value={currentDayItem?.carbohydrates_total}
                protein_value={currentDayItem?.protein_total}
                fat_value={currentDayItem?.fat_total}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:block px-0 md:px-20 pt-60 pb-40">
        {currentDayItem?.kcal_total !== undefined && (
          <>
            <Slider {...settings}>
              <EditMealCard
                mealType="lunch"
                planObject={currentDayItem}
                planState={setCurrentPlan}
                planStateValue={currentPlan}
                dayId={currentDayId}
                planDateArray={planDateArray}
                copyItemState={setCurrentCopyMealItem}
                popupDynamicAddCopyClass={setPopupDynamicAddCopyClass}
                scrollRef={scrollContainerMacroCircles}
                addItemState={setCurrentAddRecipe}
                newRecipeOverlayClass={setNewRecipeOverlayClass}
                currentRecipeStep={setCurrentStep}
                openIngredientSearchPopupClass={setIngredientSearchPopupClass}
                setMealType={setCurrentMealType}
              />
              <EditMealCard
                mealType="dinner"
                planObject={currentDayItem}
                planState={setCurrentPlan}
                planStateValue={currentPlan}
                dayId={currentDayId}
                planDateArray={planDateArray}
                copyItemState={setCurrentCopyMealItem}
                popupDynamicAddCopyClass={setPopupDynamicAddCopyClass}
                scrollRef={scrollContainerMacroCircles}
                addItemState={setCurrentAddRecipe}
                newRecipeOverlayClass={setNewRecipeOverlayClass}
                currentRecipeStep={setCurrentStep}
                openIngredientSearchPopupClass={setIngredientSearchPopupClass}
                setMealType={setCurrentMealType}
              />
              <EditMealCard
                mealType="snacks"
                planObject={currentDayItem}
                planState={setCurrentPlan}
                planStateValue={currentPlan}
                dayId={currentDayId}
                planDateArray={planDateArray}
                copyItemState={setCurrentCopyMealItem}
                popupDynamicAddCopyClass={setPopupDynamicAddCopyClass}
                scrollRef={scrollContainerMacroCircles}
                addItemState={setCurrentAddRecipe}
                newRecipeOverlayClass={setNewRecipeOverlayClass}
                currentRecipeStep={setCurrentStep}
                openIngredientSearchPopupClass={setIngredientSearchPopupClass}
                setMealType={setCurrentMealType}
              />
              <EditMealCard
                mealType="breakfast"
                planObject={currentDayItem}
                planState={setCurrentPlan}
                planStateValue={currentPlan}
                dayId={currentDayId}
                planDateArray={planDateArray}
                copyItemState={setCurrentCopyMealItem}
                popupDynamicAddCopyClass={setPopupDynamicAddCopyClass}
                scrollRef={scrollContainerMacroCircles}
                addItemState={setCurrentAddRecipe}
                newRecipeOverlayClass={setNewRecipeOverlayClass}
                currentRecipeStep={setCurrentStep}
                openIngredientSearchPopupClass={setIngredientSearchPopupClass}
                setMealType={setCurrentMealType}
              />
            </Slider>
          </>
        )}
      </div>
      <div className={styles.pageWrapper} ref={scrollContainerRef}>
        <div className={styles.recipeImageContainer} style={{ backgroundImage: `url(${plan?.imageUrl})` }}>
          <div className="flex justify-between">
            <div className="z-10 w-32 pt-4 pl-4">
              <div className={styles.backBtnBg}>
                <Link
                  to={{
                    pathname: '/plans',
                  }}
                >
                  <ButtonBack text={t('Return')} />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div
          onInput={updatePlanName}
          className="text-white mx-20 mt-30 font-semibold text-xl leading-8 border border-opacity-30 border-white p-5 rounded-xl"
          contentEditable
          suppressContentEditableWarning
        >
          {plan?.name}
        </div>
        <div className="flex flex-wrap gap-10 pt-30 mx-20">
          <HashTagBadge planObject={currentPlan} onlyNutritionForm edit setPlanObject={setCurrentPlan} />
          <div
            className="font-extralight text-12 gap-1 flex cursor-pointer rounded-lg px-2 border-transparent border-2 hover:border-brownSemiDark"
            onClick={() => setEditFormOfNutritionOverlayClass('block')}
            onKeyDown={() => setEditFormOfNutritionOverlayClass('block')}
            aria-hidden="true"
          >
            <div className="my-auto">
              <PlusIcon width={15} height={15} className="text-brownSemiDark" />
            </div>
            <div className="my-auto">Weitere hinzufügen</div>
          </div>
        </div>
        <div className={styles.mobileButtonGroup}>
          <div className="flex-1 px-30">
            <Button className="w-full h-full">{t('SaveAsNewPlan')}</Button>
          </div>
        </div>
        <div className="pt-30 font-semibold px-6 text-20">Tagesübersicht</div>
        <div className="pt-15 px-6 flex gap-15 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600">
          {plan?.dayEntries &&
            plan?.dayEntries.map((item: any, index: number) => (
              <>
                <div
                  key={index}
                  onClick={() => changePlanDay(item.id)}
                  onKeyDown={() => changePlanDay(item.id)}
                  aria-hidden="true"
                  className="cursor-pointer"
                >
                  <div
                    className={
                      currentDayId === index + 1
                        ? 'bg-brownSemiDark rounded-full  w-50 h-50 pt-5 border-transparent border-2 hover:border-brownSemiDark'
                        : 'bg-lightDarkGray rounded-full  w-50 h-50 pt-5 border-transparent border-2 hover:border-brownSemiDark'
                    }
                  >
                    <div className="font-thin text-10 text-center">Tag</div>
                    <div className="text-17 font-light text-center">{index + 1}</div>
                  </div>
                </div>
              </>
            ))}
        </div>
        <div className="rounded-3xl bg-lightDarkGray mt-20 mx-6 pb-40">
          <div className="font-extralight pt-20 pb-30 px-20 text-14">
            Dieser Tag würden deinen aktuellen Bedarf folgendermaßen decken
          </div>
          <MakroCircles
            kcal_value={currentDayItem?.kcal_total}
            carbohydrates_value={currentDayItem?.carbohydrates_total}
            protein_value={currentDayItem?.protein_total}
            fat_value={currentDayItem?.fat_total}
          />
        </div>
        <div className="px-20 pt-40 pb-40">
          <Slider {...settings}>
            <EditMealCard
              mealType="breakfast"
              planObject={currentDayItem}
              planState={setCurrentPlan}
              planStateValue={currentPlan}
              dayId={currentDayId}
              planDateArray={planDateArray}
              scrollRef={scrollContainerMacroCircles}
            />
            <EditMealCard
              mealType="lunch"
              planObject={currentDayItem}
              planState={setCurrentPlan}
              planStateValue={currentPlan}
              dayId={currentDayId}
              planDateArray={planDateArray}
              scrollRef={scrollContainerMacroCircles}
            />
            <EditMealCard
              mealType="dinner"
              planObject={currentDayItem}
              planState={setCurrentPlan}
              planStateValue={currentPlan}
              dayId={currentDayId}
              planDateArray={planDateArray}
              scrollRef={scrollContainerMacroCircles}
            />
            <EditMealCard
              mealType="snacks"
              planObject={currentDayItem}
              planState={setCurrentPlan}
              planStateValue={currentPlan}
              dayId={currentDayId}
              planDateArray={planDateArray}
              scrollRef={scrollContainerMacroCircles}
            />
          </Slider>
        </div>
      </div>
    </>
  );
};

export default PlanEdit;
