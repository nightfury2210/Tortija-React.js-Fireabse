import React, { useContext, useEffect, useState, useRef } from 'react';
import Headline from 'components/Headline';
import { useTranslation } from 'react-i18next';
import { AdjustmentsIcon, PlusIcon, XIcon, PencilIcon, HeartIcon } from '@heroicons/react/outline';
import SwitchSelector from 'react-switch-selector';
import { scrollToTop } from 'shared/functions/global';
import Header from 'components/Header';
import SearchBox from 'components/SearchBox';
import classNames from 'classnames';
import { FilterContext } from 'providers/FilterProvider';
import { useLocation } from 'react-router-dom';
import ClosePopup from './components/ClosePopup';

import RecipeSection from './components/RecipeSection';
import FilterDrawer from './components/FilterDrawer';
import IngridientForm from './components/IngridientForm';
import IngredientSection from './components/IngredientSection';
import NewRecipeStep1 from './components/NewRecipeStep1';
import NewRecipeStep2 from './components/NewRecipeStep2';
import NewRecipeStep3 from './components/NewRecipeStep3';
import NewRecipeStep4 from './components/NewRecipeStep4';
import NewRecipeStep5 from './components/NewRecipeStep5';
import NewRecipeStep6 from './components/NewRecipeStep6';
import 'react-image-crop/dist/ReactCrop.css';
import styles from './styles.module.scss';

const Nutrition: React.FC = () => {
  const { t } = useTranslation();
  const [isFilterOpen, setFilterOpen] = useState(false);
  const { nutritionSearchValue, setNutritionSearchValue } = useContext(FilterContext);

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

  const filterOpen = () => {
    setFilterOpen(true);
  };

  const [filterType, setFilterType] = useState(recipesOption[0].value);
  const [currentSection, setCurrentSection] = useState<any>(recipesOption[0].value);

  const [currentIngridientList, setCurrentIngridientList] = useState<any>([]);

  const [currentEditIngridientObject, setCurrentEditIngridientObject] = useState<any>({});

  const [currentStep, setCurrentStep] = useState('1');

  const [newIngridientOverlayClass, setNewIngridientOverlayClass] = useState('hidden');
  const [editIngridientOverlayClass, setEditIngridientOverlayClass] = useState('hidden');
  const [newRecipeOverlayClass, setNewRecipeOverlayClass] = useState('hidden');
  const [closeRecipeOverlayClass, setCloseRecipeOverlayClass] = useState('hidden');
  const [closeIngredientOverlayClass, setCloseIngredientOverlayClass] = useState('hidden');

  const ingredientPopupContentRef = useRef<HTMLDivElement>(null);
  const recipePopupContentRef = useRef<HTMLDivElement>(null);

  const location = useLocation<LocationState>();

  const changeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNutritionSearchValue(event.target.value);
  };

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

  function closeIngredientPopup() {
    setCloseIngredientOverlayClass('block');
  }

  function closeIngredient() {
    setNewIngridientOverlayClass('hidden');
    setCloseIngredientOverlayClass('hidden');
  }

  function reOpenIngredient() {
    setCloseIngredientOverlayClass('hidden');
  }

  function handleCreateNewItem() {
    if (currentSection === 'recipes') {
      setCurrentStep('1');
      setCurrentAddRecipe({
        ingredients: [],
        description: [],
        kcal_total: '0',
        carbohydrates_total: '0',
        protein_total: '0',
        fat_total: '0',
        flexitarian: true,
        vegetarian: false,
        ketogen: false,
        vegan: false,
      });

      setNewRecipeOverlayClass('block');
    } else {
      setNewIngridientOverlayClass('block');
      scrollToTop(ingredientPopupContentRef);
    }
  }

  useEffect(() => {
    let thisScrollPos = 0;

    if (location.state?.scrollPos !== undefined) {
      thisScrollPos = location.state.scrollPos;
      setTimeout(() => {
        document.getElementById('mainContainer')?.scrollTo(0, thisScrollPos);
      }, 1);
    }
  }, []);

  return (
    <>
      <div className={newIngridientOverlayClass}>
        <div className={styles.backgroundPopupLayer}>
          <div className={styles.editIngridientPopup}>
            <div className="flex justify-between pt-20 pl-20">
              <div className="flex">
                <div className="my-auto pr-10">
                  <PlusIcon width={25} height={25} className="text-brownSemiDark mx-auto" />
                </div>
                <div className="text-xl my-auto font-light">Neues Lebensmittel hinzufügen</div>
              </div>
              <div className="my-auto pr-20">
                <XIcon
                  width={25}
                  height={25}
                  className="text-brownSemiDark mx-auto cursor-pointer"
                  onClick={() => closeIngredientPopup()}
                />
              </div>
            </div>
            <div className={styles.editIngridientPopupContent} ref={ingredientPopupContentRef}>
              <div className="pt-15  pb-30">
                {newIngridientOverlayClass === 'block' && (
                  <IngridientForm
                    overlayClassFunc={setNewIngridientOverlayClass}
                    ingridientState={setCurrentIngridientList}
                    ingridientStateValue={currentIngridientList}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={editIngridientOverlayClass}>
        <div className={styles.backgroundPopupLayer}>
          <div className={styles.editIngridientPopup}>
            <div className="flex justify-between pt-20 pl-20">
              <div className="flex">
                <div className="my-auto pr-10">
                  <PencilIcon width={25} height={25} className="text-brownSemiDark mx-auto" />
                </div>
                <div className="text-xl my-auto font-light">Lebensmittel bearbeiten</div>
              </div>
              <div className="my-auto pr-20">
                <XIcon
                  width={25}
                  height={25}
                  className="text-brownSemiDark mx-auto cursor-pointer"
                  onClick={() => setEditIngridientOverlayClass('hidden')}
                />
              </div>
            </div>
            <div className={styles.editIngridientPopupContent} ref={ingredientPopupContentRef}>
              <div className="pt-15  pb-30">
                {editIngridientOverlayClass === 'block' && (
                  <IngridientForm
                    overlayClassFunc={setEditIngridientOverlayClass}
                    ingridientState={setCurrentIngridientList}
                    ingridientStateValue={currentIngridientList}
                    type="edit"
                    editIngridientObject={currentEditIngridientObject}
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
      <div className={closeIngredientOverlayClass}>
        <ClosePopup closeFunction={closeIngredient} reOpenFunction={reOpenIngredient} />
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
      <Header>
        <div className={styles.headerInner}>
          <div className={styles.headlineWrapper}>
            <Headline level={1} className="absolute left-0">
              {t('Nutrition')}
            </Headline>
            <div className={styles.searchContainer}>
              <SearchBox onChange={changeSearch} className={styles.searchDesktop} searchValue={nutritionSearchValue} />
              <div
                role="button"
                aria-hidden
                className={classNames('flex items-center space-x-3', {
                  invisible: currentSection === 'food',
                })}
                onClick={filterOpen}
              >
                <AdjustmentsIcon
                  width={28}
                  height={28}
                  aria-hidden="true"
                  className={classNames(styles.filterIcon, {
                    invisible: currentSection === 'food',
                  })}
                />
                <Headline level={3}>{t('Filter')}</Headline>
              </div>
            </div>
          </div>
          <SearchBox onChange={changeSearch} searchValue={nutritionSearchValue} className={styles.searchMobile} />
          <div className={styles.switchContainer}>
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
        </div>
      </Header>
      <div className={styles.container}>
        <div className={styles.contentHeader}>
          <Headline level={3}>{t('Browse')}</Headline>
          <div onClick={() => {}} aria-hidden="true" className="cursor-pointer">
            <PlusIcon width={28} height={28} className="text-brownSemiDark" onClick={() => handleCreateNewItem()} />
          </div>
        </div>
        {currentSection === 'recipes' ? (
          <RecipeSection />
        ) : (
          <IngredientSection
            ingridientState={setCurrentIngridientList}
            ingridientStateValue={currentIngridientList}
            editPopup={setEditIngridientOverlayClass}
            editIngridientObject={setCurrentEditIngridientObject}
          />
        )}
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

export default Nutrition;
