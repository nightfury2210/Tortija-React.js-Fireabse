import React, { useContext, useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, useLocation, Link, useHistory } from 'react-router-dom';
import Button from 'components/Button';
import _ from 'lodash';
import { getIngridientMacros, generateRandomUid } from 'shared/functions/global';
import { useTranslation } from 'react-i18next';
import firebase from 'services/firebase';
import { toast } from 'react-toast';
import HashTagBadge from 'pages/Plans/components/HashTagBadge';
import Select, { OptionTypeBase } from 'react-select';
import {
  PlusIcon,
  HeartIcon,
  UploadIcon,
  SaveIcon,
  ChevronDownIcon,
  PencilIcon,
  XIcon,
  SearchIcon,
  TrashIcon,
  RefreshIcon,
} from '@heroicons/react/outline';
import { MainContext } from 'providers/MainProvider';
import { AuthContext } from 'providers/AuthProvider';
import SearchBox from 'components/SearchBox';
import ButtonBack from 'components/ButtonBack';
import CustomSelect from 'components/CustomSelect';

import CustomUserInput from 'components/CustomUserInput';
import SwitchButton from 'components/SwitchButton';
import { difficultyValues, recipeCategoryValues, customSelectStyles } from 'shared/constants/global';
import { intolerancesOption, eatingHabitsOption, formOfNutrition } from 'shared/constants/profile-wizard';
import ReactCrop, { Crop } from 'react-image-crop';
import Icon from 'components/Icon';
import RecipeStepSwitch from '../components/RecipeStepSwitch';
import CookingMode from '../components/CookingMode';
import 'react-image-crop/dist/ReactCrop.css';
import styles from './styles.module.scss';
import IngridientItem from '../components/IngridientItem';
import DescriptionItem from '../components/DescriptionItem';

type ParamsType = {
  id: string;
};

// Add new description step
function addDescriptionStep(
  state: any,
  updateFunction: any,
  setRecipeChanged: any,
  viewPort: string,
  recipeDescriptionArray: any,
  setRecipeDescriptionArray: any,
  setDescriptionStepAdded: any
) {
  let thisDescriptionArray;
  if (recipeDescriptionArray.length > 0) {
    thisDescriptionArray = recipeDescriptionArray;
  } else {
    thisDescriptionArray = state.description;
  }

  const newColumns = {
    ...state,
    description: [
      ...thisDescriptionArray,
      {
        id: thisDescriptionArray.length,
        text: '',
      },
    ],
  };

  if (viewPort === 'desktop') {
    document.getElementById(`descriptionJumpContainerDesktop`)!.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    document.getElementById(`descriptionJumpContainer`)!.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  setRecipeDescriptionArray(...thisDescriptionArray, {
    id: thisDescriptionArray.length,
    text: '',
  });

  updateFunction(newColumns);
  setRecipeChanged(true);
  setDescriptionStepAdded(true);
}

interface CompletedCrop {
  x: number;
  y: number;
  width: number;
  height: number;
  unit: string;
  aspect: number;
}

type TonSelectFile = (evt: React.ChangeEvent<HTMLInputElement>) => void;

const RecipeDetail: React.FC = () => {
  const { id } = useParams<ParamsType>();
  const location = useLocation<LocationState>();
  const { recipesList } = useContext(MainContext);
  const recipe = recipesList?.find(item => item.uid === id);
  const favoritesRecipesList = useContext(MainContext).favoritesRecipesList?.find(item => item.origId === id);
  const authContext = useContext(AuthContext);
  const { userData } = useContext(AuthContext);
  const [currentAddRecipe, setCurrentAddRecipe] = useState(recipe);
  const [currentOriginalRecipe, setCurrentOriginalRecipe] = useState(recipe);
  const [currentRecipeName, setCurrentRecipeName] = useState(currentAddRecipe?.name);

  const [recipeDescriptionArray, setRecipeDescriptionArray] = useState([]);
  const [currentEditIngridientAmount, setCurrentEditIngridientAmount] = useState('1');
  const [currentEditInitialIngridientAmount, setCurrentEditInitialIngridientAmount] = useState('1');
  const [currentEditIngridientID, setCurrentEditIngridientID] = useState('1');
  const [currentEditIngridientName, setCurrentEditIngridientName] = useState('');
  const [currentEditIngridientType, setCurrentEditIngridientType] = useState('');
  const [currentEditIngridientPiece, setCurrentEditIngridientPiece] = useState('g');

  const [currentEditIngridientPreselectG, setCurrentEditIngridientPreselectG] = useState('');
  const [currentEditIngridientPreselectType, setCurrentEditIngridientPreselectType] = useState('');
  const [currentEditIngridientKcal100g, setCurrentEditIngridientKcal100g] = useState('');
  const [currentEditIngridientCarbohydrates100g, setCurrentEditIngridientCarbohydrates100g] = useState('');
  const [currentEditIngridientProtein100g, setCurrentEditIngridientProtein100g] = useState('');
  const [currentEditIngridientFat100g, setCurrentEditIngridientFat100g] = useState('');
  const [currentEditIngridientCategory, setCurrentEditIngridientCategory] = useState('');
  const [currentEditIngridientAPIFoodId, setCurrentEditIngridientAPIFoodId] = useState('');

  const [currentEditIngridientImageUrl, setCurrentEditIngridientImageUrl] = useState('');
  const [currentEditIngridientKcalTotal, setCurrentEditIngridientKcalTotal] = useState(0);
  const [currentEditIngridientCarbohydratesTotal, setCurrentEditIngridientCarbohydratesTotal] = useState(0);
  const [currentEditIngridientProteinTotal, setCurrentEditIngridientProteinTotal] = useState(0);
  const [currentEditIngridientFatTotal, setCurrentEditIngridientFatTotal] = useState(0);
  const [currentEditIngridientKcalValue, setCurrentEditIngridientKcalValue] = useState(0);
  const [currentEditIngridientMetricServingAmountValue, setCurrentEditIngridientMetricServingAmountValue] =
    useState('');
  const [currentEditIngridientCarbohydratesValue, setCurrentEditIngridientCarbohydratesValue] = useState(0);
  const [currentEditIngridientProteinValue, setCcurrentEditIngridientProteinValue] = useState(0);
  const [currentEditIngridientFatValue, setCurrentEditIngridientFatValue] = useState(0);
  const [currentEditIngridientPortionValues, setCurrentEditIngridientPortionValues] = useState<OptionTypeBase[]>([]);
  const [currentEditIngridientDefaultPiece, setCurrentEditIngridientDefaultPiece] = useState('g');

  const [currentScrollPosition, setCurrentScrollPosition] = useState<Number | undefined>(0);

  const imgRef = useRef<HTMLImageElement>();
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const searchIngridientRef = useRef<HTMLInputElement>(null);
  const editIngridientRef = useRef<HTMLInputElement>(null);
  const newDescriptionStepRef = useRef<HTMLDivElement>(null);
  const editRecipePortionSizeRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const history = useHistory();

  const [upImg, setUpImg] = useState<FileReader['result']>();
  const [crop, setCrop] = useState<Crop>({
    unit: 'px',
    width: 425,
    height: 180,
    x: 25,
    y: 25,
  });
  const [completedCrop, setCompletedCrop] = useState<CompletedCrop>();

  const onSelectFile: TonSelectFile = evt => {
    if (evt.target.files && evt.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setUpImg(reader.result));
      reader.readAsDataURL(evt.target.files[0]);
    }
  };

  const onLoad = useCallback(img => {
    imgRef.current = img;
  }, []);

  const [recipeChanged, setRecipeChanged] = useState(false);
  const [descriptionStepAdded, setDescriptionStepAdded] = useState(false);
  const [recipeFavorite, setRecipeFavorite] = useState(false);
  const [recipePiece, setRecipePiece] = useState('Portion');
  const [piecePopupClass, setPiecePopupClass] = useState('hidden');
  const [deleteRecipeOverlayClass, setDeleteRecipeOverlayClass] = useState('hidden');
  const [incompatibilitiesClass, setIncompatibilitiesClass] = useState('hidden');
  const [eatingHabitsClass, setEatingHabitsClass] = useState('hidden');
  const [popupOverlayClass, setPopupOverlayClass] = useState('hidden');
  const [cookingModeOverlayClass, setCookingModeOverlayClass] = useState('hidden');
  const [currentCookingStep, setCurrentCookingStep] = useState(1);
  const [editPictureOverlayClass, setEditPictureOverlayClass] = useState('hidden');
  const [editPopupOverlayClass, setEditPopupOverlayClass] = useState('hidden');
  const [editFormOfNutritionOverlayClass, setEditFormOfNutritionOverlayClass] = useState('hidden');
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');
  const [directAddedIngridients, setDirectAddedIngridients] = useState<any[]>([]);
  const [currentIngridientSearchApi, setCurrentIngridientSearchApi] = useState({ foods: { food: [{}] } as any });
  const [accessToken, setAccessToken] = useState('');
  const [currentIngridientSearchAutocomplete, setCurrentIngridientSearchAutocomplete] = useState({
    suggestions: { suggestion: [''] },
  });
  const [currentRecipeAmount, setCurrentRecipeAmount] = useState('1');
  const [useAlghorithmus, setUseAlghorithmus] = useState(true);
  const [currentIngridientSearch, setCurrentIngridientSearch] = useState(false);
  const [incompatibilitiesChevronClass, setIncompatibilitiesChevronClass] = useState('text-brownSemiDark');
  const [eatingHabitsChevronClass, setEatingHabitsChevronClass] = useState('text-brownSemiDark');
  const { ingredientList } = useContext(MainContext);

  const ingredientFilteredList = useMemo(
    () => ingredientList?.filter(element => element.name.toLowerCase().includes(currentSearchQuery.toLowerCase())),
    [ingredientList, currentSearchQuery]
  );
  const { t } = useTranslation();

  const recipePortionValues: OptionTypeBase[] = [
    { value: 'portion', label: `Portion (${currentAddRecipe?.portion_g}g)` },
    { value: 'g', label: 'Gramm' },
  ];

  function clickRecipePortionSize() {
    if (editRecipePortionSizeRef.current) {
      editRecipePortionSizeRef.current.select();
    }
  }

  function clickIngridientChange() {
    if (editIngridientRef.current) {
      editIngridientRef.current.select();
    }
  }

  // Generate FatSecret API Token on component load
  useEffect(() => {
    fetch('https://static.tortija.de/interfaces/apis/getIngridientApiToken.php')
      .then(res => res.json())
      .then(data => {
        setAccessToken(data.access_token);
      });
    if (favoritesRecipesList !== undefined) {
      setRecipeFavorite(true);
    }
    if (popupOverlayClass === 'block' && searchIngridientRef.current) {
      searchIngridientRef.current.focus();
    }
    if (editPopupOverlayClass === 'block' && editIngridientRef.current) {
      /* const sel = window.getSelection();
      const textLength = editIngridientRef.current.textContent!.length;
      sel?.setPosition(editIngridientRef.current.childNodes[0], textLength); */

      editIngridientRef.current.select();
    }
    window.history.replaceState({}, document.title);
  }, [favoritesRecipesList, popupOverlayClass, editPopupOverlayClass]);

  // Image Crop
  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image: any = imgRef.current;
    const canvas: any = previewCanvasRef.current;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const pixelRatio = window.devicePixelRatio;

    const width = 425;
    const height = 180;
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    const cropC = crop as CompletedCrop;

    ctx.drawImage(
      image,
      cropC.x * scaleX,
      cropC.y * scaleY,
      cropC.width * scaleX,
      cropC.height * scaleY,
      0,
      0,
      cropC.width,
      cropC.height
    );
  }, [crop, completedCrop]);

  useEffect(() => {
    const thisCurrentRecipe = recipesList?.find(item => item.uid === id);

    setCurrentAddRecipe(thisCurrentRecipe);
    setCurrentOriginalRecipe(thisCurrentRecipe);
    if (thisCurrentRecipe?.alghorithmus !== undefined) {
      setUseAlghorithmus(thisCurrentRecipe.alghorithmus);
    }
  }, [id, recipesList]);

  useEffect(() => {
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollIntoView();
      }
    }, 1);
  }, []);

  useEffect(() => {
    setCurrentScrollPosition(location.state?.scrollPos);
  }, [location.state?.scrollPos]);

  // Update general recipe state
  function updateRecipeState(stateObject: any): void {
    console.log(stateObject);
    setCurrentAddRecipe(stateObject);
  }

  // Change incompatibility items
  const setIncompatibilities = (status: boolean, item: string): void => {
    const newColumns = {
      ...currentAddRecipe,
      [item.toLowerCase()]: status,
    };

    setRecipeChanged(true);
    updateRecipeState(newColumns);
  };

  // Change incompatibility items
  const changeAlghorithmus = (status: boolean, item: string): void => {
    const newColumns = {
      ...currentAddRecipe,
      [item.toLowerCase()]: status,
    };

    setUseAlghorithmus(status);
    setRecipeChanged(true);
    updateRecipeState(newColumns);
  };

  // Change eating habits items
  const setEatingHabits = (status: boolean, item: string): void => {
    const newColumns = {
      ...currentAddRecipe,
      [item.toLowerCase()]: status,
    };

    setRecipeChanged(true);
    updateRecipeState(newColumns);
  };

  // Change form of nutrition items
  const setFormOfNutritions = (status: boolean, item: string): void => {
    const newColumns = {
      ...currentAddRecipe,
      [item.toLowerCase()]: status,
    };

    setRecipeChanged(true);
    updateRecipeState(newColumns);
  };

  type TsavePicture = (canvas: HTMLCanvasElement) => void;

  const savePicture: TsavePicture = canvas => {
    saveNewRecipePicture();
  };

  function jumpToNextStep() {
    if (currentCookingStep === currentAddRecipe?.description.length) {
      setCookingModeOverlayClass('hidden');
    } else {
      setCurrentCookingStep(currentCookingStep + 1);
    }
  }

  function returnToPreviousStep() {
    setCurrentCookingStep(currentCookingStep - 1);
  }

  // Toggle incompatibility area
  const toggleIncompatibilities = (): void => {
    if (incompatibilitiesClass === 'hidden') {
      setIncompatibilitiesClass('block');
      setIncompatibilitiesChevronClass('text-brownSemiDark transition duration-300 transform rotate-180');
    } else {
      setIncompatibilitiesClass('hidden');
      setIncompatibilitiesChevronClass('text-brownSemiDark transition duration-300 transform rotate-360');
    }
  };

  // Toggle eating habits area
  const toggleEatingHabits = (): void => {
    if (eatingHabitsClass === 'hidden') {
      setEatingHabitsClass('block');
      setEatingHabitsChevronClass('text-brownSemiDark transition duration-300 transform rotate-180');
    } else {
      setEatingHabitsClass('hidden');
      setEatingHabitsChevronClass('text-brownSemiDark transition duration-300 transform rotate-360');
    }
  };

  // Change general recipe piece
  const changeRecipePiece = (value: OptionTypeBase) => {
    let thisPortionValue = '';
    if (currentAddRecipe!.recipe_portion) {
      thisPortionValue = currentAddRecipe!.recipe_portion.toString();
    } else {
      thisPortionValue = '1';
    }

    setRecipePiece(value.value);
    changeRecipeAmount(thisPortionValue, recipe, value.value);
  };

  // Push Function
  const saveNewRecipeToFirebase = async () => {
    let thisDescriptionArr;
    if (recipeDescriptionArray.length > 0) {
      thisDescriptionArr = [...recipeDescriptionArray];
    } else {
      thisDescriptionArr = currentAddRecipe?.description;
    }

    const thisRecipeUid = generateRandomUid();

    const newColumns = {
      ...currentAddRecipe,
      name: currentRecipeName,
      description: thisDescriptionArr,
      userRecipe: true,
      uid: thisRecipeUid,
    };

    const newColumnsAdmin = {
      ...currentAddRecipe,
      name: currentRecipeName,
      description: thisDescriptionArr,
      uid: thisRecipeUid,
    };

    const newColumnsFavorite = {
      uid: thisRecipeUid,
      name: currentRecipeName,
      origId: thisRecipeUid,
    };

    if (userData?.role === 1) {
      try {
        await firebase
          .firestore()
          .collection('recipes')
          .doc(thisRecipeUid)
          .set(newColumnsAdmin as object);
        toast.success(t('Dein Rezept wurde erfolgreich erstellt!'));
        history.push(`/nutrition/recipes/${thisRecipeUid}`);
      } catch (error: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        toast.error('Es ist leider etwas schief gegangen!');
      }
    } else if (currentRecipeName === currentOriginalRecipe?.name) {
      toast.error('Bitte ändere noch den Namen des Rezepts');
    } else {
      try {
        await firebase
          .firestore()
          .collection('users')
          .doc(authContext.user?.uid)
          .collection('recipes')
          .doc(thisRecipeUid)
          .set(newColumns as object);
        try {
          await firebase
            .firestore()
            .collection('users')
            .doc(authContext.user?.uid)
            .collection('favorites_recipes')
            .doc()
            .set(newColumnsFavorite as object);
        } catch (error: any) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          toast.error('Es ist leider etwas schief gegangen!');
        }
        setRecipeFavorite(true);
        toast.success(t('Dein Rezept wurde erfolgreich erstellt!'));
        history.push(`/nutrition/recipes/${thisRecipeUid}`);
      } catch (error: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        toast.error('Es ist leider etwas schief gegangen!');
      }
    }
  };

  // Push Function
  const saveExistingRecipeToFirebase = async () => {
    let thisDescriptionArr;
    if (recipeDescriptionArray.length > 0) {
      thisDescriptionArr = [...recipeDescriptionArray];
    } else {
      thisDescriptionArr = currentAddRecipe?.description;
    }

    let thisRecipeName = currentRecipeName;
    if (thisRecipeName === undefined) {
      thisRecipeName = currentAddRecipe?.name;
    }

    const newColumnsAdmin = {
      ...currentAddRecipe,
      name: thisRecipeName,
      description: thisDescriptionArr,
      uid: id,
    };

    const newColumns = {
      ...currentAddRecipe,
      name: thisRecipeName,
      userRecipe: true,
      description: thisDescriptionArr,
      uid: id,
    };

    if (userData?.role === 1) {
      try {
        await firebase
          .firestore()
          .collection('recipes')
          .doc(id)
          .update(newColumnsAdmin as object);
        toast.success(t('Dein Rezept wurde erfolgreich gespeichert!'));
        setRecipeChanged(false);
      } catch (error: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        toast.error('Es ist leider etwas schief gegangen!');
      }
    } else {
      try {
        await firebase
          .firestore()
          .collection('users')
          .doc(authContext.user?.uid)
          .collection('recipes')
          .doc(id)
          .update(newColumns as object);
        toast.success(t('Dein Rezept wurde erfolgreich gespeichert!'));
        setRecipeChanged(false);
      } catch (error: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        toast.error('Es ist leider etwas schief gegangen!');
      }
    }
  };

  // Delete Function
  const deleteRecipeFromFirebase = async () => {
    if (userData?.role === 1) {
      try {
        await firebase.firestore().collection('recipes').doc(id).delete();
        toast.success(t('Dein Rezept wurde erfolgreich gelöscht!'));
        history.push('/nutrition');
      } catch (error: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        toast.error('Es ist leider etwas schief gegangen!');
      }
    } else {
      try {
        await firebase
          .firestore()
          .collection('users')
          .doc(authContext.user?.uid)
          .collection('recipes')
          .doc(id)
          .delete();
        toast.success(t('Dein Rezept wurde erfolgreich gelöscht!'));
        history.push('/nutrition');
      } catch (error: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        toast.error('Es ist leider etwas schief gegangen!');
      }
    }
  };

  const saveRecipeToFavorites = async () => {
    const newColumns = {
      uid: currentAddRecipe?.uid,
      name: currentAddRecipe?.name,
      origId: currentAddRecipe?.uid,
    };

    if (recipeFavorite) {
      try {
        await firebase
          .firestore()
          .collection('users')
          .doc(authContext.user?.uid)
          .collection('favorites_recipes')
          .doc(favoritesRecipesList?.uid)
          .delete();

        setRecipeFavorite(false);
        toast.success('Das Rezept wurde erfolgreich von deinen Favoriten entfernt!');
      } catch (error: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        toast.error('Es ist leider etwas schief gegangen!');
      }
    } else {
      try {
        await firebase
          .firestore()
          .collection('users')
          .doc(authContext.user?.uid)
          .collection('favorites_recipes')
          .doc()
          .set(newColumns as object);

        setRecipeFavorite(true);
        toast.success('Das Rezept wurde erfolgreich zu deinen Favoriten gespeichert!');
      } catch (error: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        toast.error('Es ist leider etwas schief gegangen!');
      }
    }
  };

  // Push Function
  const saveNewRecipePicture = async () => {
    const thisImage = dataURItoBlob(previewCanvasRef.current?.toDataURL());
    let thisUserUid = authContext.user!.uid;
    if (userData?.role === 1) {
      thisUserUid = 'tortija';
    }
    const res = await firebase.storage().ref(`Recipe_Pictures/${thisUserUid}/${Math.random()}`).put(thisImage);
    const thisImageUrl = await res.ref.getDownloadURL();

    try {
      const newColumns = {
        ...currentAddRecipe,
        imageUrl: thisImageUrl,
      };

      setRecipeChanged(true);
      updateRecipeState(newColumns);
      handleOpenClosePopups(setEditPictureOverlayClass, '', 'close');
      toast.success('Dein Foto wurde erfolgreich gespeichert!');
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      toast.error('Es ist leider etwas schief gegangen!');
    }
  };

  // Change general recipe amount
  const changeRecipeAmount = (value: string, originalRecipe: any, thisRecipePiece: string) => {
    let thisKcalGesamt = 0;
    let thisKHGesamt = 0;
    let thisEWGesamt = 0;
    let thisFTGesamt = 0;
    let thisValue = value;

    // Replace Comma with Point for calculating results
    thisValue = thisValue.replace(',', '.');

    if (Number.isNaN(parseFloat(thisValue))) {
      thisValue = '';
    }

    if (thisValue === '') {
      thisValue = '1';
    }

    /* if (thisRecipePiece !== 'g' && thisRecipePiece !== 'ml') {
      thisKcalGesamt = originalRecipe.kcal_total * parseFloat(thisValue);
      thisKHGesamt = parseFloat(currentAddRecipe!.carbohydrates_total) * parseFloat(thisValue);
      thisEWGesamt = parseFloat(currentAddRecipe!.protein_total) * parseFloat(thisValue);
      thisFTGesamt = parseFloat(currentAddRecipe!.fat_total) * parseFloat(thisValue);
    } else {
      thisKcalGesamt =
        (parseFloat(currentAddRecipe!.kcal_total) * parseFloat(thisValue)) / parseFloat(currentAddRecipe!.portion_g);
      thisKHGesamt =
        (parseFloat(currentAddRecipe!.carbohydrates_total) * parseFloat(thisValue)) /
        parseFloat(currentAddRecipe!.portion_g);
      thisEWGesamt =
        (parseFloat(currentAddRecipe!.protein_total) * parseFloat(thisValue)) / parseFloat(currentAddRecipe!.portion_g);
      thisFTGesamt =
        (parseFloat(currentAddRecipe!.fat_total) * parseFloat(thisValue)) / parseFloat(currentAddRecipe!.portion_g);
    } */

    const newColumns = {
      ...currentAddRecipe,
      recipe_portion: thisValue,
      recipe_piece: thisRecipePiece.toLowerCase(),
      kcal_total: Math.round(thisKcalGesamt),
      carbohydrates_total: Math.round(thisKHGesamt),
      protein_total: Math.round(thisEWGesamt),
      fat_total: Math.round(thisFTGesamt),
      ingredients: currentAddRecipe?.ingredients.map(ingridients => {
        let thisAmount = 0;
        if (thisRecipePiece !== 'g' && thisRecipePiece !== 'ml') {
          thisAmount = ingridients.initial_amount * parseFloat(thisValue);
        } else {
          thisAmount = (ingridients.initial_amount * parseFloat(thisValue)) / parseFloat(originalRecipe.portion_g);
        }

        // Calculate ingredient macros
        const getIngridient = ingredientList?.find(item => item.name === ingridients.name);
        thisKcalGesamt += getIngridientMacros(ingridients, getIngridient, 'kcal-initial') * parseFloat(thisValue);
        thisKHGesamt +=
          getIngridientMacros(ingridients, getIngridient, 'carbohydrates-initial') * parseFloat(thisValue);
        thisEWGesamt += getIngridientMacros(ingridients, getIngridient, 'protein-initial') * parseFloat(thisValue);
        thisFTGesamt += getIngridientMacros(ingridients, getIngridient, 'fat-initial') * parseFloat(thisValue);

        if (Math.round(thisAmount) === 0 && !ingridients.initial_amount.toString().includes('.')) {
          thisAmount = 1;
        }

        if (thisRecipePiece === 'g' && !ingridients.initial_amount.toString().includes('.')) {
          thisAmount = Math.round(thisAmount);
        }

        return {
          ...ingridients,
          amount: thisAmount,
        };
      }),
    };

    const newColumnsPartTwo = {
      ...newColumns,
      kcal_total: Math.round(thisKcalGesamt),
      carbohydrates_total: Math.round(thisKHGesamt),
      protein_total: Math.round(thisEWGesamt),
      fat_total: Math.round(thisFTGesamt),
    };

    setCurrentRecipeAmount(value);
    updateRecipeState(newColumnsPartTwo);
    setRecipeChanged(true);
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

    getIngridientRecipeData = currentAddRecipe?.ingredients.filter((item: any) => item.id === currentEditIngridientID);
    getIngridient = ingredientList?.filter((item: any) => item.name === currentEditIngridientName);

    if (thisCurrentPiece !== 'g' && thisCurrentPiece !== 'ml') {
      ingridientKcalNew = Math.round(
        ((parseFloat(currentEditIngridientAmount) * parseFloat(getIngridientRecipeData[0].preselect_g)) / 100) *
          parseFloat(getIngridient[0].kcal_100g)
      );

      ingridientKhNew = Math.round(
        ((parseFloat(currentEditIngridientAmount) * parseFloat(getIngridientRecipeData[0].preselect_g)) / 100) *
          parseFloat(getIngridient[0].carbohydrates_100g)
      );

      ingridientEwNew = Math.round(
        ((parseFloat(currentEditIngridientAmount) * parseFloat(getIngridientRecipeData[0].preselect_g)) / 100) *
          parseFloat(getIngridient[0].protein_100g)
      );

      ingridientFtNew = Math.round(
        ((parseFloat(currentEditIngridientAmount) * parseFloat(getIngridientRecipeData[0].preselect_g)) / 100) *
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

  const changeIngridientExecute = () => {
    let currentCalculatedKcal;
    let currentCalculatedKH;
    let currentCalculatedEW;
    let currentCalculatedFT;
    let currentKcal: any = currentAddRecipe?.kcal_total;
    let currentKH: any = currentAddRecipe?.carbohydrates_total;
    let currentEW: any = currentAddRecipe?.protein_total;
    let currentFT: any = currentAddRecipe?.fat_total;
    let getIngridientRecipeData = [] as any;
    let getIngridient = [] as any;

    getIngridientRecipeData = currentAddRecipe!.ingredients.filter((item: any) => item.id === currentEditIngridientID);
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
      ...currentAddRecipe,
      kcal_total: currentKcal,
      carbohydrates_total: currentKH,
      protein_total: currentEW,
      fat_total: currentFT,
      ingredients: currentAddRecipe?.ingredients.map((ingridients: any) => {
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

  const changeIngridientExecuteAPI = () => {
    let currentKcal: any = currentAddRecipe?.kcal_total;
    let currentKH: any = currentAddRecipe?.carbohydrates_total;
    let currentEW: any = currentAddRecipe?.protein_total;
    let currentFT: any = currentAddRecipe?.fat_total;
    let getIngridientRecipeData = [] as any;
    let thisPieceValue = currentEditIngridientPiece;

    getIngridientRecipeData = currentAddRecipe!.ingredients.filter((item: any) => item.id === currentEditIngridientID);

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
      ...currentAddRecipe,
      kcal_total: currentKcal,
      carbohydrates_total: currentKH,
      protein_total: currentEW,
      fat_total: currentFT,
      ingredients: currentAddRecipe?.ingredients.map((ingridients: any) => {
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

  // Change recipe name
  const updateRecipeName = (event: any) => {
    setCurrentRecipeName(event.currentTarget.textContent.trim());
    setRecipeChanged(true);
  };

  // Change recipe category
  const updateCategory = (value: OptionTypeBase) => {
    const newColumns = {
      ...currentAddRecipe,
      category: value.label,
    };

    updateRecipeState(newColumns);
    setRecipeChanged(true);
  };

  // change recipe difficulty level
  const updateDifficultyLevel = (value: OptionTypeBase) => {
    const newColumns = {
      ...currentAddRecipe,
      difficulty_level: parseFloat(value.value),
    };

    updateRecipeState(newColumns);
    setRecipeChanged(true);
  };

  // Get FatSecret Autocomplete results
  const ingridientAutoCompleteSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSearchQuery(event.target.value);
    ingridientAutoCompleteSearchExecute();
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

  function regenerateRecipe() {
    setCurrentAddRecipe(currentOriginalRecipe);
    setRecipeDescriptionArray([]);
    setDirectAddedIngridients([]);
    setCurrentRecipeAmount('1');
    setRecipeChanged(false);
  }

  function startCookingMode() {
    setCookingModeOverlayClass('block');
    setCurrentCookingStep(1);
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

    if (piece !== 'g' && piece !== 'ml') {
      thisCurrentKcalComplete = Math.round(
        parseFloat(currentAddRecipe?.kcal_total!) + ((amount * parseFloat(preselect_g)) / 100) * parseFloat(kcal_100g)
      );

      thisCurrentKHComplete = Math.round(
        parseFloat(currentAddRecipe?.carbohydrates_total!) +
          ((amount * parseFloat(preselect_g)) / 100) * parseFloat(carbohydrates_100g)
      );

      thisCurrentEWComplete = Math.round(
        parseFloat(currentAddRecipe?.protein_total!) +
          ((amount * parseFloat(preselect_g)) / 100) * parseFloat(protein_100g)
      );

      thisCurrentFTComplete = Math.round(
        parseFloat(currentAddRecipe?.fat_total!) + ((amount * parseFloat(preselect_g)) / 100) * parseFloat(fat_100g)
      );
    } else {
      thisCurrentKcalComplete = Math.round(
        parseFloat(currentAddRecipe?.kcal_total!) + (amount / 100) * parseFloat(kcal_100g)
      );

      thisCurrentKHComplete = Math.round(
        parseFloat(currentAddRecipe?.carbohydrates_total!) + (amount / 100) * parseFloat(carbohydrates_100g)
      );

      thisCurrentEWComplete = Math.round(
        parseFloat(currentAddRecipe?.protein_total!) + (amount / 100) * parseFloat(protein_100g)
      );

      thisCurrentFTComplete = Math.round(
        parseFloat(currentAddRecipe?.fat_total!) + (amount / 100) * parseFloat(fat_100g)
      );
    }

    const thisPiece = piece;

    const thisIngridientObject = {
      id: Math.random(),
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
    };

    let thisRecipeData = currentAddRecipe as any;

    const newColumns = {
      ...currentAddRecipe,
      kcal_total: thisCurrentKcalComplete,
      carbohydrates_total: thisCurrentKHComplete,
      protein_total: thisCurrentEWComplete,
      fat_total: thisCurrentFTComplete,
      ingredients: [...currentAddRecipe!.ingredients, thisIngridientObject],
    };

    const checkIncompabilityArray = [] as any;

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

    if (currentEditIngridientType === 'add') {
      handleOpenClosePopups(setEditPopupOverlayClass, '', 'close');
      handleOpenClosePopups(setPopupOverlayClass, '', 'close');
    }
    setCurrentIngridientSearch(false);
    setCurrentSearchQuery('');
    // this.setState({ currentIngridientPieceIdentifier: '' });
    setCurrentIngridientSearchAutocomplete({ suggestions: { suggestion: [''] } });
    if (!Number.isNaN(amount)) {
      updateRecipeState(thisRecipeData);
      setDirectAddedIngridients([thisIngridientObject, ...directAddedIngridients]);
      setRecipeChanged(true);
    } else {
      toast.error('Die eingegebenen Daten enthielten Fehler!');
    }

    if (currentEditIngridientType === 'notAdded') {
      handleOpenClosePopups(setEditPopupOverlayClass, setPopupOverlayClass, 'both');
    }
  }

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

        thisCurrentKcalComplete = Math.round(
          parseFloat(currentAddRecipe?.kcal_total!) + currentEditIngridientKcalTotal
        );

        thisCurrentKHComplete = Math.round(
          parseFloat(currentAddRecipe?.carbohydrates_total!) + currentEditIngridientCarbohydratesTotal
        );

        thisCurrentEWComplete = Math.round(
          parseFloat(currentAddRecipe?.protein_total!) + currentEditIngridientProteinTotal
        );

        thisCurrentFTComplete = Math.round(parseFloat(currentAddRecipe?.fat_total!) + currentEditIngridientFatTotal);

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
          amount: currentEditIngridientAmount,
          initial_amount: currentEditIngridientAmount,
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

        const newColumns = {
          ...currentAddRecipe,
          kcal_total: thisCurrentKcalComplete,
          carbohydrates_total: thisCurrentKHComplete,
          protein_total: thisCurrentEWComplete,
          fat_total: thisCurrentFTComplete,
          ingredients: [...currentAddRecipe!.ingredients, thisIngridientObject],
        };

        setCurrentIngridientSearch(false);
        setCurrentSearchQuery('');
        setCurrentIngridientSearchAutocomplete({ suggestions: { suggestion: [''] } });
        if (!Number.isNaN(parseFloat(currentEditIngridientAmount))) {
          updateRecipeState(newColumns);
          setRecipeChanged(true);
          setDirectAddedIngridients([thisIngridientObject, ...directAddedIngridients]);
        } else {
          toast.error('Die eigegebenen Daten enthielten Fehler!');
        }
        handleOpenClosePopups(setEditPopupOverlayClass, setPopupOverlayClass, 'both');
      });
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

        thisCurrentKcalComplete = Math.round(
          parseFloat(currentAddRecipe?.kcal_total!) + Math.round(parseFloat(getIngridientServingData[0].calories))
        );

        thisCurrentKHComplete = Math.round(
          parseFloat(currentAddRecipe?.carbohydrates_total!) +
            Math.round(parseFloat(getIngridientServingData[0].carbohydrate))
        );

        thisCurrentEWComplete = Math.round(
          parseFloat(currentAddRecipe?.protein_total!) + Math.round(parseFloat(getIngridientServingData[0].protein))
        );

        thisCurrentFTComplete = Math.round(
          parseFloat(currentAddRecipe?.fat_total!) + Math.round(parseFloat(getIngridientServingData[0].fat))
        );

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
          initial_amount: thisAmount,
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

        const newColumns = {
          ...currentAddRecipe,
          kcal_total: thisCurrentKcalComplete,
          carbohydrates_total: thisCurrentKHComplete,
          protein_total: thisCurrentEWComplete,
          fat_total: thisCurrentFTComplete,
          ingredients: [...currentAddRecipe!.ingredients, thisIngridientObject],
        };

        setCurrentIngridientSearch(false);
        setCurrentSearchQuery('');
        setCurrentIngridientSearchAutocomplete({ suggestions: { suggestion: [''] } });
        if (!Number.isNaN(thisAmount)) {
          updateRecipeState(newColumns);
          setRecipeChanged(true);
          setDirectAddedIngridients([thisIngridientObject, ...directAddedIngridients]);
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
    let thisRecipeData = currentAddRecipe as any;

    const newColumns = {
      ...currentAddRecipe,
      kcal_total: Math.round(parseFloat(currentAddRecipe!.kcal_total) - ingridientKcal),
      carbohydrates_total: `${Math.round(parseFloat(currentAddRecipe!.carbohydrates_total) - ingridientKh)}`,
      protein_total: `${Math.round(parseFloat(currentAddRecipe!.protein_total) - ingridientEw)}`,
      fat_total: `${Math.round(parseFloat(currentAddRecipe!.fat_total) - ingridientFt)}`,
      ingredients: [...currentAddRecipe!.ingredients.filter((item: any) => item.id !== thisId)],
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

    thisCurrentKcalComplete = Math.round(parseFloat(currentAddRecipe!.kcal_total) - parseFloat(kcal_total));
    thisCurrentKHComplete = Math.round(
      parseFloat(currentAddRecipe!.carbohydrates_total) - parseFloat(carbohydrates_total)
    );
    thisCurrentEWComplete = Math.round(parseFloat(currentAddRecipe!.protein_total) - parseFloat(protein_total));
    thisCurrentFTComplete = Math.round(parseFloat(currentAddRecipe!.fat_total) - parseFloat(fat_total));

    const newColumns = {
      ...currentAddRecipe,
      kcal_total: thisCurrentKcalComplete,
      carbohydrates_total: thisCurrentKHComplete,
      protein_total: thisCurrentEWComplete,
      fat_total: thisCurrentFTComplete,
      ingredients: [...currentAddRecipe!.ingredients.filter((item: any) => item.id !== thisId)],
    };

    setDirectAddedIngridients(directAddedIngridients.filter(item => item.id !== thisId));
    updateRecipeState(newColumns);
    setRecipeChanged(true);
  }

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
    setPopupOverlayClass('hidden');

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
    setPopupOverlayClass('hidden');
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

  function handleOpenSearchPopup() {
    if (searchIngridientRef.current) {
      searchIngridientRef.current.value = '';
    }
    setPopupOverlayClass('block');
  }

  function handleOpenClosePopups(closeStateObject: any, openStateObject: any, type: string) {
    if (type === 'both') {
      closeStateObject('hidden');
      openStateObject('block');
    } else if (type === 'open') {
      openStateObject('block');
    } else if (type === 'close') {
      closeStateObject('hidden');
    }
  }

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

  function dataURItoBlob(dataURI: any) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) byteString = atob(dataURI.split(',')[1]);
    else byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i += 1) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }

  // Image crop

  return (
    <>
      <div className={editPictureOverlayClass}>
        <div className={styles.backgroundPopupLayer}>
          <div className={styles.editPicturePopup}>
            <div className="flex justify-between pt-20 pl-20">
              <div className="flex">
                <div className="my-auto pr-10">
                  <PlusIcon width={25} height={25} className="text-brownSemiDark mx-auto" />
                </div>
                <div className="text-xl my-auto font-light">Neues Bild hinzufügen</div>
              </div>
              <div className="my-auto pr-20">
                <XIcon
                  width={25}
                  height={25}
                  className="text-brownSemiDark mx-auto cursor-pointer"
                  onClick={() => handleOpenClosePopups(setEditPictureOverlayClass, '', 'close')}
                />
              </div>
            </div>
            <div className={styles.editPictureIngridientPopupContent}>
              <div className="pt-15  pb-30">
                <div className="font-light text-base pl-20 pr-15">
                  Hier kannst du ein neues Foto hochladen und einen geeigneten Ausschnitt wählen!
                </div>
                <div className="pt-40 pl-20 pr-15">
                  <input type="file" accept="image/*" onChange={onSelectFile} />
                </div>
                <div className="pt-20 md:pl-20 md:pr-15">
                  <ReactCrop
                    src={upImg as string}
                    onImageLoaded={onLoad}
                    crop={crop}
                    locked
                    onChange={c => setCrop(c)}
                    onComplete={c => setCompletedCrop(c as CompletedCrop)}
                  />
                </div>
                <div className="hidden">
                  <canvas
                    ref={previewCanvasRef}
                    // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                    style={{
                      width: Math.round(completedCrop?.width ?? 0),
                      height: Math.round(completedCrop?.height ?? 0),
                    }}
                  />
                </div>
              </div>
              <div className="pl-20 pr-10 pb-40">
                <Button className="w-full" onClick={() => saveNewRecipePicture()}>
                  {t('Save')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={deleteRecipeOverlayClass}>
        <div className={styles.backgroundPopupLayer}>
          <div className={styles.editPicturePopup}>
            <div className="flex justify-between pt-20 pl-20">
              <div className="flex">
                <div className="my-auto pr-10">
                  <TrashIcon width={25} height={25} className="text-brownSemiDark mx-auto" />
                </div>
                <div className="text-xl my-auto font-light">Rezept löschen</div>
              </div>
              <div className="my-auto pr-20">
                <XIcon
                  width={25}
                  height={25}
                  className="text-brownSemiDark mx-auto cursor-pointer"
                  onClick={() => handleOpenClosePopups(setDeleteRecipeOverlayClass, '', 'close')}
                />
              </div>
            </div>
            <div className={styles.editPictureIngridientPopupContent}>
              <div className="pt-15 pl-20 pb-30">
                <div className="pt-20 font-light text-base">Wollen Sie dieses Rezept wirklich löschen?</div>
                <div className="pt-30 flex gap-30">
                  <div>
                    <Button className="w-full" onClick={() => deleteRecipeFromFirebase()}>
                      Ja
                    </Button>
                  </div>
                  <div>
                    <Button
                      className="w-full"
                      onClick={() => handleOpenClosePopups(setDeleteRecipeOverlayClass, '', 'close')}
                    >
                      Nein
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                <div>Folgende Ernährungsformen passen zu diesem Rezept.</div>
                <div className="pt-1">Du kannst diese bei Bedarf anpassen (Mehrfachauswahl möglich).</div>
                <div className="pt-40">
                  {formOfNutrition.map((item: string, index: number) => (
                    <>
                      <SwitchButton
                        key={index}
                        label={item}
                        enabled={
                          currentAddRecipe?.name !== undefined &&
                          typeof currentAddRecipe[item.toLowerCase()] !== undefined
                            ? Boolean(currentAddRecipe[item.toLowerCase()])
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
      <div className={cookingModeOverlayClass}>
        <div className={styles.backgroundPopupLayer}>
          <div className={styles.editCookingModePopup}>
            <div className="flex justify-between pt-20 pl-20">
              <div className="flex">
                <div className="my-auto pr-10">
                  <Icon name="cooking" width={25} height={25} className="text-brownSemiDark mx-auto" />
                </div>
                <div className="text-xl my-auto font-light">Kochmodus</div>
              </div>
              <div className="my-auto pr-20">
                <XIcon
                  width={25}
                  height={25}
                  className="text-brownSemiDark mx-auto cursor-pointer"
                  onClick={() => setCookingModeOverlayClass('hidden')}
                />
              </div>
            </div>
            <div className={styles.editCookingModePopupContent}>
              <CookingMode
                step={currentCookingStep}
                stepFunction={setCurrentCookingStep}
                descriptionArray={currentAddRecipe?.description}
              />
              <div className="pl-20 pr-10 pb-40 pt-40 z-150">
                <RecipeStepSwitch
                  returnFunction={returnToPreviousStep}
                  nextFunction={jumpToNextStep}
                  currentStepValue={currentCookingStep.toString()}
                  totalSteps={currentAddRecipe?.description.length}
                  isFinished={currentCookingStep === currentAddRecipe?.description.length}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {typeof location.state !== undefined && location.state !== null && location.state?.from !== 'plans' && (
        <div className={cookingModeOverlayClass === 'hidden' ? 'block' : 'hidden'}>
          <div className={styles.mobileButtonGroup}>
            {recipeChanged && userData?.role === 1 ? (
              <>
                <div className="pl-30">
                  <Button className="w-full" onClick={() => saveNewRecipeToFirebase()}>
                    {t('SaveAsNewRecipe')}
                  </Button>
                </div>
              </>
            ) : recipeChanged && currentAddRecipe?.userRecipe ? (
              <div className="ml-30">
                <Button onClick={() => saveExistingRecipeToFirebase()}>Änderungen speichern</Button>
              </div>
            ) : recipeChanged ? (
              <div>
                <Button className="ml-30" onClick={() => saveNewRecipeToFirebase()}>
                  {t('SaveAsNewRecipe')}
                </Button>
              </div>
            ) : (
              <></>
            )}
            <div className="flex-1 px-30">
              <Button className="w-full h-full">{t('AddToPlan')}</Button>
            </div>
          </div>
        </div>
      )}

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
                  onClick={() => handleOpenClosePopups(setEditPopupOverlayClass, setPopupOverlayClass, 'both')}
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

      <div className={popupOverlayClass}>
        <div className={styles.backgroundPopupLayer}>
          <div className={styles.addIngridientPopup}>
            <div className="flex justify-between pt-20 pl-20">
              <div className="flex">
                <div className="my-auto pr-10">
                  <PlusIcon width={25} height={25} className="text-brownSemiDark mx-auto" />
                </div>
                <div className="text-xl my-auto font-light">Hinzufügen</div>
              </div>
              <div className="my-auto pr-20">
                <XIcon
                  width={25}
                  height={25}
                  className="text-brownSemiDark mx-auto cursor-pointer"
                  onClick={() => handleOpenClosePopups(setPopupOverlayClass, '', 'close')}
                />
              </div>
            </div>
            <div className="pt-20 pl-20 pr-20">
              <div>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    ingridientApiSearch(currentSearchQuery);
                  }}
                >
                  <SearchBox
                    thisRef={searchIngridientRef}
                    searchValue={currentSearchQuery}
                    onChange={ingridientAutoCompleteSearch}
                  />
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
              <div className={(currentSearchQuery.length > 0 && 'hidden') || 'visible'}>
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
                {directAddedIngridients.length > 0 && (
                  <div className="pt-20 pr-20">
                    <Button className="w-full" onClick={() => setPopupOverlayClass('hidden')}>
                      {t('Finish')}
                    </Button>
                  </div>
                )}
              </div>
              <div className={styles.ingridientPopupContent}>
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
                                  <div className="text-12">{plans.food_description.match('Kalorien: (.*)kcal')[1]}</div>
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
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.pageWrapper} ref={scrollContainerRef}>
        <div className={styles.recipeImageContainer} style={{ backgroundImage: `url(${currentAddRecipe?.imageUrl})` }}>
          <div className="flex justify-between">
            <div className="z-10 w-32 pt-4 pl-4">
              <div className={styles.backBtnBg}>
                {typeof location.state !== undefined && location.state !== null && location.state?.from === 'plans' ? (
                  <Link
                    to={{
                      pathname: `/plans/${location.state?.uid}`,
                      state: {
                        from: 'nutrition-detail',
                        type: location.state.type,
                        id: location.state.id,
                        mealLabel: location.state.label,
                      },
                    }}
                  >
                    <ButtonBack text={t('Return')} />
                  </Link>
                ) : (
                  <Link
                    to={{
                      pathname: '/nutrition',
                      state: {
                        scrollPos: currentScrollPosition,
                      },
                    }}
                  >
                    <ButtonBack text={t('Return')} />
                  </Link>
                )}
              </div>
            </div>
            {typeof location.state !== undefined && location.state !== null && location.state?.from !== 'plans' && (
              <div className="bg-lightDarkGray rounded-full p-2 mt-15 mr-15 z-10 cursor-pointer">
                <PencilIcon
                  width={15}
                  height={15}
                  className="text-white"
                  onClick={() => handleOpenClosePopups('', setEditPictureOverlayClass, 'open')}
                />
              </div>
            )}
          </div>
        </div>
        <div className={styles.recipeWrapper}>
          <div className="hidden md:block">
            <img className="h-full object-cover block" src={currentAddRecipe?.imageUrl} alt="" />
          </div>
          <div className={styles.recipeContent}>
            <div className="pt-4 flex justify-center gap-8">
              <div
                title="Kochmodus"
                onClick={() => startCookingMode()}
                onKeyDown={() => startCookingMode()}
                aria-hidden="true"
              >
                <Icon name="cooking" width={28} height={28} className="text-brownSemiDark cursor-pointer" />
              </div>
              {typeof location.state !== undefined && location.state !== null && location.state?.from !== 'plans' && (
                <div title="Originalrezept wiederherstellen">
                  <RefreshIcon
                    width={28}
                    height={28}
                    className="text-brownSemiDark cursor-pointer"
                    onClick={() => regenerateRecipe()}
                  />
                </div>
              )}
              <div title="Favoriten">
                <HeartIcon
                  width={28}
                  height={28}
                  className="text-brownSemiDark"
                  fill={(recipeFavorite && '#C97132') || 'none'}
                  onClick={() => saveRecipeToFavorites()}
                />
              </div>
              <div title="Teilen">
                <UploadIcon width={28} height={28} className="text-brownSemiDark" />
              </div>
              {userData?.role === 1 || currentAddRecipe?.userRecipe ? (
                <div title="Löschen">
                  <TrashIcon
                    width={28}
                    height={28}
                    className="text-brownSemiDark cursor-pointer"
                    onClick={() => setDeleteRecipeOverlayClass('block')}
                  />
                </div>
              ) : (
                <div />
              )}
            </div>

            <div className="mx-20 mt-20 z-10 text-left text-xl font-semibold">
              {typeof location.state !== undefined && location.state !== null && location.state?.from === 'plans' ? (
                <div className="text-white leading-8 px-5 rounded-xl">{currentAddRecipe?.name}</div>
              ) : (
                <div
                  onInput={updateRecipeName}
                  className="text-white leading-8 border border-opacity-30 border-white p-5 rounded-xl"
                  contentEditable
                  suppressContentEditableWarning
                >
                  {currentAddRecipe?.name}
                </div>
              )}
            </div>

            {currentAddRecipe?.userRecipe && (
              <div className="flex ml-20 pt-15">
                <div className="rounded-3xl bg-brownSemiDark py-5 px-15 font-bold text-14">Eigenes Rezept</div>
              </div>
            )}

            <div className="pt-4 px-6">
              <div className="flex w-full gap-4 sticky py-4 top-0 z-10 bg-blackDark">
                <div className="flex-1 text-center">
                  <div className="font-semibold text-base">{Math.round(parseFloat(currentAddRecipe?.kcal_total!))}</div>
                  <div className={styles.recipeLabel}>kcal</div>
                </div>
                <div className="flex-1 text-center">
                  <div className="font-semibold text-base">
                    {Math.round(parseFloat(currentAddRecipe?.carbohydrates_total!))}g
                  </div>
                  <div className={styles.recipeLabel}>{t('Carbohydrates')}</div>
                </div>
                <div className="flex-1 text-center">
                  <div className="font-semibold text-base">
                    {Math.round(parseFloat(currentAddRecipe?.protein_total!))}g
                  </div>
                  <div className={styles.recipeLabel}>{t('Protein')}</div>
                </div>
                <div className="flex-1 text-center">
                  <div className="font-semibold text-base">{Math.round(parseFloat(currentAddRecipe?.fat_total!))}g</div>
                  <div className={styles.recipeLabel}>{t('Fat')}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-10 pt-20">
                {typeof location.state !== undefined && location.state !== null && location.state?.from === 'plans' ? (
                  <HashTagBadge
                    planObject={currentAddRecipe}
                    setPlanObject={setCurrentAddRecipe}
                    setPlanChanged={setRecipeChanged}
                  />
                ) : (
                  <>
                    <HashTagBadge
                      planObject={currentAddRecipe}
                      onlyNutritionForm
                      edit
                      setPlanObject={setCurrentAddRecipe}
                      setPlanChanged={setRecipeChanged}
                    />
                    {currentAddRecipe?.ketogen === false ||
                    currentAddRecipe?.vegetarian === false ||
                    currentAddRecipe?.vegan === false ? (
                      <>
                        <div
                          className="font-extralight text-12 gap-1 flex cursor-pointer rounded-lg px-2 border-transparent border-2 hover:border-brownSemiDark"
                          onClick={() => setEditFormOfNutritionOverlayClass('block')}
                          onKeyDown={() => setEditFormOfNutritionOverlayClass('block')}
                          aria-hidden="true"
                        >
                          <div className="my-auto">
                            <PlusIcon
                              width={15}
                              height={15}
                              className="text-brownSemiDark"
                              onClick={() => handleOpenSearchPopup()}
                            />
                          </div>
                          <div className="my-auto">Weitere hinzufügen</div>
                        </div>
                      </>
                    ) : (
                      <div />
                    )}
                  </>
                )}
              </div>
              <div className="hidden">
                <div className={styles.actionBtn}>
                  <div>
                    <PlusIcon width={36} height={36} className="text-brownSemiDark mx-auto cursor-pointer" />
                  </div>
                  <div className="text-center pt-4">{t('AddToPlan')}</div>
                </div>
                <div className={styles.actionBtn}>
                  <div>
                    <SaveIcon width={36} height={36} className="text-brownSemiDark mx-auto" />
                  </div>
                  <div className="text-center pt-4">{t('SaveAsNewRecipe')}</div>
                </div>
              </div>
              {typeof location.state !== undefined && location.state !== null && location.state?.from === 'plans' ? (
                <div className="flex gap-20 justify-between">
                  <div>
                    <div className="flex justify-between pt-40">
                      <div className="font-extralight text-15">{t('PortionSize')}</div>
                    </div>
                    <div className="pt-2">
                      <div className="font-semibold text-15">
                        {currentAddRecipe?.recipe_portion !== undefined
                          ? currentAddRecipe?.recipe_portion
                          : currentRecipeAmount}{' '}
                        {currentAddRecipe?.portion_g !== undefined && (
                          <>
                            {`Portion (${parseFloat(currentRecipeAmount) * parseFloat(currentAddRecipe?.portion_g)}g)`}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between pt-40">
                      <div className="font-extralight text-15">{t('Level of difficulty')}</div>
                    </div>
                    <div className="pt-2">
                      <div className="font-semibold text-15">
                        {currentAddRecipe?.name !== undefined &&
                          difficultyValues.filter(st => parseFloat(st.value) === currentAddRecipe?.difficulty_level)[0]
                            .label}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between pt-40">
                      <div className="font-extralight text-15">{t('Category')}</div>
                    </div>
                    <div className="pt-2">
                      <div className="font-semibold text-15">
                        {currentAddRecipe?.name !== undefined &&
                          recipeCategoryValues.filter(st => st.label === currentAddRecipe?.category)[0].label}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <div className="flex justify-between pt-30">
                      <div className="font-light text-2xl">{t('PortionSize')}</div>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <div>
                        <CustomUserInput
                          thisValue={
                            currentAddRecipe?.recipe_portion !== undefined
                              ? currentAddRecipe?.recipe_portion
                              : currentRecipeAmount
                          }
                          thisRef={editRecipePortionSizeRef}
                          name="changeRecipeAmount"
                          onChange={e => changeRecipeAmount(e.target.value.trim(), recipe, recipePiece)}
                          onClick={clickRecipePortionSize}
                          width="4"
                        />
                      </div>
                      {/*
                      <div className="flex-1">
                        {currentAddRecipe?.portion_g !== undefined && (
                          <CustomSelect
                            name="portionValues"
                            dropDownOption={recipePortionValues}
                            defaultValue={
                              currentAddRecipe?.recipe_piece !== undefined
                                ? recipePortionValues.filter(st => st.value === currentAddRecipe?.recipe_piece)
                                : recipePortionValues[0]
                            }
                            onChange={e => changeRecipePiece(e)}
                          />
                        )}
                      </div>
                          */}
                      {currentAddRecipe?.portion_g !== undefined && (
                        <div className="my-auto">
                          <div className="font-semibold text-15">{`Portion (${
                            parseFloat(currentRecipeAmount) * parseFloat(currentAddRecipe?.portion_g)
                          }g)`}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  {userData?.role === 1 && (
                    <div>
                      <div className="font-light text-base pt-40">
                        <SwitchButton
                          notContainer
                          label="alghorithmus"
                          enabled={useAlghorithmus}
                          onChange={changeAlghorithmus}
                        />
                      </div>
                    </div>
                  )}
                  <div className="pt-4 flex justify-between">
                    <div className="pt-2 font-light text-base">{t('Level of difficulty')}</div>
                    <div className="w-28">
                      {currentAddRecipe?.difficulty_level !== undefined && (
                        <CustomSelect
                          name="difficultyLevel"
                          dropDownOption={difficultyValues}
                          defaultValue={difficultyValues.filter(
                            st => parseFloat(st.value) === currentAddRecipe?.difficulty_level
                          )}
                          onChange={updateDifficultyLevel}
                        />
                      )}
                    </div>
                  </div>
                  <div className="pt-4 flex justify-between">
                    <div className="pt-2 pr-15 font-light text-base">{t('Category')}</div>
                    <div className="flex-1">
                      {currentAddRecipe?.category !== undefined && (
                        <CustomSelect
                          name="category"
                          dropDownOption={recipeCategoryValues}
                          defaultValue={recipeCategoryValues.filter(st => st.label === currentAddRecipe?.category)}
                          onChange={updateCategory}
                        />
                      )}
                    </div>
                  </div>
                </>
              )}

              <div>
                <div className="flex justify-between pt-40">
                  <div className="font-light text-2xl">{t('IngredientsList')}</div>
                  {typeof location.state !== undefined && location.state !== null && location.state?.from !== 'plans' && (
                    <div className="my-auto">
                      <PlusIcon
                        width={28}
                        height={28}
                        className="text-brownSemiDark cursor-pointer"
                        onClick={() => handleOpenSearchPopup()}
                      />
                    </div>
                  )}
                </div>
                <div className={styles.ingridientContainer}>
                  {currentAddRecipe?.ingredients.map(ingridient => (
                    <>
                      <IngridientItem
                        ingridientData={ingridient}
                        recipeData={currentAddRecipe}
                        updateFunction={updateRecipeState}
                        setRecipeChanged={setRecipeChanged}
                        setDirectAddedIngridients={setDirectAddedIngridients}
                        directAddedIngridients={directAddedIngridients}
                        defaultValue={ingridient.amount}
                      />
                    </>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex justify-between pt-40 mb-14">
                  <div className="font-light text-2xl">{t('Preparation')}</div>
                  {typeof location.state !== undefined && location.state !== null && location.state?.from !== 'plans' && (
                    <div className="my-auto">
                      <PlusIcon
                        onClick={() =>
                          addDescriptionStep(
                            currentAddRecipe,
                            updateRecipeState,
                            setRecipeChanged,
                            'mobile',
                            recipeDescriptionArray,
                            setRecipeDescriptionArray,
                            setDescriptionStepAdded
                          )
                        }
                        width={28}
                        height={28}
                        className="text-brownSemiDark cursor-pointer"
                      />
                    </div>
                  )}
                </div>
                {currentAddRecipe?.description.map(desc => (
                  <>
                    <DescriptionItem
                      descriptionData={desc}
                      recipeData={currentAddRecipe}
                      updateFunction={updateRecipeState}
                      setRecipeChanged={setRecipeChanged}
                      recipeDescriptionArray={setRecipeDescriptionArray}
                      recipeDescriptionArrayValue={recipeDescriptionArray}
                      newDescriptionStepRef={newDescriptionStepRef}
                      recipeChanged={recipeChanged}
                      setDescriptionStepAdded={setDescriptionStepAdded}
                      descriptionStepAdded={descriptionStepAdded}
                    />
                  </>
                ))}
              </div>
              {typeof location.state !== undefined && location.state !== null && location.state?.from !== 'plans' && (
                <div>
                  <div>
                    <div
                      className="flex pt-20 mb-14 cursor-pointer"
                      id="descriptionJumpContainerDesktop"
                      onClick={() => toggleIncompatibilities()}
                      onKeyDown={() => toggleIncompatibilities()}
                      aria-hidden="true"
                    >
                      <div className="font-light text-2xl">{t('Intolerances')}</div>
                      <div className="pl-5 my-auto">
                        <ChevronDownIcon className={incompatibilitiesChevronClass} height={30} width={30} />
                      </div>
                    </div>
                    <div className={incompatibilitiesClass}>
                      <div className="font-extralight text-15 pb-20 pr-20">
                        <p>Folgende Unverträglichkeiten haben wir bei diesem Rezept erkannt. </p>
                        <p>Du kannst diese bei Bedarf anpassen.</p>
                      </div>
                      {intolerancesOption.map((item: string, index: number) => (
                        <>
                          <SwitchButton
                            key={index}
                            label={item}
                            enabled={
                              currentAddRecipe?.name !== undefined &&
                              typeof currentAddRecipe[item.toLowerCase()] !== undefined
                                ? Boolean(currentAddRecipe[item.toLowerCase()])
                                : false
                            }
                            isBackground={index % 2 === 0}
                            onChange={setIncompatibilities}
                          />
                        </>
                      ))}
                    </div>
                  </div>
                  <div className="mb-40">
                    <div
                      className="flex pt-20 mb-14 cursor-pointer"
                      id="descriptionJumpContainerDesktop"
                      onClick={() => toggleEatingHabits()}
                      onKeyDown={() => toggleEatingHabits()}
                      aria-hidden="true"
                    >
                      <div className="font-light text-2xl">{t('Eating habits')}</div>
                      <div className="pl-5 my-auto">
                        <ChevronDownIcon className={eatingHabitsChevronClass} height={30} width={30} />
                      </div>
                    </div>
                    <div className={eatingHabitsClass}>
                      <div className="font-extralight text-15 pb-20 pr-20">
                        <p>Folgendes Essverhalten passt zu diesem Rezept. </p>
                        <p>Du kannst die Werte bei Bedarf anpassen.</p>
                      </div>
                      {eatingHabitsOption.map((item: string, index: number) => (
                        <>
                          <SwitchButton
                            key={index}
                            label={item}
                            enabled={
                              currentAddRecipe?.name !== undefined &&
                              typeof currentAddRecipe[item.toLowerCase()] !== undefined
                                ? Boolean(currentAddRecipe[item.toLowerCase()])
                                : false
                            }
                            isBackground={index % 2 === 0}
                            onChange={setEatingHabits}
                          />
                        </>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.pageWrapperDesktop}>
        <div className="w-1/2 relative overflow-auto">
          <div className="w-32 pt-2">
            <div className={styles.backBtnBg}>
              {typeof location.state !== undefined && location.state !== null && location.state?.from === 'plans' ? (
                <Link
                  to={{
                    pathname: `/plans/${location.state?.uid}`,
                    state: {
                      from: 'nutrition-detail',
                      type: location.state.type,
                      id: location.state.id,
                      mealLabel: location.state.label,
                    },
                  }}
                >
                  <ButtonBack text={t('Return')} />
                </Link>
              ) : (
                <Link
                  to={{
                    pathname: '/nutrition',
                    state: {
                      scrollPos: currentScrollPosition,
                    },
                  }}
                >
                  <ButtonBack text={t('Return')} />
                </Link>
              )}
            </div>
          </div>
          <div className="flex text-2xl font-semibold pt-20">
            <div className="z-10">
              {typeof location.state !== undefined && location.state !== null && location.state?.from === 'plans' ? (
                <div className="text-white leading-8">{currentAddRecipe?.name}</div>
              ) : (
                <>
                  <div
                    onInput={updateRecipeName}
                    className="text-white leading-8 border border-opacity-30 border-white p-10 rounded-xl"
                    contentEditable
                    suppressContentEditableWarning
                  >
                    {currentAddRecipe?.name}
                  </div>
                </>
              )}
            </div>
            {typeof location.state !== undefined && location.state !== null && location.state?.from !== 'plans' && (
              <div className="my-auto pl-10">
                <PencilIcon width={30} height={20} className="text-brownSemiDark" />
              </div>
            )}
          </div>
          {currentAddRecipe?.userRecipe && (
            <div className="flex pt-15">
              <div className="rounded-3xl bg-brownSemiDark py-5 px-15 font-bold text-14">Eigenes Rezept</div>
            </div>
          )}
          <div className="relative">
            <img className="object-cover rounded-3xl w-full mt-30" src={currentAddRecipe?.imageUrl} alt="" />
            {typeof location.state !== undefined && location.state !== null && location.state?.from !== 'plans' && (
              <div className="absolute right-20 top-10 bg-lightDarkGray rounded-full p-2 cursor-pointer">
                <PencilIcon
                  width={15}
                  height={15}
                  className="text-white"
                  onClick={() => handleOpenClosePopups('', setEditPictureOverlayClass, 'open')}
                />
              </div>
            )}
          </div>
          <div className="pt-4 flex justify-center gap-8">
            <div
              title="Kochmodus"
              onClick={() => startCookingMode()}
              onKeyDown={() => startCookingMode()}
              aria-hidden="true"
            >
              <Icon name="cooking" width={28} height={28} className="text-brownSemiDark cursor-pointer" />
            </div>
            {typeof location.state !== undefined && location.state !== null && location.state?.from !== 'plans' && (
              <div title="Originalrezept wiederherstellen">
                <RefreshIcon
                  width={28}
                  height={28}
                  className="text-brownSemiDark cursor-pointer"
                  onClick={() => regenerateRecipe()}
                />
              </div>
            )}
            <div title="Favoriten">
              <HeartIcon
                width={28}
                height={28}
                className="text-brownSemiDark cursor-pointer"
                fill={(recipeFavorite && '#C97132') || 'none'}
                onClick={() => saveRecipeToFavorites()}
              />
            </div>
            <div title="Teilen">
              <UploadIcon width={28} height={28} className="text-brownSemiDark cursor-pointer" />
            </div>
            {(userData?.role === 1 || currentAddRecipe?.userRecipe) &&
            typeof location.state !== undefined &&
            location.state !== null &&
            location.state?.from !== 'plans' ? (
              <div title="Löschen">
                <TrashIcon
                  width={28}
                  height={28}
                  className="text-brownSemiDark cursor-pointer"
                  onClick={() => setDeleteRecipeOverlayClass('block')}
                />
              </div>
            ) : (
              <div />
            )}
          </div>
          <div className="pt-8 px-6">
            <div className="flex w-full gap-4">
              <div className="flex-1 text-center">
                <div className="font-semibold text-base">{Math.round(parseFloat(currentAddRecipe?.kcal_total!))}</div>
                <div className={styles.recipeLabel}>kcal</div>
              </div>
              <div className="flex-1 text-center">
                <div className="font-semibold text-base">
                  {Math.round(parseFloat(currentAddRecipe?.carbohydrates_total!))}g
                </div>
                <div className={styles.recipeLabel}>{t('Carbohydrates')}</div>
              </div>
              <div className="flex-1 text-center">
                <div className="font-semibold text-base">
                  {Math.round(parseFloat(currentAddRecipe?.protein_total!))}g
                </div>
                <div className={styles.recipeLabel}>{t('Protein')}</div>
              </div>
              <div className="flex-1 text-center">
                <div className="font-semibold text-base">{Math.round(parseFloat(currentAddRecipe?.fat_total!))}g</div>
                <div className={styles.recipeLabel}>{t('Fat')}</div>
              </div>
            </div>
            {typeof location.state !== undefined && location.state !== null && location.state?.from !== 'plans' && (
              <div>
                <div className="pt-30 justify-between flex z-150">
                  <div>
                    <Button className="w-full">{t('AddToPlan')}</Button>
                  </div>
                  {recipeChanged && userData?.role === 1 ? (
                    <>
                      <div className="pl-40">
                        <Button className="w-full" onClick={() => saveNewRecipeToFirebase()}>
                          {t('SaveAsNewRecipe')}
                        </Button>
                      </div>
                    </>
                  ) : recipeChanged && currentAddRecipe?.userRecipe ? (
                    <div>
                      <Button onClick={() => saveExistingRecipeToFirebase()}>Änderungen speichern</Button>
                    </div>
                  ) : recipeChanged ? (
                    <div>
                      <Button className="w-full" onClick={() => saveNewRecipeToFirebase()}>
                        {t('SaveAsNewRecipe')}
                      </Button>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                {recipeChanged && userData?.role === 1 && (
                  <div>
                    <Button className="mt-20" onClick={() => saveExistingRecipeToFirebase()}>
                      Änderungen speichern
                    </Button>
                  </div>
                )}
              </div>
            )}
            {typeof location.state !== undefined && location.state !== null && location.state?.from === 'plans' ? (
              <>
                <div className="pt-40">
                  <HashTagBadge planObject={currentAddRecipe} />
                </div>
                <div className="flex gap-20 justify-between">
                  <div>
                    <div className="flex justify-between pt-40">
                      <div className="font-extralight text-15">{t('PortionSize')}</div>
                    </div>
                    <div className="pt-2">
                      <div className="font-semibold text-15">
                        {currentAddRecipe?.recipe_portion !== undefined
                          ? currentAddRecipe?.recipe_portion
                          : currentRecipeAmount}{' '}
                        {currentAddRecipe?.portion_g !== undefined && (
                          <>
                            {`Portion (${parseFloat(currentRecipeAmount) * parseFloat(currentAddRecipe?.portion_g)}g)`}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between pt-40">
                      <div className="font-extralight text-15">{t('Category')}</div>
                    </div>
                    <div className="pt-2">
                      <div className="font-semibold text-15">
                        {currentAddRecipe?.name !== undefined &&
                          recipeCategoryValues.filter(st => st.label === currentAddRecipe?.category)[0].label}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between pt-40">
                      <div className="font-extralight text-15">{t('Level of difficulty')}</div>
                    </div>
                    <div className="pt-2">
                      <div className="font-semibold text-15">
                        {currentAddRecipe?.name !== undefined &&
                          difficultyValues.filter(st => parseFloat(st.value) === currentAddRecipe?.difficulty_level)[0]
                            .label}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-wrap gap-10 pt-40">
                  <HashTagBadge
                    planObject={currentAddRecipe}
                    onlyNutritionForm
                    edit
                    setPlanObject={setCurrentAddRecipe}
                    setPlanChanged={setRecipeChanged}
                  />
                  {currentAddRecipe?.ketogen === false ||
                  currentAddRecipe?.vegetarian === false ||
                  currentAddRecipe?.vegan === false ? (
                    <>
                      <div
                        className="font-extralight text-12 gap-1 flex cursor-pointer rounded-lg px-2 border-transparent border-2 hover:border-brownSemiDark"
                        onClick={() => setEditFormOfNutritionOverlayClass('block')}
                        onKeyDown={() => setEditFormOfNutritionOverlayClass('block')}
                        aria-hidden="true"
                      >
                        <div className="my-auto">
                          <PlusIcon
                            width={15}
                            height={15}
                            className="text-brownSemiDark"
                            onClick={() => handleOpenSearchPopup()}
                          />
                        </div>
                        <div className="my-auto">Weitere hinzufügen</div>
                      </div>
                    </>
                  ) : (
                    <div />
                  )}
                </div>
                <div>
                  <div className="flex justify-between">
                    <div>
                      <div className="flex justify-between pt-30">
                        <div className="font-light text-2xl">{t('PortionSize')}</div>
                      </div>
                      <div className="flex gap-4 pt-4">
                        <div>
                          <CustomUserInput
                            thisValue={
                              currentAddRecipe?.recipe_portion !== undefined
                                ? currentAddRecipe?.recipe_portion
                                : currentRecipeAmount
                            }
                            thisRef={editRecipePortionSizeRef}
                            name="changeRecipeAmount"
                            onChange={e => changeRecipeAmount(e.target.value.trim(), recipe, recipePiece)}
                            onClick={clickRecipePortionSize}
                            width="4"
                          />
                        </div>
                        {/* <div className="flex-1">
                        {currentAddRecipe?.portion_g !== undefined && (
                          <CustomSelect
                            name="portionValues"
                            dropDownOption={recipePortionValues}
                            defaultValue={
                              currentAddRecipe?.recipe_piece !== undefined
                                ? recipePortionValues.filter(st => st.value === currentAddRecipe?.recipe_piece)
                                : recipePortionValues[0]
                            }
                            onChange={e => changeRecipePiece(e)}
                          />
                        )}
                      </div>
                          */}
                        {currentAddRecipe?.portion_g !== undefined && (
                          <div className="my-auto">
                            <div className="font-semibold text-15">{`Portion (${
                              parseFloat(currentRecipeAmount) * parseFloat(currentAddRecipe?.portion_g)
                            }g)`}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    {userData?.role === 1 && (
                      <div>
                        <div className="font-light text-2xl pt-30">&#160;</div>
                        <div>
                          <SwitchButton label="alghorithmus" enabled={useAlghorithmus} onChange={changeAlghorithmus} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <div className="flex justify-between pt-40">
                        <div className="font-light text-2xl">{t('Level of difficulty')}</div>
                      </div>
                      <div className="pt-4">
                        <div className="w-28">
                          {currentAddRecipe?.difficulty_level !== undefined && (
                            <CustomSelect
                              name="difficultyLevel"
                              dropDownOption={difficultyValues}
                              defaultValue={difficultyValues.filter(
                                st => parseFloat(st.value) === currentAddRecipe?.difficulty_level
                              )}
                              onChange={updateDifficultyLevel}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between pt-40">
                        <div className="font-light text-2xl">{t('Category')}</div>
                      </div>
                      <div className="pt-4">
                        <div className="w-300">
                          {currentAddRecipe?.category !== undefined && (
                            <CustomSelect
                              name="category"
                              dropDownOption={recipeCategoryValues}
                              defaultValue={recipeCategoryValues.filter(st => st.label === currentAddRecipe?.category)}
                              onChange={updateCategory}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className={styles.recipeRightWrapper}>
          <div className={styles.recipeWrapper}>
            <div className={styles.recipeContent}>
              <div>
                <div className="flex justify-between pt-40">
                  <div className="font-light text-2xl">{t('IngredientsList')}</div>
                  {typeof location.state !== undefined && location.state !== null && location.state?.from !== 'plans' && (
                    <div className="my-auto">
                      <PlusIcon
                        width={28}
                        height={28}
                        className="text-brownSemiDark cursor-pointer"
                        onClick={() => handleOpenSearchPopup()}
                      />
                    </div>
                  )}
                </div>
                <div className={styles.ingridientContainer}>
                  {currentAddRecipe?.ingredients.map(ingridient => (
                    <>
                      <IngridientItem
                        ingridientData={ingridient}
                        recipeData={currentAddRecipe}
                        updateFunction={updateRecipeState}
                        setRecipeChanged={setRecipeChanged}
                        setDirectAddedIngridients={setDirectAddedIngridients}
                        directAddedIngridients={directAddedIngridients}
                        defaultValue={ingridient.amount}
                      />
                    </>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex justify-between pt-40 mb-14">
                  <div className="font-light text-2xl">{t('Preparation')}</div>
                  {typeof location.state !== undefined && location.state !== null && location.state?.from !== 'plans' && (
                    <div className="my-auto">
                      <PlusIcon
                        onClick={() =>
                          addDescriptionStep(
                            currentAddRecipe,
                            updateRecipeState,
                            setRecipeChanged,
                            'desktop',
                            recipeDescriptionArray,
                            setRecipeDescriptionArray,
                            setDescriptionStepAdded
                          )
                        }
                        width={28}
                        height={28}
                        className="text-brownSemiDark cursor-pointer"
                      />
                    </div>
                  )}
                </div>
                {currentAddRecipe?.description.map(desc => (
                  <>
                    <DescriptionItem
                      descriptionData={desc}
                      recipeData={currentAddRecipe}
                      updateFunction={updateRecipeState}
                      setRecipeChanged={setRecipeChanged}
                      recipeDescriptionArray={setRecipeDescriptionArray}
                      recipeDescriptionArrayValue={recipeDescriptionArray}
                      newDescriptionStepRef={newDescriptionStepRef}
                      recipeChanged={recipeChanged}
                      setDescriptionStepAdded={setDescriptionStepAdded}
                      descriptionStepAdded={descriptionStepAdded}
                    />
                  </>
                ))}
              </div>
              {typeof location.state !== undefined && location.state !== null && location.state?.from !== 'plans' && (
                <div className="flex justify-between gap-40">
                  <div>
                    <div
                      className="flex pt-40 mb-14 cursor-pointer"
                      id="descriptionJumpContainerDesktop"
                      onClick={() => toggleIncompatibilities()}
                      onKeyDown={() => toggleIncompatibilities()}
                      aria-hidden="true"
                    >
                      <div className="font-light text-2xl">{t('Intolerances')}</div>
                      <div className="pl-5 my-auto">
                        <ChevronDownIcon className={incompatibilitiesChevronClass} height={30} width={30} />
                      </div>
                    </div>
                    <div className={incompatibilitiesClass}>
                      <div className="font-extralight text-15 pb-20 pr-20">
                        <p>Folgende Unverträglichkeiten haben wir bei diesem Rezept erkannt. </p>
                        <p>Du kannst diese bei Bedarf anpassen.</p>
                      </div>
                      {intolerancesOption.map((item: string, index: number) => (
                        <>
                          <SwitchButton
                            key={index}
                            label={item}
                            enabled={
                              currentAddRecipe?.name !== undefined &&
                              typeof currentAddRecipe[item.toLowerCase()] !== undefined
                                ? Boolean(currentAddRecipe[item.toLowerCase()])
                                : false
                            }
                            isBackground={index % 2 === 0}
                            onChange={setIncompatibilities}
                          />
                        </>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div
                      className="flex pt-40 mb-14 cursor-pointer"
                      id="descriptionJumpContainerDesktop"
                      onClick={() => toggleEatingHabits()}
                      onKeyDown={() => toggleEatingHabits()}
                      aria-hidden="true"
                    >
                      <div className="font-light text-2xl">{t('Eating habits')}</div>
                      <div className="pl-5 my-auto">
                        <ChevronDownIcon className={eatingHabitsChevronClass} height={30} width={30} />
                      </div>
                    </div>
                    <div className={eatingHabitsClass}>
                      <div className="font-extralight text-15 pb-20 pr-20">
                        <p>Folgendes Essverhalten passt zu diesem Rezept. </p>
                        <p>Du kannst die Werte bei Bedarf anpassen.</p>
                      </div>
                      {eatingHabitsOption.map((item: string, index: number) => (
                        <>
                          <SwitchButton
                            key={index}
                            label={item}
                            enabled={
                              currentAddRecipe?.name !== undefined &&
                              typeof currentAddRecipe[item.toLowerCase()] !== undefined
                                ? Boolean(currentAddRecipe[item.toLowerCase()])
                                : false
                            }
                            isBackground={index % 2 === 0}
                            onChange={setEatingHabits}
                          />
                        </>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecipeDetail;
