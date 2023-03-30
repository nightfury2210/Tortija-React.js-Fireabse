import React, { useState, useRef } from 'react';
import {
  PlusIcon,
  DotsVerticalIcon,
  XIcon,
  DocumentDuplicateIcon,
  RefreshIcon,
  PlusCircleIcon,
  CogIcon,
  SwitchHorizontalIcon,
  CalendarIcon,
} from '@heroicons/react/outline';
import Select, { OptionTypeBase } from 'react-select';
import { customSelectStyles } from 'shared/constants/global';
import Button from 'components/Button';
import { handleOpenClosePopups } from 'shared/functions/global';
import { toast } from 'react-toast';
import DatePicker from 'react-datepicker';
import Card from 'components/Card';
import moment from 'moment';
import Checkbox from 'components/Checkbox';
import EditMealItem from '../EditMealItem';
import styles from './styles.module.scss';

type Props = {
  thisId?: number;
  label?: string;
  mealType?: string;
  planObject?: any;
  planState?: any;
  planStateValue?: any;
  dayId?: number;
  planDateArray?: any;
  copyItemState?: any;
  popupDynamicAddCopyClass?: any;
  addItemState?: any;
  newRecipeOverlayClass?: any;
  currentRecipeStep?: any;
  scrollRef?: any;
  openIngredientSearchPopupClass?: any;
  setMealType?: any;
};

const EditMealCard: React.FC<Props> = ({
  label,
  mealType = '',
  planObject,
  planState,
  planStateValue,
  dayId,
  planDateArray,
  copyItemState,
  popupDynamicAddCopyClass,
  addItemState,
  newRecipeOverlayClass,
  currentRecipeStep,
  scrollRef,
  openIngredientSearchPopupClass,
  setMealType,
}) => {
  const [actionClass, setActionClass] = useState('hidden');

  const [currentMoveMealTypeValue, setCurrentMoveMealTypeValue] = useState('breakfast');
  const [moveRecipePopupClass, setMoveRecipePopupClass] = useState('hidden');

  const [currentCopyMealTypeValue, setCurrentCopyMealTypeValue] = useState('breakfast');
  const [copyRecipePopupClass, setCopyRecipePopupClass] = useState('hidden');
  const [startDate, setStartDate] = useState(null);
  const changeCopyDate = (dates: any) => {
    setStartDate(dates);
  };
  const CustomInput = (props: React.HTMLProps<HTMLInputElement>, ref: React.Ref<HTMLInputElement>) => {
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
  const [currentCopyTypeValue, setCurrentCopyTypeValue] = useState('date');

  const [currentId, setCurrentId] = useState(0);
  const [currentType, setCurrentType] = useState('');

  const mealTypeValues: OptionTypeBase[] = [
    { value: 'breakfast', label: 'Frühstück' },
    { value: 'lunch', label: 'Mittagessen' },
    { value: 'dinner', label: 'Abendessen' },
    { value: 'snacks', label: 'Snacks' },
  ];

  const copyTypeValues: OptionTypeBase[] = [
    { value: 'date', label: 'Auf ein bestimmtes Datum kopieren' },
    { value: 'days', label: 'Auf bestimmte Wochentage kopieren' },
    { value: 'all', label: 'In jeden Tag kopieren' },
  ];

  function copyMeal() {
    copyItemState(planObject?.[mealType]);
    popupDynamicAddCopyClass('block');
    setActionClass('hidden');
  }

  function addNewMealRecipe() {
    const calculatedKcalTotalFromIngredients = planObject?.[mealType].ingredients.reduce((prev: any, current: any) => {
      return parseFloat(prev) + parseFloat(current.kcal_total);
    }, 0);

    const calculatedCarbohydratesTotalFromIngredients = planObject?.[mealType].ingredients.reduce(
      (prev: any, current: any) => {
        return parseFloat(prev) + parseFloat(current.carbohydrates_total);
      },
      0
    );

    const calculatedProteinTotalFromIngredients = planObject?.[mealType].ingredients.reduce(
      (prev: any, current: any) => {
        return parseFloat(prev) + parseFloat(current.protein_total);
      },
      0
    );

    const calculatedFatTotalFromIngredients = planObject?.[mealType].ingredients.reduce((prev: any, current: any) => {
      return parseFloat(prev) + parseFloat(current.fat_total);
    }, 0);

    currentRecipeStep('1');
    addItemState({
      ingredients: [...planObject?.[mealType].ingredients],
      description: [],
      kcal_total: calculatedKcalTotalFromIngredients,
      carbohydrates_total: calculatedCarbohydratesTotalFromIngredients,
      protein_total: calculatedProteinTotalFromIngredients,
      fat_total: calculatedFatTotalFromIngredients,
      flexitarian: true,
      vegetarian: false,
      ketogen: false,
      vegan: false,
    });

    newRecipeOverlayClass('block');

    setActionClass('hidden');
  }

  function copyRecipe() {
    const getYear = moment(startDate).format('YYYY');
    const getMonth = moment(startDate).format('MM');
    const getDay = moment(startDate).format('DD');
    const mergedDate = getYear + getMonth + getDay;
    let planExists = false;
    let thisCopyDayId = 0;

    let thisCopyTypeValue = currentCopyMealTypeValue;
    if (thisCopyTypeValue === undefined || thisCopyTypeValue.length === 0) {
      thisCopyTypeValue = 'breakfast';
    }

    if (currentCopyTypeValue === 'date') {
      const dayExistsInPlan = planStateValue?.dayEntries?.filter((item: any) => {
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

      if (planExists) {
        handleOpenClosePopups(setCopyRecipePopupClass, '', 'close');
        const thisItemType = planObject?.[mealType][currentType].filter((item: any) => item.id === currentId)[0];

        const newColumnsAdd = {
          ...planStateValue,
          dayEntries: planStateValue.dayEntries.map((entries: any) => {
            if (parseFloat(entries.id) !== thisCopyDayId) return entries;
            return {
              ...entries,
              kcal_total: parseFloat(entries.kcal_total) + parseFloat(thisItemType.kcal_total),
              carbohydrates_total:
                parseFloat(entries.carbohydrates_total) + parseFloat(thisItemType.carbohydrates_total),
              protein_total: parseFloat(entries.protein_total) + parseFloat(thisItemType.protein_total),
              fat_total: parseFloat(entries.fat_total) + parseFloat(thisItemType.fat_total),
              [thisCopyTypeValue]: {
                ...entries[thisCopyTypeValue],
                [currentType]: [...entries[thisCopyTypeValue][currentType], thisItemType],
              },
            };
          }),
        };

        const newColumnsSetNewIds = {
          ...newColumnsAdd,
          dayEntries: newColumnsAdd.dayEntries.map((entries: any) => {
            if (parseFloat(entries.id) !== thisCopyDayId) return entries;
            return {
              ...entries,
              [thisCopyTypeValue]: {
                ...entries[thisCopyTypeValue],
                [currentType]: entries[thisCopyTypeValue][currentType].map((item: any, index: any) => {
                  return {
                    ...item,
                    id: index,
                  };
                }),
              },
            };
          }),
        };

        toast.success('Das Rezept wurde erfolgreich kopiert!');
        planState(newColumnsSetNewIds);
        setCurrentCopyMealTypeValue('breakfast');
        setCurrentCopyTypeValue('date');
      } else {
        toast.error('Dieses Datum existiert nicht in dem Plan. Bitte wähle ein anderes Datum!');
      }
    } else if (currentCopyTypeValue === 'all') {
      handleOpenClosePopups(setCopyRecipePopupClass, '', 'close');
      const thisItemType = planObject?.[mealType][currentType].filter((item: any) => item.id === currentId)[0];

      const newColumnsAdd = {
        ...planStateValue,
        dayEntries: planStateValue.dayEntries.map((entries: any) => {
          if (parseFloat(entries.id) === dayId) return entries;
          return {
            ...entries,
            kcal_total: parseFloat(entries.kcal_total) + parseFloat(thisItemType.kcal_total),
            carbohydrates_total: parseFloat(entries.carbohydrates_total) + parseFloat(thisItemType.carbohydrates_total),
            protein_total: parseFloat(entries.protein_total) + parseFloat(thisItemType.protein_total),
            fat_total: parseFloat(entries.fat_total) + parseFloat(thisItemType.fat_total),
            [thisCopyTypeValue]: {
              ...entries[thisCopyTypeValue],
              [currentType]: [...entries[thisCopyTypeValue][currentType], thisItemType],
            },
          };
        }),
      };

      const newColumnsSetNewIds = {
        ...newColumnsAdd,
        dayEntries: newColumnsAdd.dayEntries.map((entries: any) => {
          if (parseFloat(entries.id) === dayId) return entries;
          return {
            ...entries,
            [thisCopyTypeValue]: {
              ...entries[thisCopyTypeValue],
              [currentType]: entries[thisCopyTypeValue][currentType].map((item: any, index: any) => {
                return {
                  ...item,
                  id: index,
                };
              }),
            },
          };
        }),
      };

      toast.success('Das Rezept wurde erfolgreich in jeden Tag kopiert!');
      planState(newColumnsSetNewIds);
      setCurrentCopyMealTypeValue('breakfast');
      setCurrentCopyTypeValue('date');
    }
  }

  function moveRecipe() {
    handleOpenClosePopups(setMoveRecipePopupClass, '', 'close');

    let thisMoveTypeValue = currentMoveMealTypeValue;
    if (thisMoveTypeValue === undefined || thisMoveTypeValue.length === 0) {
      thisMoveTypeValue = 'breakfast';
    }

    const thisItemType = planObject?.[mealType][currentType].filter((item: any) => item.id === currentId)[0];

    if (mealType !== thisMoveTypeValue && thisItemType !== undefined) {
      const newColumns = {
        ...planStateValue,
        dayEntries: planStateValue?.dayEntries.map((entries: any) => {
          if (parseFloat(entries.id) !== dayId) return entries;
          return {
            ...entries,
            [mealType]: {
              ...entries[mealType],
              [currentType]: [
                ...entries[mealType][currentType].filter(
                  (item: any) => parseFloat(item.id) !== parseFloat(thisItemType.id)
                ),
              ],
            },
          };
        }),
      };

      const newColumnsAdd = {
        ...newColumns,
        dayEntries: newColumns.dayEntries.map((entries: any) => {
          if (parseFloat(entries.id) !== dayId) return entries;
          return {
            ...entries,
            [thisMoveTypeValue]: {
              ...entries[thisMoveTypeValue],
              [currentType]: [...entries[thisMoveTypeValue][currentType], thisItemType],
            },
          };
        }),
      };

      const newColumnsSetNewIds = {
        ...newColumnsAdd,
        dayEntries: newColumnsAdd.dayEntries.map((entries: any) => {
          if (parseFloat(entries.id) !== dayId) return entries;
          return {
            ...entries,
            [thisMoveTypeValue]: {
              ...entries[thisMoveTypeValue],
              [currentType]: entries[thisMoveTypeValue][currentType].map((item: any, index: any) => {
                return {
                  ...item,
                  id: index,
                };
              }),
            },
          };
        }),
      };

      toast.success('Das Rezept wurde erfolgreich verschoben!');
      planState(newColumnsSetNewIds);
      setCurrentMoveMealTypeValue('breakfast');
    } else {
      toast.error('Bitte wähle eine andere Mahlzeit aus');
    }
  }

  function openSearchPopup(thisMealType: string) {
    setMealType(thisMealType);
    openIngredientSearchPopupClass('block');
  }

  return (
    <>
      <div className="rounded-3xl min-h-400 mx-0 tablet:mx-20 mb-30 p-20 shadow-2xl bg-lightDarkGray relative">
        <div className="flex justify-between">
          <div className="font-semibold  text-22">{planObject?.[mealType].label}</div>
          <div className="my-auto flex justify-between gap-5">
            <div>
              <PlusIcon
                width={28}
                height={28}
                className="text-brownSemiDark cursor-pointer"
                onClick={() => openSearchPopup(mealType)}
              />
            </div>
            <div className="relative">
              <div>
                <DotsVerticalIcon
                  width={28}
                  height={28}
                  className="text-brownSemiDark cursor-pointer"
                  onClick={() => setActionClass('block')}
                />
              </div>
              <div
                className={`absolute bg-lightDarkGray shadow-2xl rounded-xl top-40 w-300 border z-100 border-brownSemiDark transition-opacity duration-1000 ${actionClass} ${styles.actionsMenu}`}
              >
                <div className="pb-20 relative font-extralight">
                  <div className="flex justify-between px-20 pt-20 pb-20">
                    <div className="flex">
                      <div className="my-auto pr-10">
                        <CogIcon width={25} height={25} className="text-brownSemiDark mx-auto" />
                      </div>
                      <div className="text-xl my-auto font-light">Actions-Menü</div>
                    </div>

                    <div>
                      <XIcon
                        width={25}
                        height={25}
                        className="text-brownSemiDark cursor-pointer"
                        onClick={() => setActionClass('hidden')}
                      />
                    </div>
                  </div>
                  <div className="border-transparent border-2 hover:border-brownSemiDark rounded-lg mx-20">
                    <div className="flex justify-between border-b py-7 border-blackSemiDark">
                      <div className=" cursor-pointer px-7">Diese Mahlzeit neu generieren</div>
                      <div>
                        <RefreshIcon width={25} height={25} className="text-brownSemiDark mr-10" />
                      </div>
                    </div>
                  </div>
                  <div className="border-transparent border-2 hover:border-brownSemiDark rounded-lg mx-20">
                    <div
                      className="flex justify-between border-b py-7 border-blackSemiDark cursor-pointer"
                      onClick={() => copyMeal()}
                      onMouseDown={() => copyMeal()}
                      aria-hidden="true"
                    >
                      <div className=" cursor-pointer px-7">Diese Mahlzeit kopieren</div>
                      <div>
                        <DocumentDuplicateIcon width={25} height={25} className="text-brownSemiDark mr-10" />
                      </div>
                    </div>
                  </div>
                  {planObject?.[mealType].ingredients.length > 0 && (
                    <div className="border-transparent border-2 hover:border-brownSemiDark rounded-lg mx-20">
                      <div
                        className="flex justify-between py-7 cursor-pointer"
                        onClick={() => addNewMealRecipe()}
                        onMouseDown={() => addNewMealRecipe()}
                        aria-hidden="true"
                      >
                        <div className=" cursor-pointer px-7">Rezept aus Lebensmitteln erstellen</div>
                        <div>
                          <PlusCircleIcon width={25} height={25} className="text-brownSemiDark mr-10" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-10">
          {planObject?.[mealType].ingredients.length === 0 && planObject?.[mealType].recipes.length === 0 && (
            <div
              className="pt-40"
              onClick={() => openSearchPopup(mealType)}
              onKeyDown={() => openSearchPopup(mealType)}
              aria-hidden="true"
            >
              <Card
                isWithoutImage
                className="border-transparent border-2 hover:border-brownSemiDark cursor-pointer h-220"
              >
                <div className="absolute top-10 left-20 opacity-100 font-semibold text-17">{label}</div>
                <div className={styles.addIcon}>
                  <div className="pt-20">
                    <PlusIcon width={42} height={42} className="text-brownSemiDark cursor-pointer mx-auto" />
                  </div>
                  <div className="text-center font-semibold text-18 px-20 pt-15">Hinzufügen</div>
                </div>
              </Card>
            </div>
          )}
          {planObject?.[mealType].ingredients.map((item: any, index: number) => (
            <EditMealItem
              key={index}
              itemObject={item}
              planState={planState}
              planStateValue={planStateValue}
              type="Lebensmittel"
              dayId={dayId}
              mealType={mealType}
              moveRecipePopupOpener={setMoveRecipePopupClass}
              copyRecipePopupOpener={setCopyRecipePopupClass}
              itemChangeIdState={setCurrentId}
              itemChangeTypeState={setCurrentType}
              scrollRef={scrollRef}
            />
          ))}
          {planObject?.[mealType].recipes.map((item: any, index: number) => (
            <EditMealItem
              key={index}
              itemObject={item}
              planState={planState}
              planStateValue={planStateValue}
              type="Rezept"
              dayId={dayId}
              mealType={mealType}
              moveRecipePopupOpener={setMoveRecipePopupClass}
              copyRecipePopupOpener={setCopyRecipePopupClass}
              itemChangeIdState={setCurrentId}
              itemChangeTypeState={setCurrentType}
              scrollRef={scrollRef}
            />
          ))}
        </div>

        <div className={`absolute top-80 left-0 ${moveRecipePopupClass}`}>
          <div className={styles.movePopup}>
            <div className={styles.editPicturePopup}>
              <div className="flex justify-between pt-20 pl-20">
                <div className="flex">
                  <div className="my-auto pr-10">
                    <SwitchHorizontalIcon width={25} height={25} className="text-brownSemiDark mx-auto" />
                  </div>
                  <div className="text-xl my-auto font-light">Rezept verschieben</div>
                </div>
                <div className="my-auto pr-20">
                  <XIcon
                    width={25}
                    height={25}
                    className="text-brownSemiDark mx-auto cursor-pointer"
                    onClick={() => setMoveRecipePopupClass('hidden')}
                  />
                </div>
              </div>
              <div className={styles.editPictureIngridientPopupContent}>
                <div className="pt-30 font-extralight text-base pl-20 pr-15 pb-50">
                  <div>Bitte wählen Sie aus wohin dieses Rezept verschoben werden soll!</div>
                  <div>
                    <div className="flex gap-20 pt-20">
                      <div className="font-light my-auto w-130">Mahlzeit auswählen:</div>
                      <div className="flex-1">
                        <div>
                          <Select
                            options={mealTypeValues}
                            styles={customSelectStyles}
                            value={mealTypeValues.filter((item: any) => item.value === currentMoveMealTypeValue)}
                            onChange={e => setCurrentMoveMealTypeValue(e?.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pl-20 pr-10 pb-40">
                  <Button className="w-full" onClick={() => moveRecipe()}>
                    Verschieben
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`absolute top-80 left-0 ${copyRecipePopupClass}`}>
          <div className={styles.movePopup}>
            <div className={styles.editPicturePopup}>
              <div className="flex justify-between pt-20 pl-20">
                <div className="flex">
                  <div className="my-auto pr-10">
                    <DocumentDuplicateIcon width={25} height={25} className="text-brownSemiDark mx-auto" />
                  </div>
                  <div className="text-xl my-auto font-light">Rezept kopieren</div>
                </div>
                <div className="my-auto pr-20">
                  <XIcon
                    width={25}
                    height={25}
                    className="text-brownSemiDark mx-auto cursor-pointer"
                    onClick={() => setCopyRecipePopupClass('hidden')}
                  />
                </div>
              </div>
              <div className={styles.editPictureIngridientPopupContent}>
                <div className="pt-20 font-extralight text-base pl-20 pr-15 pb-30">
                  <div className="pb-15">
                    <div className="pb-10">Wie möchtest du das Rezept kopieren?</div>
                    <Select
                      options={copyTypeValues}
                      styles={customSelectStyles}
                      value={copyTypeValues.filter((item: any) => item.value === currentCopyTypeValue)}
                      onChange={e => setCurrentCopyTypeValue(e?.value)}
                    />
                  </div>
                  {currentCopyTypeValue === 'date' && (
                    <>
                      <div>
                        <div className="flex gap-20 pt-4">
                          <div className="font-light my-auto w-130">Zu welchem Datum?</div>
                          <div className="flex-1">
                            <div>
                              <DatePicker
                                className="w-full appearance-none block py-1 px-2 rounded-md text-base placeholder-gray-400 focus:outline-none bg-lightDarkGray bg-opacity-20 text-white border-solid border border-white border-opacity-30"
                                dateFormat="dd.MM.yyyy"
                                selected={startDate}
                                includeDates={planDateArray}
                                onChange={changeCopyDate}
                                customInput={React.createElement(React.forwardRef(CustomInput))}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {currentCopyTypeValue === 'days' && (
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
                            options={mealTypeValues}
                            styles={customSelectStyles}
                            value={mealTypeValues.filter((item: any) => item.value === currentCopyMealTypeValue)}
                            onChange={e => setCurrentCopyMealTypeValue(e?.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pl-20 pr-10 pt-10 pb-40">
                  <Button className="w-full" onClick={() => copyRecipe()}>
                    Kopieren
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditMealCard;
