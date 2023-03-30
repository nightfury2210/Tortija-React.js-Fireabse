import React from 'react';
import Card from 'components/Card';
import { PlusIcon } from '@heroicons/react/outline';
import styles from './styles.module.scss';

type Props = {
  label: string;
  mealLabel?: string;
  mealCounter?: number;
  type?: string;
  kcal_value?: number;
  carbohydrates_value: number;
  protein_value: number;
  fat_value?: number;
  imageUrl?: string;
  onClick?: any;
  mealType?: string;
};

const MealCard: React.FC<Props> = ({
  label,
  mealLabel = '',
  mealCounter = 0,
  kcal_value = 0,
  carbohydrates_value = 0,
  protein_value = 0,
  fat_value = 0,
  imageUrl = '/static/media/logo.1cff5e99.svg',
  type = 'add',
  onClick,
  mealType,
}) => {
  return (
    <>
      {type === 'add' ? (
        <div>
          <Card isWithoutImage className="border-transparent border-2 hover:border-brownSemiDark cursor-pointer h-220">
            <div className="absolute top-10 left-20 opacity-100 font-semibold text-17">{label}</div>
            <div className={styles.addIcon}>
              <div className="pt-20">
                <PlusIcon width={42} height={42} className="text-brownSemiDark cursor-pointer mx-auto" />
              </div>
              <div className="text-center font-semibold text-18 px-20 pt-15">Hinzufügen</div>
            </div>
          </Card>
        </div>
      ) : (
        <div onClick={() => onClick(mealType, label)} onKeyDown={() => onClick(mealType, label)} aria-hidden="true">
          <Card
            isOverlay
            image={imageUrl}
            className="border-transparent border-2 hover:border-brownSemiDark cursor-pointer"
          >
            <div className="absolute top-10 opacity-100 font-semibold text-17">{label}</div>
            <div className="absolute bottom-10 w-full">
              <div className="flex font-semibold text-12 pb-2 w-3/4">
                <div className="text-ellipsis overflow-hidden truncate">{mealLabel}</div>
                {mealCounter > 0 && <div className="pl-1">+{mealCounter}</div>}
              </div>
              <div className="flex justify-between pr-40">
                <div>
                  <div className="font-medium text-12">{kcal_value}</div>
                  <div className="font-medium text-8">KCAL</div>
                </div>
                <div>
                  <div className="font-medium text-12">{carbohydrates_value}</div>
                  <div className="font-medium text-8">KH</div>
                </div>
                <div>
                  <div className="font-medium text-12">{protein_value}</div>
                  <div className="font-medium text-8">EW</div>
                </div>
                <div>
                  <div className="font-medium text-12">{fat_value}</div>
                  <div className="font-medium text-8">FETT</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default MealCard;
