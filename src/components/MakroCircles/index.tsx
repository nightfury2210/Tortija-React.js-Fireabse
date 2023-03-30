import React, { useContext } from 'react';
import { Line, Circle } from 'rc-progress';
import { CheckIcon, ArrowSmDownIcon, ArrowSmUpIcon, ExclamationIcon } from '@heroicons/react/outline';
import { AuthContext } from 'providers/AuthProvider';
import MakroIcons from 'components/MakroIcons';
import { useTranslation } from 'react-i18next';

type Props = {
  kcal_value?: number;
  carbohydrates_value?: number;
  protein_value?: number;
  fat_value?: number;
};

const MakroCircles: React.FC<Props> = ({
  kcal_value = 0,
  carbohydrates_value = 0,
  protein_value = 0,
  fat_value = 0,
}) => {
  const { t } = useTranslation();
  const authContext = useContext(AuthContext);
  const { userData } = useContext(AuthContext);
  const PercentKcalTotal = Math.round((100 * kcal_value) / userData!.kcal_total);
  const PercentCarbohydratesTotal = Math.round((100 * carbohydrates_value) / userData!.carbohydrates_total);
  const PercentProteinTotal = Math.round((100 * protein_value) / userData!.protein_total);
  const PercentFatTotal = Math.round((100 * fat_value) / userData!.fat_total);

  return (
    <div>
      <div className="relative">
        <div className="flex justify-center">
          <div className="relative">
            <div>
              <Circle
                className="h-150"
                percent={PercentKcalTotal}
                strokeWidth={10}
                trailWidth={10}
                trailColor="#3C4045"
                strokeLinecap="round"
                strokeColor={{
                  '100%': '#88532E',
                  '0%': '#C38A5F',
                }}
              />
            </div>
            <div className="absolute top-0 text-center h-full w-full pt-35">
              <div>
                <div className="text-13 font-extralight">Kalorien</div>
                <div className="flex justify-center py-1">
                  <div className="font-bold text-28">{PercentKcalTotal}%</div>
                  <div className="my-auto pl-1">
                    <MakroIcons percent={PercentKcalTotal} />
                  </div>
                </div>
                <div className="text-13 font-extralight">{kcal_value} kcal</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between px-20 pt-30">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="font-bold text-17 pb-1">{PercentCarbohydratesTotal}%</div>
            <div className="pl-1 pt-1">
              <MakroIcons percent={PercentCarbohydratesTotal} />
            </div>
          </div>
          <div className="pb-2">
            <Line
              percent={PercentCarbohydratesTotal}
              strokeWidth={8}
              trailWidth={8}
              trailColor="#3C4045"
              strokeColor="#C38A5F"
              className="w-100"
            />
          </div>
          <div className="text-13 font-extralight">
            <div>Kohlenhydrate</div>
            <div>{carbohydrates_value} g</div>
          </div>
        </div>
        <div className="text-center">
          <div className="flex justify-center">
            <div className="font-bold text-17 pb-1">{PercentProteinTotal}%</div>
            <div className="pl-1 pt-1">
              <MakroIcons percent={PercentProteinTotal} />
            </div>
          </div>
          <div className="pb-2">
            <Line
              percent={PercentProteinTotal}
              strokeWidth={8}
              trailWidth={8}
              trailColor="#3C4045"
              strokeColor="#C38A5F"
              className="w-100"
            />
          </div>
          <div className="text-13 font-extralight">
            <div>Eiweiß</div>
            <div>{protein_value} g</div>
          </div>
        </div>
        <div className="text-center">
          <div className="flex justify-center">
            <div className="font-bold text-17 pb-1">{PercentFatTotal}%</div>
            <div className="pl-1 pt-1">
              <MakroIcons percent={PercentFatTotal} />
            </div>
          </div>
          <div className="pb-2">
            <Line
              percent={PercentFatTotal}
              strokeWidth={8}
              trailWidth={8}
              trailColor="#3C4045"
              strokeColor="#C38A5F"
              className="w-100"
            />
          </div>
          <div className="text-13 font-extralight">
            <div>Fett</div>
            <div>{fat_value} g</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakroCircles;
