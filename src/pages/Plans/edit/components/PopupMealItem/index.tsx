import React from 'react';
import { TrashIcon } from '@heroicons/react/outline';

import { toast } from 'react-toast';

type Props = {
  itemObject?: any;
  type?: string;
  planState?: any;
  planStateValue?: any;
  dayId?: number;
  mealType?: any;
};

const PopupMealItem: React.FC<Props> = ({ itemObject, type, planState, planStateValue, dayId, mealType }) => {
  let thisType = '';

  if (type === 'Rezept') {
    thisType = 'recipes';
  } else {
    thisType = 'ingredients';
  }

  function deleteItem() {
    const newColumns = {
      ...planStateValue,
      kcal_total:
        planStateValue.kcal_total - itemObject.kcal_total < 0 ? 0 : planStateValue.kcal_total - itemObject.kcal_total,
      carbohydrates_total:
        planStateValue.carbohydrates_total - itemObject.carbohydrates_total < 0
          ? 0
          : planStateValue.carbohydrates_total - itemObject.carbohydrates_total,
      protein_total:
        planStateValue.protein_total - itemObject.protein_total < 0
          ? 0
          : planStateValue.protein_total - itemObject.protein_total,
      fat_total:
        planStateValue.fat_total - itemObject.fat_total < 0 ? 0 : planStateValue.fat_total - itemObject.fat_total,
      [thisType]: [
        ...planStateValue[thisType].filter((item: any) => parseFloat(item.id) !== parseFloat(itemObject.id)),
      ],
    };

    planState(newColumns);
  }

  return (
    <>
      <div className="rounded-2xl bg-white bg-opacity-10 py-20 px-20 mb-20">
        <div className="flex justify-between flex-wrap md:flex-nowrap">
          <div className="font-semibold text-17 pr-20">
            <div className="pt-1">{itemObject?.name}</div>
            <div className="font-extralight text-12">
              ({itemObject?.amount} {itemObject?.piece})
            </div>
          </div>
          <div>
            <div className="flex gap-2 justify-between" />
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
              <div className="my-auto ml-1 justify-end z-10">
                <TrashIcon
                  width={23}
                  height={23}
                  className="text-brownSemiDark cursor-pointer"
                  onClick={() => deleteItem()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PopupMealItem;
