import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from 'components/Card';
import { MainContext } from 'providers/MainProvider';
import Skeleton from 'components/skeleton';
import { HeartIcon } from '@heroicons/react/outline';
import styles from './styles.module.scss';

type Props = {
  initialNutrition: string[];
  initialIntolerances: string[];
  caloriesRange: {
    min: number;
    max: number;
  };
  searchValue?: string;
};

const PlanSection: React.FC<Props> = ({ initialNutrition, initialIntolerances, caloriesRange, searchValue = '' }) => {
  const { planList, favoritesPlansList } = useContext(MainContext);

  const planFilteredList: PlanType[] = useMemo(
    () =>
      planList
        ? planList.filter(
            element =>
              (element.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                element.kcal_total.toString().includes(searchValue.toLowerCase())) &&
              (initialNutrition.length === 0 || initialNutrition.findIndex(item => element[item.toLowerCase()]) > -1) &&
              (initialIntolerances.length === 0 ||
                initialIntolerances.findIndex(item => element[item.toLowerCase()]) > -1) &&
              (element.kcal_total === 0 || element.kcal_total > caloriesRange.min) &&
              element.kcal_total < caloriesRange.max
          )
        : [],
    [planList, searchValue, initialNutrition, initialIntolerances, caloriesRange.min, caloriesRange.max]
  );

  return (
    <div className={styles.wrapper}>
      {/* skeleton loading */}
      {!planList
        ? Array.from(Array(15).keys()).map((_, index) => (
            <Card className="mx-auto" key={`skeleton${index}`} isLoading>
              <Skeleton className={styles.skeletonTitle} translucent />
            </Card>
          ))
        : planFilteredList.map((plan: PlanType, index: number) => (
            <Link to={`/plans/${plan.uid}`} key={index}>
              <Card image={plan.imageUrl} className="mx-auto">
                <div className="flex justify-between">
                  <div className="pr-15">
                    <div className={styles.title}>{plan.name}</div>
                    <div className="text-xs font-light pt-10">{plan.kcal_total} kcal</div>
                  </div>
                  {favoritesPlansList?.find(item => item.origId === plan.origId) !== undefined && (
                    <div className="my-auto">
                      <HeartIcon width={20} height={20} className="text-brownSemiDark" fill="#C97132" />
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          ))}
    </div>
  );
};

export default PlanSection;
