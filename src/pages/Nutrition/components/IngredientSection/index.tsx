import React, { useContext, useMemo, useState } from 'react';
import classNames from 'classnames';
import { MainContext } from 'providers/MainProvider';
import { AuthContext } from 'providers/AuthProvider';
import { FilterContext } from 'providers/FilterProvider';
import Skeleton from 'components/skeleton';
import styles from './styles.module.scss';

type Props = {
  ingridientState?: any;
  ingridientStateValue?: any;
  editPopup?: any;
  editIngridientObject?: any;
};

const IngredientSection: React.FC<Props> = ({
  ingridientState,
  ingridientStateValue,
  editPopup,
  editIngridientObject,
}) => {
  const { ingredientList } = useContext(MainContext);
  const { nutritionSearchValue } = useContext(FilterContext);
  const [ingridientSectionLength, setIngridientSectionLength] = useState(0);

  const authContext = useContext(AuthContext);
  const { userData } = useContext(AuthContext);

  let thisIngridientList = ingredientList ?? [];

  if (ingridientStateValue.length > 0) {
    thisIngridientList = ingridientStateValue;
  }

  const ingredientFilteredList = useMemo(
    () => thisIngridientList.filter(element => element.name.toLowerCase().includes(nutritionSearchValue.toLowerCase())),
    [thisIngridientList, nutritionSearchValue]
  );

  if (thisIngridientList.length > 0 && thisIngridientList.length !== ingridientSectionLength) {
    setIngridientSectionLength(thisIngridientList.length);
    ingridientState(thisIngridientList);
  }

  function editIngredient(uid: string) {
    editPopup('block');
    editIngridientObject(thisIngridientList.filter(element => element.uid === uid));
  }

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.item}>KCAL</div>
          <div className={styles.item}>KH</div>
          <div className={styles.item}>EW</div>
          <div className={styles.item}>FETT</div>
        </div>
        {/* skeleton loading */}
        {!ingredientList
          ? Array.from(Array(15).keys()).map((_, index) => (
              <div className={styles.contentItem} key={index}>
                <Skeleton className={classNames(styles.imageWrapper, styles.skeletonImage)} translucent />
                <div className={styles.description}>
                  <Skeleton className={styles.skeletonTitle} translucent />
                  <div className={styles.category}>
                    <Skeleton className={styles.skeletonValue} translucent />
                    <Skeleton className={styles.skeletonValue} translucent />
                    <Skeleton className={styles.skeletonValue} translucent />
                    <Skeleton className={styles.skeletonValue} translucent />
                  </div>
                </div>
              </div>
            ))
          : ingredientFilteredList.map((item, index) => (
              <div
                className={styles.contentItem}
                key={index}
                {...(userData?.role === 1 || item.userIngridient
                  ? {
                      onClick: () => {
                        editIngredient(item.uid);
                      },
                    }
                  : {})}
                {...(userData?.role === 1
                  ? {
                      onKeyDown: () => {
                        editIngredient(item.uid);
                      },
                    }
                  : {})}
                aria-hidden="true"
              >
                <div className={styles.imageWrapper}>
                  <img src={item.imageUrl} alt="" width={75} height={75} loading="lazy" className={styles.image} />
                </div>
                <div className={styles.description}>
                  <div className="text-14">{item.name}</div>
                  <div className={styles.category}>
                    <div className={styles.item}>{Math.round(parseFloat(item.kcal_100g))}</div>
                    <div className={styles.item}>{Math.round(parseFloat(item.carbohydrates_100g))}</div>
                    <div className={styles.item}>{Math.round(parseFloat(item.protein_100g))}</div>
                    <div className={styles.item}>{Math.round(parseFloat(item.fat_100g))}</div>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </>
  );
};

export default IngredientSection;
