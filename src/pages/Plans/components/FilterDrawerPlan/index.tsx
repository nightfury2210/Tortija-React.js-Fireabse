import React from 'react';
import { useTranslation } from 'react-i18next';
import { AdjustmentsIcon } from '@heroicons/react/outline';
import Drawer from 'components/Drawer';
import Headline from 'components/Headline';
import ButtonGroup from 'components/ButtonGroup';
import MultiRangeSlider from 'components/MultiRangeSlider';
import { intolerancesOption } from 'shared/constants/profile-wizard';
import styles from './styles.module.scss';

type Props = {
  isFilterOpen?: boolean;
  closeFilterOpen: (value: boolean) => void;
  initialNutrition: string[];
  changeNutrition: Function;
  initialIntolerances: string[];
  changeIncompatibilities: Function;
  caloriesRange: { min: number; max: number };
  selectCaloriesRange: (value: number[]) => void;
};

const formOfNutritionPlan: string[] = ['Flexitarisch', 'Vegan', 'Vegetarian', 'Ketogen'];

const FilterDrawerPlan: React.FC<Props> = ({
  isFilterOpen = false,
  closeFilterOpen,
  initialNutrition,
  changeNutrition,
  initialIntolerances,
  changeIncompatibilities,
  caloriesRange,
  selectCaloriesRange,
}) => {
  const { t } = useTranslation();

  return (
    <Drawer isOpen={isFilterOpen} closeDrawer={closeFilterOpen}>
      <div className={styles.header}>
        <AdjustmentsIcon width={28} height={28} className={styles.filterIcon} />
        <Headline level={3}>{t('Filter')}</Headline>
      </div>
      <div className={styles.wrapper}>
        <>
          <MultiRangeSlider
            label="Calories"
            min={1000}
            max={4500}
            onChange={selectCaloriesRange}
            value={caloriesRange}
          />
          <hr className={styles.divider} />
          <ButtonGroup
            options={formOfNutritionPlan}
            initialOption={initialNutrition}
            label="Form of nutrition"
            itemsClassName="grid-cols-3"
            changeSelectedItem={changeNutrition}
          />
          <hr className={styles.divider} />
          <ButtonGroup
            options={intolerancesOption}
            initialOption={initialIntolerances}
            label="Intolerances"
            itemsClassName="grid-cols-3"
            changeSelectedItem={changeIncompatibilities}
          />
        </>
      </div>
    </Drawer>
  );
};

export default FilterDrawerPlan;
