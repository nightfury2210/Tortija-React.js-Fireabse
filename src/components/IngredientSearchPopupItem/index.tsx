import React from 'react';
import { useTranslation } from 'react-i18next';
import { PlusIcon } from '@heroicons/react/outline';
import { toast } from 'react-toast';
import styles from './style.module.scss';

type Props = {
  itemObject?: any;
  planState?: any;
  planStateValue?: any;
  updateDayId: any;
  mealType?: any;
};

const IngredientSearchPopupItem = ({ itemObject, planState, planStateValue, updateDayId, mealType }: Props) => {
  const { t } = useTranslation();

  function addRecipeDirect() {
    const thisRecipeObject = {
      ...itemObject,
      id: Math.random().toString(),
      amount: 1,
      piece: 'Portion',
      kcal_total: Math.round(parseFloat(itemObject.kcal_total)),
      carbohydrates_total: Math.round(parseFloat(itemObject.carbohydrates_total)),
      protein_total: Math.round(parseFloat(itemObject.protein_total)),
      fat_total: Math.round(parseFloat(itemObject.fat_total)),
    };

    const newColumns = {
      ...planStateValue,
      dayEntries: planStateValue.dayEntries.map((entries: any) => {
        if (parseFloat(entries.id) !== updateDayId) return entries;
        return {
          ...entries,
          kcal_total: parseFloat(entries.kcal_total) + parseFloat(itemObject.kcal_total),
          carbohydrates_total: parseFloat(entries.carbohydrates_total) + parseFloat(itemObject.carbohydrates_total),
          protein_total: parseFloat(entries.protein_total) + parseFloat(itemObject.protein_total),
          fat_total: parseFloat(entries.fat_total) + parseFloat(itemObject.fat_total),
          [mealType]: {
            ...entries[mealType],
            recipes: [thisRecipeObject, ...entries[mealType].recipes],
          },
        };
      }),
    };

    toast.success('Das Rezept wurde erfolgreich hinzugefügt!');
    planState(newColumns);
  }

  return (
    <div className="flex mb-20">
      <div className={styles.contentItem}>
        <div className={styles.imageWrapper}>
          <img src={itemObject.imageUrl} alt="" width={45} height={45} loading="lazy" className={styles.image} />
        </div>
        <div className={styles.description}>
          <div className="pr-5">
            <div className={styles.itemTitle} title={itemObject.name}>
              {itemObject.name}
            </div>
          </div>
          <div className={styles.category}>
            <div className={styles.item}>
              <div className="text-12">{Math.round(parseFloat(itemObject.kcal_total))}</div>
              <div>kcal</div>
            </div>
            <div className={styles.itemSecondary}>
              <div className="text-12">{Math.round(parseFloat(itemObject.carbohydrates_total))}</div>
              <div>KH</div>
            </div>
            <div className={styles.itemSecondary}>
              <div className="text-12">{Math.round(parseFloat(itemObject.protein_total))}</div>
              <div>EW</div>
            </div>
            <div className={styles.itemSecondary}>
              <div className="text-12">{Math.round(parseFloat(itemObject.fat_total))}</div>
              <div>Fett</div>
            </div>
          </div>
        </div>
      </div>
      <div className="pl-5 pt-15 my-auto">
        <PlusIcon
          width={25}
          height={25}
          className="text-brownSemiDark cursor-pointer"
          onClick={() => addRecipeDirect()}
          onKeyDown={() => addRecipeDirect()}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default IngredientSearchPopupItem;
