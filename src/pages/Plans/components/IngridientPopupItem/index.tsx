import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

type Props = {
  ingridientItem?: any;
  type?: string;
  ingredientType?: string;
  openPopup?: any;
  mealType?: string;
  dayId?: number;
  planUid?: string;
  mealLabel?: string;
};

const IngridientPopupItem: React.FC<Props> = ({
  ingridientItem,
  type,
  openPopup,
  ingredientType,
  mealType,
  dayId,
  planUid,
  mealLabel,
}) => {
  return (
    <>
      {openPopup ? (
        <div
          className="flex"
          onClick={() => openPopup(ingredientType, ingridientItem.name)}
          onKeyDown={() => openPopup(ingredientType, ingridientItem.name)}
          aria-hidden="true"
        >
          <div className={styles.contentItem}>
            <div className={styles.description}>
              <div className="py-15 pl-5 pr-5">
                <div className="flex">
                  {type === 'Rezept' ? (
                    <div className="rounded-3xl bg-lightRed py-1 mb-1 px-10 font-bold text-10 ">{type}</div>
                  ) : (
                    <div className="rounded-3xl bg-lightGreen py-1 mb-1 px-10 font-bold text-10 text-black">{type}</div>
                  )}
                </div>
                <div className={styles.popupNutritionItem}>{ingridientItem.name}</div>
                <div className="font-extralight text-10 pb-5">
                  {ingridientItem.amount} {ingridientItem.piece} ({ingridientItem.portion_g}g)
                </div>
                <div className={styles.category}>
                  <div className={styles.item}>
                    <div className="text-12">{ingridientItem.kcal_total}</div>
                    <div>KCAL</div>
                  </div>
                  <div className={styles.item}>
                    <div className="text-12">{ingridientItem.carbohydrates_total}</div>
                    <div>KH</div>
                  </div>
                  <div className={styles.item}>
                    <div className="text-12">{ingridientItem.protein_total}</div>
                    <div>EW</div>
                  </div>
                  <div className={styles.item}>
                    <div className="text-12">{ingridientItem.fat_total}</div>
                    <div>Fett</div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.imageWrapper}>
              <img
                src={ingridientItem.imageUrl}
                alt=""
                width={45}
                height={45}
                loading="lazy"
                className={styles.image}
              />
            </div>
          </div>
        </div>
      ) : (
        <Link
          to={{
            pathname: `/nutrition/recipes/${ingridientItem.uid}`,
            state: { from: 'plans', uid: planUid, type: mealType, id: dayId, label: mealLabel },
          }}
        >
          <div className="flex">
            <div className={styles.contentItem}>
              <div className={styles.description}>
                <div className="py-15 pl-5 pr-5">
                  <div className="flex">
                    <div className="rounded-3xl bg-brownSemiDark py-1 mb-1 px-10 font-bold text-10">{type}</div>
                  </div>
                  <div className={styles.popupNutritionItem}>{ingridientItem.name}</div>
                  <div className="font-extralight text-10 pb-5">
                    {ingridientItem.amount} {ingridientItem.piece} ({ingridientItem.portion_g}g)
                  </div>
                  <div className={styles.category}>
                    <div className={styles.item}>
                      <div className="text-12">{ingridientItem.kcal_total}</div>
                      <div>KCAL</div>
                    </div>
                    <div className={styles.item}>
                      <div className="text-12">{ingridientItem.carbohydrates_total}</div>
                      <div>KH</div>
                    </div>
                    <div className={styles.item}>
                      <div className="text-12">{ingridientItem.protein_total}</div>
                      <div>EW</div>
                    </div>
                    <div className={styles.item}>
                      <div className="text-12">{ingridientItem.fat_total}</div>
                      <div>Fett</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.imageWrapper}>
                <img
                  src={ingridientItem.imageUrl}
                  alt=""
                  width={45}
                  height={45}
                  loading="lazy"
                  className={styles.image}
                />
              </div>
            </div>
          </div>
        </Link>
      )}
    </>
  );
};

export default IngridientPopupItem;
