import React, { ReactNode, useState, useEffect, useRef, TextareaHTMLAttributes } from 'react';
import classNames from 'classnames';
import { TrashIcon, MenuIcon } from '@heroicons/react/outline';
import { useLocation } from 'react-router-dom';
import styles from './style.module.scss';

type Props = {
  descriptionData: any;
  recipeData: any;
  updateFunction: any;
  setRecipeChanged: any;
  recipeDescriptionArray: any;
  recipeDescriptionArrayValue: any;
  newDescriptionStepRef: any;
  recipeChanged: any;
  setDescriptionStepAdded: any;
  descriptionStepAdded: any;
};

function deleteDescriptionStep(
  id: any,
  recipeData: any,
  updateFunction: any,
  setRecipeChanged: any,
  recipeDescriptionArrayValue: any,
  recipeDescriptionArray: any
) {
  let changeStepArray;
  if (recipeDescriptionArrayValue.length > 0) {
    changeStepArray = recipeDescriptionArrayValue.filter((t: any) => parseFloat(t.id) !== parseFloat(id));
  } else {
    changeStepArray = recipeData.description.filter((t: any) => parseFloat(t.id) !== parseFloat(id));
  }

  // Set new IDs to get the right order
  const setNewIdToArray = changeStepArray.map((column: any, index: any) => {
    return {
      ...column,
      id: index,
    };
  });

  const newColumns = {
    ...recipeData,
    description: [...setNewIdToArray],
  };

  recipeDescriptionArray(setNewIdToArray);
  updateFunction(newColumns);
  setRecipeChanged(true);
}

const DescriptionItem: React.FC<Props> = ({
  descriptionData,
  recipeData,
  updateFunction,
  setRecipeChanged,
  recipeDescriptionArray,
  recipeDescriptionArrayValue,
  newDescriptionStepRef,
  recipeChanged,
  setDescriptionStepAdded,
  descriptionStepAdded,
}) => {
  const handleChange = (event: any) => {
    let changeStepArrayChange;
    if (recipeDescriptionArrayValue.length > 0) {
      changeStepArrayChange = recipeDescriptionArrayValue.map((column: any) => {
        if (parseFloat(column.id) !== parseFloat(descriptionData.id)) return column;
        return {
          ...column,
          text: event.currentTarget.textContent.trim(),
        };
      });
    } else {
      changeStepArrayChange = recipeData.description.map((column: any) => {
        if (parseFloat(column.id) !== parseFloat(descriptionData.id)) return column;
        return {
          ...column,
          text: event.currentTarget.textContent.trim(),
        };
      });
    }

    recipeDescriptionArray(changeStepArrayChange);
    setRecipeChanged(true);
  };

  const location = useLocation<LocationState>();

  useEffect(() => {
    if (newDescriptionStepRef.current && descriptionStepAdded) {
      newDescriptionStepRef.current.focus();
    }
  }, [newDescriptionStepRef, descriptionStepAdded]);

  return (
    <div className={styles.descItem} id={`description-item-${descriptionData.id}`}>
      <div className="flex">
        <div className="text-3xl text-brownSemiDark font-bold pr-2 my-auto">{parseFloat(descriptionData.id) + 1}.</div>
        {typeof location.state !== undefined && location.state !== null && location.state?.from === 'plans' ? (
          <div className="font-extralight text-16">
            {(descriptionData.text.includes('cookidoo') && <a href={descriptionData.text}>Weiter zu Cookidoo</a>) || (
              <div className="p-5">
                <div ref={newDescriptionStepRef} className="text-white leading-6 bg-lightDarkGray p-10">
                  {descriptionData.text}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="font-extralight text-16">
            {(descriptionData.text.includes('cookidoo') && <a href={descriptionData.text}>Weiter zu Cookidoo</a>) || (
              <div className="p-5">
                <div
                  ref={newDescriptionStepRef}
                  onInput={handleChange}
                  className="text-white leading-6 bg-lightDarkGray border border-opacity-30 border-white p-10 rounded-xl"
                  contentEditable
                  suppressContentEditableWarning
                >
                  {descriptionData.text}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {typeof location.state !== undefined && location.state !== null && location.state?.from !== 'plans' && (
        <div className="flex my-auto gap-1">
          <div>
            <TrashIcon
              onClick={() =>
                deleteDescriptionStep(
                  descriptionData.id,
                  recipeData,
                  updateFunction,
                  setRecipeChanged,
                  recipeDescriptionArrayValue,
                  recipeDescriptionArray
                )
              }
              width={28}
              height={20}
              className="text-brownSemiDark cursor-pointer"
            />
          </div>
          <div>
            <MenuIcon width={28} height={20} className="text-brownSemiDark cursor-pointer" />
          </div>
        </div>
      )}
    </div>
  );
};

export default DescriptionItem;
