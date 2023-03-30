import classNames from 'classnames';
import React from 'react';
import { XIcon } from '@heroicons/react/outline';
import styles from './styles.module.scss';

type Props = {
  planObject?: any;
  setPlanObject?: any;
  setPlanChanged?: any;
  className?: string;
  onlyNutritionForm?: boolean;
  edit?: boolean;
};

const HashTagBadge: React.FC<Props> = ({
  planObject,
  className,
  onlyNutritionForm,
  edit,
  setPlanObject,
  setPlanChanged,
}) => {
  function deleteBadge(item: string) {
    const newColumns = {
      ...planObject,
      [item]: false,
    };

    if (setPlanChanged) {
      setPlanChanged(true);
    }

    setPlanObject(newColumns);
  }

  return (
    <>
      {planObject?.flexitarian === true ||
      planObject?.ketogen === true ||
      planObject?.vegetarian === true ||
      planObject?.vegan === true ||
      planObject?.lactose === false ||
      planObject?.gluten === false ? (
        <>
          <div className={className}>
            <div className="flex flex-wrap gap-4">
              {planObject?.flexitarian === true && (
                <div>
                  <div className="rounded-3xl bg-brownSemiDark py-5 px-15 font-bold text-14">Flexitarisch</div>
                </div>
              )}
              {planObject?.ketogen === true && (
                <div>
                  {edit ? (
                    <div className="rounded-3xl bg-brownSemiDark py-5 pl-15 pr-30 relative font-bold text-14">
                      <div>Ketogen</div>
                      <div className={styles.editIcon}>
                        <XIcon width={15} height={15} className="text-white" onClick={() => deleteBadge('ketogen')} />
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-3xl bg-brownSemiDark py-5 px-15 font-bold text-14">Ketogen</div>
                  )}
                </div>
              )}
              {planObject?.vegetarian === true && (
                <div>
                  {edit ? (
                    <div className="rounded-3xl bg-brownSemiDark py-5 pl-15 pr-30 relative font-bold text-14">
                      <div>Vegetarisch</div>
                      <div className={styles.editIcon}>
                        <XIcon
                          width={15}
                          height={15}
                          className="text-white"
                          onClick={() => deleteBadge('vegetarian')}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-3xl bg-brownSemiDark py-5 px-15 font-bold text-14">Vegetarisch</div>
                  )}
                </div>
              )}
              {planObject?.vegan === true && (
                <div>
                  {edit ? (
                    <div className="rounded-3xl bg-brownSemiDark py-5 pl-15 pr-30 relative font-bold text-14">
                      <div>Vegan</div>
                      <div className={styles.editIcon}>
                        <XIcon width={15} height={15} className="text-white" onClick={() => deleteBadge('vegan')} />
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-3xl bg-brownSemiDark py-5 px-15 font-bold text-14">Vegan</div>
                  )}
                </div>
              )}
              {onlyNutritionForm !== true && planObject?.lactose === false && (
                <div className="rounded-3xl bg-brownSemiDark py-5 px-15 font-bold text-14">Laktosefrei</div>
              )}
              {onlyNutritionForm !== true && planObject?.gluten === false && (
                <div className="rounded-3xl bg-brownSemiDark py-5 px-15 font-bold text-14">Glutenfrei</div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div />
      )}
    </>
  );
};

export default HashTagBadge;
