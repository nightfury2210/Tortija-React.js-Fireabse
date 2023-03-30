import React, { useState, useEffect, useRef, useMemo, useContext } from 'react';
import Button from 'components/Button';
import Select, { OptionTypeBase } from 'react-select';
import { useTranslation } from 'react-i18next';
import { XIcon, PlusIcon, SearchIcon, PencilIcon } from '@heroicons/react/outline';
import SearchBox from 'components/SearchBox';
import CustomUserInput from 'components/CustomUserInput';
import { toast } from 'react-toast';
import { scrollToTop } from 'shared/functions/global';
import _ from 'lodash';
import { MainContext } from 'providers/MainProvider';
import { customSelectStyles } from 'shared/constants/global';
import IngridientItem from '../IngridientItem';
import RecipeStepSwitch from '../RecipeStepSwitch';
import styles from './styles.module.scss';

type Props = {
  className?: string;
  currentStep?: any;
  currentStepValue?: string;
  recipeState?: any;
  recipeStateValue?: any;
  mainPopup?: any;
  popupContainerRef?: any;
};

const NewRecipeStep3: React.FC<Props> = ({
  currentStep,
  currentStepValue,
  recipeState,
  recipeStateValue,
  mainPopup,
  popupContainerRef,
}) => {
  const [visible, setVisible] = useState('block');
  const { t } = useTranslation();

  const searchIngridientRef = useRef<HTMLInputElement>(null);
  const editIngridientRef = useRef<HTMLInputElement>(null);

  const { ingredientList } = useContext(MainContext);

  const [recipeChanged, setRecipeChanged] = useState(false);
  const [directAddedIngridients, setDirectAddedIngridients] = useState<any[]>([]);

  const [popupOverlayClass, setPopupOverlayClass] = useState('hidden');
  const [editPopupOverlayClass, setEditPopupOverlayClass] = useState('hidden');
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');
  const [currentIngridientSearchApi, setCurrentIngridientSearchApi] = useState({ foods: { food: [{}] } as any });
  const [currentIngridientSearchAutocomplete, setCurrentIngridientSearchAutocomplete] = useState({
    suggestions: { suggestion: [''] },
  });
  const [currentIngridientSearch, setCurrentIngridientSearch] = useState(false);
  const [currentEditIngridientAmount, setCurrentEditIngridientAmount] = useState('1');
  const [currentEditInitialIngridientAmount, setCurrentEditInitialIngridientAmount] = useState('1');
  const [currentEditIngridientID, setCurrentEditIngridientID] = useState('1');
  const [currentEditIngridientName, setCurrentEditIngridientName] = useState('');
  const [currentEditIngridientType, setCurrentEditIngridientType] = useState('');
  const [currentEditIngridientPiece, setCurrentEditIngridientPiece] = useState('g');
  const [currentEditIngridientDefaultPiece, setCurrentEditIngridientDefaultPiece] = useState('g');

  const [currentEditIngridientPreselectG, setCurrentEditIngridientPreselectG] = useState('');
  const [currentEditIngridientKcal100g, setCurrentEditIngridientKcal100g] = useState('');
  const [currentEditIngridientCarbohydrates100g, setCurrentEditIngridientCarbohydrates100g] = useState('');
  const [currentEditIngridientProtein100g, setCurrentEditIngridientProtein100g] = useState('');
  const [currentEditIngridientFat100g, setCurrentEditIngridientFat100g] = useState('');
  const [currentEditIngridientCategory, setCurrentEditIngridientCategory] = useState('');

  const [currentEditIngridientImageUrl, setCurrentEditIngridientImageUrl] = useState('');
  const [currentEditIngridientKcalTotal, setCurrentEditIngridientKcalTotal] = useState(0);
  const [currentEditIngridientCarbohydratesTotal, setCurrentEditIngridientCarbohydratesTotal] = useState(0);
  const [currentEditIngridientProteinTotal, setCurrentEditIngridientProteinTotal] = useState(0);
  const [currentEditIngridientFatTotal, setCurrentEditIngridientFatTotal] = useState(0);
  const [currentEditIngridientKcalValue, setCurrentEditIngridientKcalValue] = useState(0);

  const [currentEditIngridientCarbohydratesValue, setCurrentEditIngridientCarbohydratesValue] = useState(0);
  const [currentEditIngridientProteinValue, setCcurrentEditIngridientProteinValue] = useState(0);
  const [currentEditIngridientFatValue, setCurrentEditIngridientFatValue] = useState(0);
  const [currentEditIngridientPortionValues, setCurrentEditIngridientPortionValues] = useState<OptionTypeBase[]>([]);

  const [accessToken, setAccessToken] = useState('');

  const [initialIncompatibilitiesOptions, changeIncompatibilitiesOptions] = useState<any>({
    celery: false,
    egg: false,
    fructose: false,
    histamine: false,
    lactose: false,
    nuts: false,
    peanuts: false,
    sorbitol: false,
    soy: false,
    thermomix: false,
    wheat: false,
    gluten: false,
  });

  const ingredientFilteredList = useMemo(
    () => ingredientList?.filter(element => element.name.toLowerCase().includes(currentSearchQuery.toLowerCase())),
    [ingredientList, currentSearchQuery]
  );

  const editIngridientNameRef = useRef<HTMLDivElement>(null);

  function jumpToNextStep(currentObject: object) {
    if (recipeStateValue?.ingredients.length === 0) {
      toast.warn(t('Select Ingredients'));
    } else {
      let IncompatibilitiesObject = initialIncompatibilitiesOptions;
      const checkIncompabilityArray = [] as any;

      // check incombality options of ingredients
      for (let i = 0; i < recipeStateValue.ingredients.length; i += 1) {
        const getIngridient = ingredientList?.find(item => item.name === recipeStateValue.ingredients[i].name);

        Object.keys(initialIncompatibilitiesOptions).forEach(function (key) {
          if ((getIngridient![key] as any) === true) {
            checkIncompabilityArray.push({ name: [key], status: true });
          }
        });
      }

      for (let f = 0; f < checkIncompabilityArray.length; f += 1) {
        IncompatibilitiesObject = { ...IncompatibilitiesObject, [checkIncompabilityArray[f].name]: true };
      }

      const newColumns = {
        ...currentObject,
        ...IncompatibilitiesObject,
      };

      recipeState(newColumns);
      setVisible('hidden');
      currentStep('4');
    }
  }

  // Get FatSecret Autocomplete results
  const ingridientAutoCompleteSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSearchQuery(event.target.value);
    ingridientAutoCompleteSearchExecute();
  };

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

    const newColumns = {
      ...recipeStateValue,
      kcal_total: thisCurrentKcalComplete,
      carbohydrates_total: thisCurrentKHComplete,
      protein_total: thisCurrentEWComplete,
      fat_total: thisCurrentFTComplete,
      ingredients: [...recipeStateValue.ingredients, thisIngridientObject],
    };

    handleOpenClosePopups(setEditPopupOverlayClass, '', 'close');
    handleOpenClosePopups(setPopupOverlayClass, '', 'close');

    setCurrentIngridientSearch(false);
    setCurrentSearchQuery('');
    // this.setState({ currentIngridientPieceIdentifier: '' });
    setCurrentIngridientSearchAutocomplete({ suggestions: { suggestion: [''] } });
    if (!Number.isNaN(amount)) {
      updateRecipeState(newColumns);
    } else {
      toast.error('Die eigegebenen Daten enthielten Fehler!');
    }
    setVisible('block');
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
      getIngridientRecipeData = recipeStateValue?.ingredients.filter(
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

    recipeState(newColumns);
    setEditPopupOverlayClass('hidden');
    setPopupOverlayClass('hidden');
    setVisible('block');
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

    if (currentEditIngridientType === 'notAdded') {
      getIngridientRecipeData = ingredientList?.filter((item: any) => item.name === currentEditIngridientName);
    } else {
      getIngridientRecipeData = recipeStateValue?.ingredients.filter(
        (item: any) => item.id === currentEditIngridientID
      );
    }

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

  // Update general recipe state
  function updateRecipeState(stateObject: any): void {
    console.log(stateObject);
    recipeState(stateObject);
  }

  function calculatePortionGramm() {
    let thisPortionG = 0;

    recipeStateValue?.ingredients.map((ingridient: any) => {
      if (ingridient.piece !== 'g' && ingridient.piece !== 'ml') {
        thisPortionG = Math.round(thisPortionG + parseFloat(ingridient.amount) * parseFloat(ingridient.preselect_g));
      } else {
        thisPortionG = Math.round(thisPortionG + parseFloat(ingridient.amount));
      }
      return null;
    });

    const newColumns = {
      ...recipeStateValue,
      portion_g: thisPortionG.toString(),
    };

    jumpToNextStep(newColumns);
  }

  function returnToPreviousStep() {
    setVisible('hidden');
    currentStep('2');
  }

  function clickIngridientChange() {
    if (editIngridientRef.current) {
      editIngridientRef.current.select();
    }
  }

  useEffect(() => {
    fetch('https://static.tortija.de/interfaces/apis/getIngridientApiToken.php')
      .then(res => res.json())
      .then(data => {
        setAccessToken(data.access_token);
      });

    if (currentStepValue !== '3') {
      setVisible('hidden');
    }

    console.log(recipeStateValue);

    if (searchIngridientRef.current && popupOverlayClass === 'block') {
      searchIngridientRef.current.select();
      scrollToTop(popupContainerRef);
    }

    if (editIngridientRef.current && editPopupOverlayClass === 'block') {
      editIngridientRef.current.select();
    }
  }, [currentStepValue, popupOverlayClass, recipeStateValue, editPopupOverlayClass, popupContainerRef]);

  return (
    <>
      <div className={popupOverlayClass}>
        <div className={styles.backgroundPopupLayer2}>
          <div className={styles.addIngridientPopup2}>
            <div className="flex justify-between pt-20 pl-20">
              <div>
                <div className="text-xl my-auto font-light">Suche hier nach deinen Zutaten</div>
              </div>
              <div className="my-auto pr-20">
                <XIcon
                  width={25}
                  height={25}
                  className="text-brownSemiDark mx-auto cursor-pointer"
                  onClick={() => handleOpenClosePopups(setPopupOverlayClass, setVisible, 'both')}
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
                  <>
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
                  </>
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
              <div className={styles.ingridientPopupContent}>
                {currentIngridientSearch && ingredientFilteredList?.length === 0 && (
                  <div className="font-extralight px-20">
                    <p>Es wurden leider keine Lebensmittel zu deinem Suchbegriff gefunden.</p>
                    <p className="pt-10">Bitte versuche es mit einem anderen Suchbegriff.</p>
                  </div>
                )}
                {currentIngridientSearch &&
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
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={editPopupOverlayClass}>
        <div className={styles.backgroundPopupLayer2}>
          <div className={styles.addIngridientPopup2}>
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
                            thisValue={currentEditIngridientAmount}
                            name="amount"
                            submitFunction={() =>
                              addIngridientDirectInternal(
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
                                currentEditIngridientPiece,
                                currentEditIngridientDefaultPiece
                              )
                            }
                            onChange={e => changeIngridientAmount(e)}
                            onClick={clickIngridientChange}
                            width={currentEditIngridientAmount.length}
                          />
                        </>
                      )}
                      {currentEditIngridientType !== 'notAdded' && (
                        <CustomUserInput
                          thisRef={editIngridientRef}
                          name="amount"
                          thisValue={currentEditIngridientAmount}
                          submitFunction={() => changeIngridientExecute()}
                          onChange={e => changeIngridientAmount(e)}
                          onClick={clickIngridientChange}
                          width={currentEditIngridientAmount.length}
                        />
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
                          onChange={e => changeIngridientPiece(e)}
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
                        addIngridientDirectInternal(
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
                    <Button className="w-full" onClick={() => changeIngridientExecute()}>
                      {t('Save')}
                    </Button>
                  )}
                  {currentEditIngridientType === 'notAdded' && (
                    <Button
                      className="w-full"
                      onClick={() =>
                        addIngridientDirectInternal(
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
                          currentEditIngridientPiece,
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

      <div className={visible}>
        <div className="pt-20 font-light text-base">Bitte tragen Sie die Zutaten für das neue Rezept ein!</div>
        <div className="flex gap-40 pt-4">
          <div className="font-light text-2xl">Nährwertangabe</div>
        </div>
        <div className="flex w-full gap-4 sticky py-4 top-0 z-10">
          <div className="flex-1 text-center">
            <div className="font-semibold text-base">{Math.round(parseFloat(recipeStateValue?.kcal_total!))}</div>
            <div className={styles.recipeLabel}>kcal</div>
          </div>
          <div className="flex-1 text-center">
            <div className="font-semibold text-base">
              {Math.round(parseFloat(recipeStateValue?.carbohydrates_total!))}g
            </div>
            <div className={styles.recipeLabel}>{t('Carbohydrates')}</div>
          </div>
          <div className="flex-1 text-center">
            <div className="font-semibold text-base">{Math.round(parseFloat(recipeStateValue?.protein_total!))}g</div>
            <div className={styles.recipeLabel}>{t('Protein')}</div>
          </div>
          <div className="flex-1 text-center">
            <div className="font-semibold text-base">{Math.round(parseFloat(recipeStateValue?.fat_total!))}g</div>
            <div className={styles.recipeLabel}>{t('Fat')}</div>
          </div>
        </div>
        <div className="flex gap-40 pt-4">
          <div className="font-light text-2xl">{t('IngredientsList')}</div>
        </div>
        <div
          className="flex pt-10 gap-5 cursor-pointer"
          onClick={() => handleOpenClosePopups(setVisible, setPopupOverlayClass, 'both')}
          onKeyDown={() => handleOpenClosePopups(setVisible, setPopupOverlayClass, 'both')}
          aria-hidden="true"
        >
          <div>
            <PlusIcon width={25} height={25} className="text-brownSemiDark mx-auto" />
          </div>
          <div>Neue Zutat hinzufügen</div>
        </div>
        <div className="pt-20 pb-80">
          {recipeStateValue?.ingredients.map((ingridient: any) => (
            <>
              <IngridientItem
                ingridientData={ingridient}
                recipeData={recipeStateValue}
                updateFunction={recipeState}
                defaultValue={ingridient.amount}
                setRecipeChanged={setRecipeChanged}
                setDirectAddedIngridients={setDirectAddedIngridients}
                directAddedIngridients={directAddedIngridients}
              />
            </>
          ))}
        </div>
        <RecipeStepSwitch
          returnFunction={returnToPreviousStep}
          nextFunction={calculatePortionGramm}
          currentStepValue="3"
          totalSteps={6}
        />
      </div>
    </>
  );
};

export default NewRecipeStep3;
