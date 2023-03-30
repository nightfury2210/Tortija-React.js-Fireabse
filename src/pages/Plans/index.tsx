import React, { useContext, useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { PlusIcon, AdjustmentsIcon, XIcon } from '@heroicons/react/outline';
import { MainContext } from 'providers/MainProvider';
import SearchBox from 'components/SearchBox';
import ReactLoading from 'react-loading';
import { Link } from 'react-router-dom';
import { handleOpenClosePopups } from 'shared/functions/global';
import FilterDrawerPlan from './components/FilterDrawerPlan';
import styles from './styles.module.scss';
import Headline from '../../components/Headline';
import NewPlanStep1 from './components/NewPlanStep1';
import NewPlanStep2 from './components/NewPlanStep2';
import NewPlanStep3 from './components/NewPlanStep3';
import PlanSection from './components/PlanSection';
import 'react-image-crop/dist/ReactCrop.css';
import 'react-datepicker/dist/react-datepicker.css';

const Plans: React.FC = () => {
  const { t } = useTranslation();

  const [currentAddPlan, setCurrentAddPlan] = useState<any>({
    startDate: null,
    endDate: null,
    kcal_total: 0,
    carbohydrates_total: 0,
    dayEntries: [],
    protein_total: 0,
    fat_total: 0,
    imageUrl: '',
    ketogen: false,
    vegan: false,
    vegetarian: false,
    egg: false,
    fructose: false,
    histamine: false,
    lactose: false,
    nuts: false,
    peanuts: false,
    sorbitol: false,
    soy: false,
  });

  const [currentSearchQuery, setCurrentSearchQuery] = useState('');
  const [initialIntolerances, changeIncompatibilities] = useState<string[]>([]);
  const [caloriesRange, changeCaloriesRange] = useState({ min: 1000, max: 4500 });
  const [initialNutrition, changeNutrition] = useState<string[]>([]);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const { planList } = useContext(MainContext);
  const [currentPlanExists, setCurrentPlanExists] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<PlanType[]>([]);
  const [createPlanPopupClass, setCreatePlanPopupClass] = useState('hidden');

  const [currentStep, setCurrentStep] = useState('1');

  const recipePopupContentRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const changeNutritionValue = (value: string[] | string) => {
    changeNutrition(value as string[]);
  };

  const changeIntolerancesValue = (value: string[] | string) => {
    changeIncompatibilities(value as string[]);
  };

  const selectCaloriesRange = ([min, max]: number[]) => {
    if (caloriesRange !== { min, max }) {
      changeCaloriesRange({ min, max });
    }
  };

  const filterOpen = () => {
    setFilterOpen(true);
  };

  const changeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSearchQuery(event.target.value);
  };

  const checkCurrentPlanExists = () => {
    planList?.map((plan: PlanType) => plan.startDate && getCurrentPlanData(plan));
  };

  const getCurrentPlanData = (plan: PlanType) => {
    const currentDate = moment();
    const thisStartDate = moment.unix(plan.startDate.seconds).utc();
    const thisEndDate = moment.unix(plan.endDate.seconds).utc();

    if (currentDate.isBetween(thisStartDate, thisEndDate)) {
      setCurrentPlanExists(true);
      setCurrentPlan([plan]);
    }
  };

  useEffect(() => {
    if (planList) checkCurrentPlanExists();
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollIntoView();
      }
    }, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planList]);

  return (
    <>
      <div className={createPlanPopupClass}>
        <div className={styles.backgroundPopupLayer}>
          <div className={styles.editPicturePopup}>
            <div className="flex justify-between pt-20 pl-20">
              <div className="flex">
                <div className="my-auto pr-10">
                  <PlusIcon width={25} height={25} className="text-brownSemiDark mx-auto" />
                </div>
                <div className="text-xl my-auto font-light">Neuen Plan erstellen</div>
              </div>
              <div className="my-auto pr-20">
                <XIcon
                  width={25}
                  height={25}
                  className="text-brownSemiDark mx-auto cursor-pointer"
                  onClick={() => handleOpenClosePopups(setCreatePlanPopupClass, '', 'close')}
                />
              </div>
            </div>
            <div className={styles.editPictureIngridientPopupContent} ref={recipePopupContentRef}>
              <div className="pt-15 pb-30 px-20">
                {currentStep === '1' && (
                  <NewPlanStep1
                    currentStep={setCurrentStep}
                    currentStepValue={currentStep}
                    planState={setCurrentAddPlan}
                    planStateValue={currentAddPlan}
                    popupContainerRef={recipePopupContentRef}
                  />
                )}
                {currentStep === '2' && (
                  <NewPlanStep2
                    currentStep={setCurrentStep}
                    currentStepValue={currentStep}
                    planState={setCurrentAddPlan}
                    planStateValue={currentAddPlan}
                    popupContainerRef={recipePopupContentRef}
                  />
                )}
                {currentStep === '3' && (
                  <NewPlanStep3
                    currentStep={setCurrentStep}
                    currentStepValue={currentStep}
                    planState={setCurrentAddPlan}
                    planStateValue={currentAddPlan}
                    popupContainerRef={recipePopupContentRef}
                    mainPopup={setCreatePlanPopupClass}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.pageWrapperDesktop} ref={scrollContainerRef}>
          <div>
            <header className="sticky top-0 bg-blackDark z-10 pt-30 pb-10">
              <div className="flex justify-between items-center tablet:mb-35 mb-20">
                <Headline level={1}>{t('Plans')}</Headline>
                <div
                  className="flex my-auto p-7 rounded-lg cursor-pointer border-transparent border-2 hover:border-brownSemiDark"
                  onClick={() => handleOpenClosePopups('', setCreatePlanPopupClass, 'open')}
                  onKeyDown={() => handleOpenClosePopups('', setCreatePlanPopupClass, 'open')}
                  aria-hidden="true"
                >
                  <div className="text-sm font-light my-auto">Neuer Plan</div>
                  <div className="my-auto pl-5">
                    <PlusIcon width={25} height={25} className="text-brownSemiDark cursor-pointer" />
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                {!planList ? (
                  <ReactLoading type="bars" width={20} height={20} color="white" />
                ) : (
                  <>
                    {currentPlanExists ? (
                      <>
                        <Link to={`/plans/${currentPlan[0].uid}`}>
                          <img
                            className={styles.mainImage}
                            src="https://static.tortija.de/images/default_plan.jpg"
                            alt=""
                          />
                          <div className="absolute bottom-15 left-20 md:bottom-40 md:left-40">
                            <div className="font-medium md:text-sm text-12">
                              Aktueller Plan -{' '}
                              {moment.unix(currentPlan[0].startDate.seconds).utc().format('DD[.]MM[.]YY')} -{' '}
                              {moment.unix(currentPlan[0].endDate.seconds).utc().format('DD[.]MM[.]YY')}
                            </div>
                            <div className="font-semi-bold md:font-light text-xl md:text-3xl">
                              {currentPlan[0].name}
                            </div>
                          </div>
                        </Link>
                      </>
                    ) : (
                      <>
                        <img
                          className={styles.mainImageWithoutPlan}
                          src="https://static.tortija.de/images/default_plan.jpg"
                          alt=""
                        />
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="font-medium text-2xl pb-10">Aktuell hast du keinen Plan</div>
                          <div className="font-light">
                            Klicke hier um einen neuen Plan zu erstellen oder wähle rechts aus der Liste der
                            Beispielpläne einen passenden Plan aus
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </header>

            <div className="flex pb-30 md:hidden">
              <div className="flex-1">
                <SearchBox onChange={changeSearch} searchValue={currentSearchQuery} />
              </div>
              <div className="my-auto pl-15">
                <AdjustmentsIcon
                  width={28}
                  height={28}
                  onClick={filterOpen}
                  className="text-brownSemiDark cursor-pointer transform rotate-90"
                />
              </div>
            </div>
          </div>
          <div className="md:hidden relative">
            {!planList ? (
              <ReactLoading type="bars" width={20} height={20} color="white" />
            ) : (
              <>
                {currentPlanExists ? (
                  <>
                    <img className={styles.mainImage} src="https://static.tortija.de/images/default_plan.jpg" alt="" />
                    <div className="absolute bottom-15 left-20 md:bottom-40 md:left-40">
                      <div className="font-medium md:text-sm text-12">
                        Aktueller Plan - {moment.unix(currentPlan[0].startDate.seconds).utc().format('DD[.]MM[.]YY')} -{' '}
                        {moment.unix(currentPlan[0].endDate.seconds).utc().format('DD[.]MM[.]YY')}
                      </div>
                      <div className="font-semi-bold md:font-light text-xl md:text-3xl">{currentPlan[0].name}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <img
                      className={styles.mainImageWithoutPlan}
                      src="https://static.tortija.de/images/default_plan.jpg"
                      alt=""
                    />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="font-medium text-2xl pb-10">Aktuell hast du keinen Plan</div>
                      <div className="font-light">
                        Klicke hier um einen neuen Plan zu erstellen oder wähle rechts aus der Liste der Beispielpläne
                        einen passenden Plan aus
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
          <div className={styles.planRightWrapper}>
            <div className={styles.planWrapper}>
              <div className={styles.planContent}>
                <div className="hidden md:flex pt-50">
                  <div className="flex-1">
                    <SearchBox onChange={changeSearch} searchValue={currentSearchQuery} />
                  </div>
                  <div className="my-auto pl-15">
                    <AdjustmentsIcon
                      width={28}
                      height={28}
                      onClick={filterOpen}
                      className="text-brownSemiDark cursor-pointer transform rotate-90"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between pt-40">
                    <div className="font-light text-2xl">{t('Browse')}</div>
                  </div>
                  <div className="pt-20">
                    <PlanSection
                      initialNutrition={initialNutrition}
                      initialIntolerances={initialIntolerances}
                      caloriesRange={caloriesRange}
                      searchValue={currentSearchQuery}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FilterDrawerPlan
        isFilterOpen={isFilterOpen}
        closeFilterOpen={setFilterOpen}
        initialNutrition={initialNutrition}
        changeNutrition={changeNutritionValue}
        initialIntolerances={initialIntolerances}
        changeIncompatibilities={changeIntolerancesValue}
        caloriesRange={caloriesRange}
        selectCaloriesRange={selectCaloriesRange}
      />
    </>
  );
};

export default Plans;
