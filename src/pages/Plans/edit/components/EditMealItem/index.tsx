import React, { useState, useRef } from 'react';
import {
  TrashIcon,
  DotsVerticalIcon,
  XIcon,
  DocumentDuplicateIcon,
  RefreshIcon,
  CogIcon,
  SwitchHorizontalIcon,
} from '@heroicons/react/outline';
import CustomUserInput from 'components/CustomUserInput';
import { handleOpenClosePopups, scrollToElement } from 'shared/functions/global';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { toast } from 'react-toast';
import styles from './styles.module.scss';

type Props = {
  itemObject?: any;
  type?: string;
  planState?: any;
  planStateValue?: any;
  dayId?: number;
  mealType?: any;
  moveRecipePopupOpener?: any;
  copyRecipePopupOpener?: any;
  changeRecipePopupOpener?: any;
  itemChangeTypeState?: any;
  itemChangeIdState?: any;
  scrollRef?: any;
};

const EditMealItem: React.FC<Props> = ({
  itemObject,
  type,
  planState,
  planStateValue,
  dayId,
  mealType,
  moveRecipePopupOpener,
  copyRecipePopupOpener,
  changeRecipePopupOpener,
  itemChangeTypeState,
  itemChangeIdState,
  scrollRef,
}) => {
  const [actionClass, setActionClass] = useState('hidden');

  const editIngridientRef = useRef<HTMLInputElement>(null);

  let thisType = '';

  if (type === 'Rezept') {
    thisType = 'recipes';
  } else {
    thisType = 'ingredients';
  }

  function clickIngridientAmount() {
    if (editIngridientRef.current) {
      editIngridientRef.current.select();
    }
  }

  function deleteItem() {
    const newColumns = {
      ...planStateValue,
      dayEntries: planStateValue?.dayEntries.map((entries: any) => {
        if (parseFloat(entries.id) !== dayId) return entries;
        return {
          ...entries,
          kcal_total: entries.kcal_total - itemObject.kcal_total < 0 ? 0 : entries.kcal_total - itemObject.kcal_total,
          carbohydrates_total:
            entries.carbohydrates_total - itemObject.carbohydrates_total < 0
              ? 0
              : entries.carbohydrates_total - itemObject.carbohydrates_total,
          protein_total:
            entries.protein_total - itemObject.protein_total < 0 ? 0 : entries.protein_total - itemObject.protein_total,
          fat_total: entries.fat_total - itemObject.fat_total < 0 ? 0 : entries.fat_total - itemObject.fat_total,
          [mealType]: {
            ...entries[mealType],
            [thisType]: [
              ...entries[mealType][thisType].filter((item: any) => parseFloat(item.id) !== parseFloat(itemObject.id)),
            ],
          },
        };
      }),
    };

    scrollToElement(scrollRef);
    toast.success('Das Rezept wurde erfolgreich gelöscht!');
    planState(newColumns);
  }

  function editAmount(event: any, updateType: string | undefined) {
    const thisCurrentAmount = event.target.value;

    if (type === 'Rezept') {
      const newColumns = {
        ...planStateValue,
        dayEntries: planStateValue?.dayEntries.map((entries: any) => {
          if (parseFloat(entries.id) !== dayId) return entries;
          return {
            ...entries,
            kcal_total: entries.kcal_total - itemObject.kcal_total < 0 ? 0 : entries.kcal_total - itemObject.kcal_total,
            carbohydrates_total:
              entries.carbohydrates_total - itemObject.carbohydrates_total < 0
                ? 0
                : entries.carbohydrates_total - itemObject.carbohydrates_total,
            protein_total:
              entries.protein_total - itemObject.protein_total < 0
                ? 0
                : entries.protein_total - itemObject.protein_total,
            fat_total: entries.fat_total - itemObject.fat_total < 0 ? 0 : entries.fat_total - itemObject.fat_total,
          };
        }),
      };

      planState(newColumns);
    }
  }

  function changeItem(popupOpener: any) {
    handleOpenClosePopups(setActionClass, popupOpener, 'both');

    itemChangeIdState(itemObject.id);
    itemChangeTypeState(thisType);
  }

  return (
    <>
      <div className="rounded-2xl bg-white bg-opacity-10 py-20 px-20 mb-20">
        <div className="flex justify-between flex-wrap md:flex-nowrap">
          <div className="font-semibold text-17 pr-20 pb-20">
            <div className="flex">
              {type === 'Rezept' ? (
                <div className="rounded-3xl bg-lightRed py-1 mb-1 px-10 font-bold text-10 ">{type}</div>
              ) : (
                <div className="rounded-3xl bg-lightGreen py-1 mb-1 px-10 font-bold text-10 text-black">{type}</div>
              )}
            </div>
            <div className="pt-1">{itemObject?.name}</div>
          </div>
          <div>
            <div className="flex gap-2">
              <div>
                <CustomUserInput
                  lightBackground
                  thisValue={itemObject?.amount}
                  name="amount"
                  thisRef={editIngridientRef}
                  onClick={clickIngridientAmount}
                  width={itemObject?.amount.toString().length}
                  onChange={e => editAmount(e, type)}
                />
              </div>
              <div>
                <CustomUserInput
                  lightBackground
                  thisValue={itemObject?.piece}
                  name="piece"
                  width={itemObject?.piece.length}
                />
              </div>
              <div className="my-auto ml-1 justify-end z-10">
                <TrashIcon
                  width={23}
                  height={23}
                  className="text-brownSemiDark cursor-pointer"
                  onClick={() => deleteItem()}
                />
              </div>
              {type === 'Rezept' && (
                <>
                  <div className="my-auto relative">
                    <div>
                      <DotsVerticalIcon
                        width={23}
                        height={23}
                        className="text-brownSemiDark cursor-pointer"
                        onClick={() => setActionClass('block')}
                      />
                    </div>
                    <div
                      className={`absolute bg-lightDarkGray shadow-2xl rounded-xl z-100 top-40 w-300 border border-brownSemiDark transition-opacity duration-1000 ${actionClass} ${styles.actionsMenu}`}
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
                          <div
                            className="flex justify-between border-b py-7 border-blackSemiDark cursor-pointer"
                            onClick={() => changeItem(changeRecipePopupOpener)}
                            onMouseDown={() => changeItem(changeRecipePopupOpener)}
                            aria-hidden="true"
                          >
                            <div className=" cursor-pointer px-7">Rezept austauschen</div>
                            <div>
                              <RefreshIcon width={25} height={25} className="text-brownSemiDark mr-10" />
                            </div>
                          </div>
                        </div>
                        <div className="border-transparent border-2 hover:border-brownSemiDark rounded-lg mx-20">
                          <div
                            className="flex justify-between border-b py-7 border-blackSemiDark cursor-pointer"
                            onClick={() => changeItem(copyRecipePopupOpener)}
                            onMouseDown={() => changeItem(copyRecipePopupOpener)}
                            aria-hidden="true"
                          >
                            <div className=" cursor-pointer px-7">Rezept kopieren</div>
                            <div>
                              <DocumentDuplicateIcon width={25} height={25} className="text-brownSemiDark mr-10" />
                            </div>
                          </div>
                        </div>
                        <div className="border-transparent border-2 hover:border-brownSemiDark rounded-lg mx-20">
                          <div
                            className="flex justify-between py-7 cursor-pointer"
                            onClick={() => changeItem(moveRecipePopupOpener)}
                            onMouseDown={() => changeItem(moveRecipePopupOpener)}
                            aria-hidden="true"
                          >
                            <div className=" cursor-pointer px-7">Rezept verschieben</div>
                            <div>
                              <SwitchHorizontalIcon width={25} height={25} className="text-brownSemiDark mr-10" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-10 justify-between pt-10">
              <div>
                <div className="font-extralight text-12">{itemObject?.kcal_total}</div>
                <div className="font-extralight text-8 text-center">KCAL</div>
              </div>
              <div>
                <div className="font-extralight text-12">{itemObject?.carbohydrates_total}g</div>
                <div className="font-extralight text-8 text-center">KH</div>
              </div>
              <div>
                <div className="font-extralight text-12">{itemObject?.protein_total}g</div>
                <div className="font-extralight text-8 text-center">EW</div>
              </div>
              <div>
                <div className="font-extralight text-12">{itemObject?.fat_total}g</div>
                <div className="font-extralight text-8 text-center">FETT</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditMealItem;
