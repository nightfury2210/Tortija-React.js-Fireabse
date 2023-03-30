import React, { useContext, useState, useEffect, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HeartIcon, UploadIcon, PencilIcon, PlusIcon, XIcon, CollectionIcon } from '@heroicons/react/outline';
import { MainContext } from 'providers/MainProvider';
import { AuthContext } from 'providers/AuthProvider';
import ButtonBack from 'components/ButtonBack';
import { handleOpenClosePopups } from 'shared/functions/global';
import MakroCircles from 'components/MakroCircles';
import firebase from 'services/firebase';
import { toast } from 'react-toast';
import MealCard from '../components/MealCard';
import HashTagBadge from '../components/HashTagBadge';
import IngridientPopupItem from '../components/IngridientPopupItem';
import styles from './styles.module.scss';

type ParamsType = {
  id: string;
};

const PlanDetail: React.FC = () => {
  const { id } = useParams<ParamsType>();
  const { t } = useTranslation();
  const [currentDayId, setCurrentDayId] = useState(1);
  const plan = useContext(MainContext).planList?.find(item => item.uid === id);
  const favoritesPlansList = useContext(MainContext).favoritesPlansList?.find(item => item.origId === id);
  const authContext = useContext(AuthContext);
  const currentDayItem = plan?.dayEntries.filter((item: any) => item.id === currentDayId)[0] as any;
  const [planFavorite, setPlanFavorite] = useState(false);
  const [currentMealType, setCurrentMealType] = useState('breakfast');
  const [currentMealLabel, setCurrentMealLabel] = useState('Frühstück');
  const [currentIngredientName, setCurrentIngredientName] = useState('');

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
  const [viewIngredientPopupClass, setViewIngredientPopupClass] = useState('hidden');

  const mainLeftColumnRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const location = useLocation<LocationState>();

  const changePlanDay = (dayId: number) => {
    setCurrentDayId(dayId);

    getMealImage('breakfast', dayId);
    getMealImage('lunch', dayId);
    getMealImage('dinner', dayId);
    getMealImage('snacks', dayId);
  };

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

  const saveTestPlanToFirebase = async () => {
    const newColumns = {
      name: 'Ketogen',
      ketogen: true,
      flexitarian: false,
      endDate: {
        seconds: 1644166800,
        nanoseconds: 0,
      },
      vegan: false,
      gluten: true,
      lactose: true,
      startDate: {
        seconds: 1643670000,
        nanoseconds: 0,
      },
      imageUrl: 'https://static.tortija.de/images/example_3.jpg',
      protein_total: 150,
      fat_total: 70,
      origId: '6jsBzEg4mgri2OgH8Ym7',
      dayEntries: [
        {
          carbohydrates_total: 191,
          kcal_total: 2001,
          name: 'Tag 1',
          fat_total: 31,
          dinner: {
            protein_total: 41,
            recipes: [
              {
                name: 'Salat mit getrockneten Tomaten und Ruccola',
                imageUrl:
                  'https://static.tortija.de/recipe_images/Timos-Linsen-Salat-mit-getrockneten-Tomaten-und-Ruccola.png',
                kcal_total: 345,
                carbohydrates_total: 71,
                protein_total: 31,
                fat_total: 17,
                amount: 1,
                piece: 'Portion',
                portion_g: '200',
              },
              {
                name: 'Caesar Salad Dressing',
                imageUrl: 'https://static.tortija.de/recipe_images/Timos-Cesar-Salad-Dressing.png',
                kcal_total: 150,
                carbohydrates_total: 51,
                protein_total: 17,
                fat_total: 8,
                amount: 1,
                piece: 'Portion',
                portion_g: '150',
              },
            ],
            fat_total: 11,
            label: 'Abendessen',
            ingredients: [
              {
                name: 'Apfel',
                kcal_total: 80,
                carbohydrates_total: 32,
                protein_total: 0,
                fat_total: 0,
                imageUrl: 'https://static.tortija.de/ingridient_images_big/Apfel.png',
                amount: 1,
                piece: 'Stk.',
                portion_g: '80',
              },
              {
                name: 'Banane',
                kcal_total: 118,
                carbohydrates_total: 31,
                protein_total: 0,
                fat_total: 0,
                imageUrl: 'https://static.tortija.de/ingridient_images_big/Banane.png',
                amount: 1,
                piece: 'Stk.',
                portion_g: '120',
              },
            ],
            kcal_total: 661,
            carbohydrates_total: 111,
          },
          id: 1,
          snacks: {
            label: 'Snacks',
            carbohydrates_total: 51,
            protein_total: 31,
            ingredients: [
              {
                imageUrl: 'https://static.tortija.de/ingridient_images_big/Nussmischung.png',
                name: 'Nussmischung',
                kcal_total: 345,
                carbohydrates_total: 71,
                protein_total: 31,
                fat_total: 17,
                amount: 1,
                piece: 'Portion',
                portion_g: '20',
              },
              {
                name: 'Apfel',
                kcal_total: 345,
                carbohydrates_total: 71,
                protein_total: 31,
                fat_total: 17,
                imageUrl: 'https://static.tortija.de/ingridient_images_big/Apfel.png',
                amount: 1,
                piece: 'Stk.',
                portion_g: '80',
              },
            ],
            kcal_total: 311,
            recipes: [],
            fat_total: 21,
          },
          breakfast: {
            protein_total: 11,
            fat_total: 21,
            recipes: [
              {
                name: 'Protein Porridge',
                imageUrl: 'https://static.tortija.de/recipe_images/Timos-Protein-Porridge.png',
                kcal_total: 345,
                carbohydrates_total: 71,
                protein_total: 31,
                fat_total: 17,
                amount: 1,
                piece: 'Portion',
                portion_g: '200',
              },
              {
                imageUrl: 'https://static.tortija.de/recipe_images/Timos-Ruehrei.png',
                name: 'Rührei',
                kcal_total: 345,
                carbohydrates_total: 71,
                protein_total: 31,
                fat_total: 17,
                amount: 1,
                piece: 'Portion',
                portion_g: '175',
              },
            ],
            ingredients: [
              {
                name: 'Apfel',
                kcal_total: 345,
                carbohydrates_total: 71,
                protein_total: 31,
                fat_total: 17,
                imageUrl: 'https://static.tortija.de/ingridient_images_big/Apfel.png',
                amount: 1,
                piece: 'Stk.',
                portion_g: '80',
              },
            ],
            carbohydrates_total: 71,
            kcal_total: 551,
            label: 'Frühstück',
          },
          protein_total: 91,
          lunch: {
            recipes: [
              {
                name: 'Beeren-Haselnuss-Shake',
                imageUrl: 'https://static.tortija.de/recipe_images/Timos-Beeren-Haselnuss-Shake.png',
                kcal_total: 345,
                carbohydrates_total: 71,
                protein_total: 31,
                fat_total: 17,
                amount: 1,
                piece: 'Portion',
                portion_g: '120',
              },
              {
                name: 'Avocado Shake',
                imageUrl: 'https://static.tortija.de/recipe_images/Timos-Avocado-Shake.png',
                kcal_total: 345,
                carbohydrates_total: 71,
                protein_total: 31,
                fat_total: 17,
                amount: 1,
                piece: 'Portion',
                portion_g: '180',
              },
            ],
            label: 'Mittagessen',
            fat_total: 21,
            protein_total: 41,
            kcal_total: 701,
            ingredients: [
              {
                name: 'Banane',
                kcal_total: 345,
                carbohydrates_total: 71,
                protein_total: 31,
                fat_total: 17,
                imageUrl: 'https://static.tortija.de/ingridient_images_big/Banane.png',
                amount: 1,
                piece: 'Stk.',
                portion_g: '120',
              },
            ],
            carbohydrates_total: 81,
          },
        },
        {
          id: 2,
          breakfast: {
            protein_total: 32,
            label: 'Frühstück',
            carbohydrates_total: 52,
            recipes: [
              {
                imageUrl: 'https://static.tortija.de/recipe_images/Timos-Frucht-Muesli.png',
                name: 'Frühstücks Müsli',
                kcal_total: 345,
                carbohydrates_total: 71,
                protein_total: 31,
                fat_total: 17,
                amount: 1,
                piece: 'Portion',
                portion_g: '200',
              },
            ],
            ingredients: [],
            fat_total: 22,
            kcal_total: 622,
          },
          fat_total: 52,
          dinner: {
            ingredients: [],
            protein_total: 42,
            fat_total: 22,
            recipes: [
              {
                imageUrl: 'https://static.tortija.de/recipe_images/Timos-Skyrella-Tomaten-Salat.png',
                name: 'Skyrella Tomaten Salat',
                kcal_total: 345,
                carbohydrates_total: 71,
                protein_total: 31,
                fat_total: 17,
                amount: 1,
                piece: 'Portion',
                portion_g: '200',
              },
            ],
            kcal_total: 722,
            label: 'Abendessen',
            carbohydrates_total: 62,
          },
          snacks: {
            fat_total: 12,
            carbohydrates_total: 52,
            kcal_total: 332,
            protein_total: 32,
            label: 'Snacks',
            recipes: [
              {
                imageUrl: 'https://static.tortija.de/recipe_images/Timos-Himbeer-Kokos-Skyr.png',
                name: 'Himbeer-Kokos-Skyr',
                kcal_total: 345,
                carbohydrates_total: 71,
                protein_total: 31,
                fat_total: 17,
                amount: 1,
                piece: 'Portion',
                portion_g: '200',
              },
            ],
            ingredients: [],
          },
          kcal_total: 1602,
          lunch: {
            protein_total: 42,
            fat_total: 22,
            ingredients: [],
            label: 'Mittagessen',
            kcal_total: 702,
            carbohydrates_total: 72,
            recipes: [
              {
                name: 'Linsennudeln mit Tomatensauce',
                imageUrl:
                  'https://firebasestorage.googleapis.com/v0/b/tortija-19187.appspot.com/o/Recipe_Pictures%2Ftortija%2F0.6006880559999748?alt=media&token=caf64000-b7b2-43f3-acaa-87a37c4de3d6',
                kcal_total: 345,
                carbohydrates_total: 71,
                protein_total: 31,
                fat_total: 17,
                amount: 1,
                piece: 'Portion',
                portion_g: '350',
              },
            ],
          },
          carbohydrates_total: 152,
          protein_total: 132,
          name: 'Tag 2',
        },
        {
          snacks: {
            recipes: [],
            fat_total: 13,
            protein_total: 23,
            ingredients: [],
            carbohydrates_total: 43,
            label: 'Snacks',
            kcal_total: 333,
          },
          breakfast: {
            kcal_total: 553,
            protein_total: 33,
            ingredients: [],
            fat_total: 23,
            recipes: [],
            carbohydrates_total: 73,
            label: 'Frühstück',
          },
          lunch: {
            carbohydrates_total: 73,
            ingredients: [],
            label: 'Mittagessen',
            recipes: [],
            fat_total: 23,
            protein_total: 43,
            kcal_total: 703,
          },
          protein_total: 123,
          id: 3,
          carbohydrates_total: 143,
          fat_total: 43,
          dinner: {
            ingredients: [],
            kcal_total: 883,
            label: 'Abendessen',
            fat_total: 33,
            carbohydrates_total: 73,
            protein_total: 43,
            recipes: [],
          },
          kcal_total: 1503,
          name: 'Tag 3',
        },
      ],
      carbohydrates_total: 180,
      vegetarian: false,
      kcal_total: 2450,
    };

    try {
      await firebase
        .firestore()
        .collection('plans')
        .doc()
        .set(newColumns as object);

      toast.success('Der Plan wurde gespeichert!');
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      toast.error('Es ist leider etwas schief gegangen!');
    }
  };

  const openMealPopup = (mealType: any, mealLabel: any) => {
    setViewMealPopupClass('block');
    setCurrentMealType(mealType);
    setCurrentMealLabel(mealLabel);
  };

  const openIngredient = (mealType: string, ingredientName: string) => {
    setViewMealPopupClass('hidden');
    setViewIngredientPopupClass('block');
    setCurrentMealType(mealType);
    setCurrentIngredientName(ingredientName);
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

  function getCurrentMealTotal(makroType: string, mealType: string) {
    const thisItem = plan?.dayEntries?.filter((item: any) => item.id === currentDayId)[0][mealType];

    if (makroType === 'kcal') {
      return thisItem?.kcal_total;
    }
    if (makroType === 'carbohydrates') {
      return thisItem?.carbohydrates_total;
    }
    if (makroType === 'protein') {
      return thisItem?.protein_total;
    }
    if (makroType === 'fat') {
      return thisItem?.fat_total;
    }

    return '0';
  }

  useEffect(() => {
    if (currentDayItem?.kcal_total) {
      getMealImage('breakfast', currentDayId);
      getMealImage('lunch', currentDayId);
      getMealImage('dinner', currentDayId);
      getMealImage('snacks', currentDayId);
      if (location.state !== undefined) {
        setCurrentDayId(location.state.id);
        openMealPopup(location.state.type, location.state.mealLabel);
        setTimeout(() => {
          if (mainLeftColumnRef.current) {
            mainLeftColumnRef.current.scrollIntoView(false);
          }
        }, 1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (favoritesPlansList !== undefined) {
      setPlanFavorite(true);
    }
  }, [favoritesPlansList]);

  useEffect(() => {
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollIntoView();
      }
    }, 1);
  }, []);

  return (
    <>
      <div className={viewMealPopupClass}>
        <div className={styles.backgroundPopupLayer}>
          <div className={styles.editPicturePopup}>
            <div className="flex justify-between pt-20 pl-20">
              <div className="flex">
                <div className="my-auto pr-10">
                  <CollectionIcon width={25} height={25} className="text-brownSemiDark mx-auto" />
                </div>
                <div className="text-xl my-auto font-light">{currentMealLabel}</div>
              </div>
              <div className="my-auto pr-20">
                <XIcon
                  width={25}
                  height={25}
                  className="text-brownSemiDark mx-auto cursor-pointer"
                  onClick={() => handleOpenClosePopups(setViewMealPopupClass, '', 'close')}
                />
              </div>
            </div>
            <div className={styles.editPictureIngridientPopupContent}>
              <div className="pt-20">
                <div className="flex w-full gap-4">
                  <div className="flex-1 text-center">
                    <div className="font-semibold text-base">{getCurrentMealTotal('kcal', currentMealType)}</div>
                    <div className={styles.recipeLabel}>kcal</div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="font-semibold text-base">
                      {getCurrentMealTotal('carbohydrates', currentMealType)}g
                    </div>
                    <div className={styles.recipeLabel}>{t('Carbohydrates')}</div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="font-semibold text-base">{getCurrentMealTotal('protein', currentMealType)}g</div>
                    <div className={styles.recipeLabel}>{t('Protein')}</div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="font-semibold text-base">{getCurrentMealTotal('fat', currentMealType)}g</div>
                    <div className={styles.recipeLabel}>{t('Fat')}</div>
                  </div>
                </div>
              </div>
              <div className="pt-25 pb-30 pl-20">
                {currentDayItem?.[currentMealType].recipes.map((item: any, index: number) => (
                  <IngridientPopupItem
                    ingridientItem={item}
                    type="Rezept"
                    mealType={currentMealType}
                    dayId={currentDayId}
                    planUid={plan?.origId}
                    mealLabel={currentMealLabel}
                    key={`receipt-${index}`}
                  />
                ))}
                {currentDayItem?.[currentMealType].ingredients.map((item: any, index: number) => (
                  <IngridientPopupItem
                    ingridientItem={item}
                    ingredientType={currentMealType}
                    openPopup={openIngredient}
                    type="Lebensmittel"
                    key={`food-${index}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={viewIngredientPopupClass}>
        <div className={styles.backgroundPopupLayer}>
          <div className={styles.editPicturePopup}>
            <div className="flex justify-between pt-20 pl-20">
              <div className="flex">
                <div className="my-auto pr-10">
                  <CollectionIcon width={25} height={25} className="text-brownSemiDark mx-auto" />
                </div>
                <div className="text-xl my-auto font-light">Lebensmittel</div>
              </div>
              <div className="my-auto pr-20">
                <XIcon
                  width={25}
                  height={25}
                  className="text-brownSemiDark mx-auto cursor-pointer"
                  onClick={() => handleOpenClosePopups(setViewIngredientPopupClass, setViewMealPopupClass, 'both')}
                />
              </div>
            </div>
            <div className={styles.editPictureIngridientPopupContent}>
              <div className={styles.editPictureIngridientPopupContent}>
                {currentDayItem?.[currentMealType].ingredients
                  .filter((ingredientItem: any) => ingredientItem.name === currentIngredientName)
                  .map((item: any, index: number) => (
                    <div key={index}>
                      <div className="pt-30">
                        <div className="text-xl pl-25">
                          <div>{item.name}</div>
                          <div className="text-12 font-extralight">
                            {item.amount} {item.piece} ({item.portion_g}g)
                          </div>
                        </div>
                      </div>
                      <div className="pt-30 pb-20 md:pb-40">
                        <div className="text-xl pl-25">Nährwertangabe</div>
                        <div className="pt-10 flex pl-25">
                          <div className={styles.nutritionBorderItemFirst}>
                            <div>
                              <div className="font-semibold text-base">{item.kcal_total}</div>
                              <div className={styles.recipeLabel}>kcal</div>
                            </div>
                            <span className="divider" />
                          </div>
                          <div className={styles.nutritionBorderItem}>
                            <div className="font-semibold text-base">{item.carbohydrates_total}g</div>
                            <div className={styles.recipeLabel}>{t('Carbohydrates')}</div>
                          </div>
                          <div className={styles.nutritionBorderItem}>
                            <div className="font-semibold text-base">{item.protein_total}g</div>
                            <div className={styles.recipeLabel}>{t('Protein')}</div>
                          </div>
                          <div className="text-center px-20">
                            <div className="font-semibold text-base">{item.fat_total}g</div>
                            <div className={styles.recipeLabel}>{t('Fat')}</div>
                          </div>
                        </div>

                        {item.imageUrl.length > 0 && (
                          <>
                            <div className="pt-40 pb-30 pl-25">
                              <img src={item.imageUrl} alt="Ingridient" className="rounded-2xl w-full object-cover" />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
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
        <div className={styles.recipeWrapper}>
          <div className={styles.recipeContent}>
            <div className="pt-4 flex justify-center gap-4">
              <div
                title="Favoriten"
                className="rounded-full border-transparent border-2 hover:border-brownSemiDark p-5 cursor-pointer"
              >
                <HeartIcon
                  width={28}
                  height={28}
                  className="text-brownSemiDark "
                  fill={(planFavorite && '#C97132') || 'none'}
                  onClick={() => savePlanToFavorites()}
                />
              </div>
              <div
                title="Bearbeiten"
                className="rounded-full border-transparent border-2 hover:border-brownSemiDark p-5 cursor-pointer"
              >
                <PencilIcon width={28} height={28} className="text-brownSemiDark" />
              </div>
              <div
                title="Teilen"
                className="rounded-full border-transparent border-2 hover:border-brownSemiDark p-5 cursor-pointer"
              >
                <UploadIcon width={28} height={28} className="text-brownSemiDark" />
              </div>
            </div>

            <div className="mx-20 mt-20 z-10 text-left text-xl font-semibold">
              <div className="text-white leading-8">{plan?.name}</div>
            </div>

            <div className="pt-4 px-6">
              <div className="flex w-full gap-4 sticky py-4 top-0 z-10 bg-blackDark">
                <div className="flex-1 text-center">
                  <div className="font-semibold text-base">
                    {Math.round(plan?.kcal_total!)} <sup>*</sup>
                  </div>
                  <div className={styles.recipeLabel}>kcal</div>
                </div>
                <div className="flex-1 text-center">
                  <div className="font-semibold text-base">
                    {Math.round(plan?.carbohydrates_total!)}g <sup>*</sup>
                  </div>
                  <div className={styles.recipeLabel}>{t('Carbohydrates')}</div>
                </div>
                <div className="flex-1 text-center">
                  <div className="font-semibold text-base">
                    {Math.round(plan?.protein_total!)}g <sup>*</sup>
                  </div>
                  <div className={styles.recipeLabel}>{t('Protein')}</div>
                </div>
                <div className="flex-1 text-center">
                  <div className="font-semibold text-base">
                    {Math.round(plan?.fat_total!)}g <sup>*</sup>
                  </div>
                  <div className={styles.recipeLabel}>{t('Fat')}</div>
                </div>
              </div>
            </div>
            <div className="font-extralight px-6 text-8">* Durchschnittliche Nährwertangaben des Plans</div>
            <div className="flex gap-40 pt-40 justify-center">
              <div className="rounded-3xl bg-lightDarkGray h-150 w-150">
                <div className="pt-20">
                  <PlusIcon width={42} height={42} className="text-brownSemiDark cursor-pointer mx-auto" />
                </div>
                <div className="text-center font-semibold text-18 px-20 pt-15">Plan auswählen</div>
              </div>
              <Link to={`/plans/edit/${id}`}>
                <div className="rounded-3xl bg-lightDarkGray h-150 w-150">
                  <div className="pt-20">
                    <PencilIcon width={42} height={42} className="text-brownSemiDark cursor-pointer mx-auto" />
                  </div>
                  <div className="text-center font-semibold text-18 px-20 pt-30">Bearbeiten</div>
                </div>
              </Link>
            </div>
            <div className="pt-40 font-semibold px-6 text-20">Beschreibung</div>
            <div className="pt-10 font-extralight px-6">
              <div>In diesem Plan findest du viele proteinreiche Rezepte, ideal für den Muskelaufbau.</div>
              <div className="pt-20">
                <HashTagBadge planObject={plan} />
              </div>
            </div>
            <div className="pt-40 font-semibold px-6 text-20">Tagesübersicht</div>
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
            <div className="grid grid-cols-2 gap-30 pt-40 mx-6">
              <MealCard
                kcal_value={currentDayBreakfastKcalTotal}
                carbohydrates_value={currentDayBreakfastCarbohydratesTotal}
                protein_value={currentDayBreakfastProteinTotal}
                fat_value={currentDayBreakfastFatTotal}
                label="Frühstück"
                mealLabel={currentDayBreakfastMealLabel}
                mealCounter={currentDayBreakfastMealCounter}
                imageUrl={currentDayBreakfastImage}
                type={currentDayBreakfastType}
                mealType="breakfast"
                onClick={openMealPopup}
              />
              <MealCard
                kcal_value={currentDayLunchKcalTotal}
                carbohydrates_value={currentDayLunchCarbohydratesTotal}
                protein_value={currentDayLunchProteinTotal}
                fat_value={currentDayLunchFatTotal}
                label="Mittagessen"
                mealLabel={currentDayLunchMealLabel}
                mealCounter={currentDayLunchMealCounter}
                imageUrl={currentDayLunchImage}
                type={currentDayLunchType}
                mealType="lunch"
                onClick={openMealPopup}
              />
              <MealCard
                kcal_value={currentDayDinnerKcalTotal}
                carbohydrates_value={currentDayDinnerCarbohydratesTotal}
                protein_value={currentDayDinnerProteinTotal}
                fat_value={currentDayDinnerFatTotal}
                label="Abendessen"
                mealLabel={currentDayDinnerMealLabel}
                mealCounter={currentDayDinnerMealCounter}
                imageUrl={currentDayDinnerImage}
                type={currentDayDinnerType}
                mealType="dinner"
                onClick={openMealPopup}
              />
              <MealCard
                kcal_value={currentDaySnacksKcalTotal}
                carbohydrates_value={currentDaySnacksCarbohydratesTotal}
                protein_value={currentDaySnacksProteinTotal}
                fat_value={currentDaySnacksFatTotal}
                label="Snacks"
                mealLabel={currentDaySnacksMealLabel}
                mealCounter={currentDaySnacksMealCounter}
                imageUrl={currentDaySnacksImage}
                type={currentDaySnacksType}
                mealType="snacks"
                onClick={openMealPopup}
              />
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
            <div className="pt-40 font-semibold text-30">{plan?.name}</div>
            <div className="pt-20">
              <img className="object-cover rounded-3xl h-300 w-full" src={plan?.imageUrl} alt="" />
            </div>
            <div className="pt-20 flex justify-center gap-4">
              <div
                title="Favoriten"
                className="rounded-full border-transparent border-2 hover:border-brownSemiDark p-5 cursor-pointer"
              >
                <HeartIcon
                  width={28}
                  height={28}
                  className="text-brownSemiDark "
                  fill={(planFavorite && '#C97132') || 'none'}
                  onClick={() => savePlanToFavorites()}
                />
              </div>
              <div
                title="Bearbeiten"
                className="rounded-full border-transparent border-2 hover:border-brownSemiDark p-5 cursor-pointer"
              >
                <PencilIcon width={28} height={28} className="text-brownSemiDark" />
              </div>
              <div
                title="Teilen"
                className="rounded-full border-transparent border-2 hover:border-brownSemiDark p-5 cursor-pointer"
              >
                <UploadIcon width={28} height={28} className="text-brownSemiDark" />
              </div>
            </div>
            <div className="pt-40 font-semibold text-20">Durchschnittliche Nährwertangaben des Plans</div>
            <div className="flex w-full gap-4 pt-10">
              <div className="flex-1 text-center">
                <div className="font-semibold text-base">{Math.round(plan?.kcal_total!)}</div>
                <div className={styles.recipeLabel}>kcal</div>
              </div>
              <div className="flex-1 text-center">
                <div className="font-semibold text-base">{Math.round(plan?.carbohydrates_total!)}g</div>
                <div className={styles.recipeLabel}>{t('Carbohydrates')}</div>
              </div>
              <div className="flex-1 text-center">
                <div className="font-semibold text-base">{Math.round(plan?.protein_total!)}g</div>
                <div className={styles.recipeLabel}>{t('Protein')}</div>
              </div>
              <div className="flex-1 text-center">
                <div className="font-semibold text-base">{Math.round(plan?.fat_total!)}g</div>
                <div className={styles.recipeLabel}>{t('Fat')}</div>
              </div>
            </div>
            <div className="pt-40 font-semibold text-20">Beschreibung</div>
            <div className="pt-10 font-extralight px-6">
              <div>In diesem Plan findest du viele proteinreiche Rezepte, ideal für den Muskelaufbau.</div>
              <div className="pt-20">
                <HashTagBadge planObject={plan} />
              </div>
            </div>
            {/* <div>
              <Button className="w-full" onClick={() => saveTestPlanToFirebase()}>
                {t('SaveAsNewRecipe')}
              </Button>
            </div> */}
          </div>
        </div>
        <div className="w-1/2 pt-130" ref={mainLeftColumnRef}>
          <div className="flex gap-40 pt-60 justify-center">
            <div className="rounded-3xl bg-lightDarkGray h-150 w-150 cursor-pointer border-transparent border-2 hover:border-brownSemiDark">
              <div className="pt-20">
                <PlusIcon width={42} height={42} className="text-brownSemiDark mx-auto" />
              </div>
              <div className="text-center font-semibold text-18 px-20 pt-15">Plan auswählen</div>
            </div>
            <Link to={`/plans/edit/${id}`}>
              <div className="rounded-3xl bg-lightDarkGray h-150 w-150 cursor-pointer border-transparent border-2 hover:border-brownSemiDark">
                <div className="pt-20">
                  <PencilIcon width={42} height={42} className="text-brownSemiDark mx-auto" />
                </div>
                <div className="text-center font-semibold text-18 px-20 pt-30">Bearbeiten</div>
              </div>
            </Link>
          </div>
          <div className="mx-40">
            <div className="pt-60 flex gap-15 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 pb-30">
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
            <div className="rounded-3xl bg-lightDarkGray mt-20 pb-40">
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
            <div className="grid grid-cols-2 gap-30 pt-40">
              <MealCard
                kcal_value={currentDayBreakfastKcalTotal}
                carbohydrates_value={currentDayBreakfastCarbohydratesTotal}
                protein_value={currentDayBreakfastProteinTotal}
                fat_value={currentDayBreakfastFatTotal}
                label="Frühstück"
                mealLabel={currentDayBreakfastMealLabel}
                mealCounter={currentDayBreakfastMealCounter}
                imageUrl={currentDayBreakfastImage}
                type={currentDayBreakfastType}
                mealType="breakfast"
                onClick={openMealPopup}
              />
              <MealCard
                kcal_value={currentDayLunchKcalTotal}
                carbohydrates_value={currentDayLunchCarbohydratesTotal}
                protein_value={currentDayLunchProteinTotal}
                fat_value={currentDayLunchFatTotal}
                label="Mittagessen"
                mealLabel={currentDayLunchMealLabel}
                mealCounter={currentDayLunchMealCounter}
                imageUrl={currentDayLunchImage}
                type={currentDayLunchType}
                mealType="lunch"
                onClick={openMealPopup}
              />
              <MealCard
                kcal_value={currentDayDinnerKcalTotal}
                carbohydrates_value={currentDayDinnerCarbohydratesTotal}
                protein_value={currentDayDinnerProteinTotal}
                fat_value={currentDayDinnerFatTotal}
                label="Abendessen"
                mealLabel={currentDayDinnerMealLabel}
                mealCounter={currentDayDinnerMealCounter}
                imageUrl={currentDayDinnerImage}
                type={currentDayDinnerType}
                mealType="dinner"
                onClick={openMealPopup}
              />
              <MealCard
                kcal_value={currentDaySnacksKcalTotal}
                carbohydrates_value={currentDaySnacksCarbohydratesTotal}
                protein_value={currentDaySnacksProteinTotal}
                fat_value={currentDaySnacksFatTotal}
                label="Snacks"
                mealLabel={currentDaySnacksMealLabel}
                mealCounter={currentDaySnacksMealCounter}
                imageUrl={currentDaySnacksImage}
                type={currentDaySnacksType}
                mealType="snacks"
                onClick={openMealPopup}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlanDetail;
