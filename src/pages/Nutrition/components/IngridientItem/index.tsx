import React, { useContext, useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { InformationCircleIcon, TrashIcon, XIcon } from '@heroicons/react/outline';
import { getIngridientMacros } from 'shared/functions/global';
import { MainContext } from 'providers/MainProvider';
import CustomUserInput from 'components/CustomUserInput';
import { intolerancesOption } from 'shared/constants/profile-wizard';
import { useLocation } from 'react-router-dom';
import styles from './styles.module.scss';

type Props = {
  ingridientData?: any;
  recipeData?: any;
  updateFunction?: any;
  setRecipeChanged?: any;
  setDirectAddedIngridients?: any;
  directAddedIngridients?: any;
  defaultValue?: any;
};

function editIngridientPiece(
  value: string | undefined,
  id: any,
  recipeData: any,
  updateFunction: any,
  setRecipeChanged: any,
  ingridientData: any,
  getIngridient: any,
  popupClass: any,
  setDirectAddedIngridients: any,
  directAddedIngridients: any
) {
  const thisCurrentAmount = ingridientData.amount;
  let currentCalculatedKcal;
  let currentCalculatedKH;
  let currentCalculatedEW;
  let currentCalculatedFT;
  let ingridientKcal;
  let ingridientKh;
  let ingridientEw;
  let ingridientFt;
  let ingridientKcalNew;
  let ingridientKhNew;
  let ingridientEwNew;
  let ingridientFtNew;
  let currentKcal = recipeData.kcal_total;
  let currentKH = recipeData.carbohydrates_total;
  let currentEW = recipeData.protein_total;
  let currentFT = recipeData.fat_total;

  let thisPiece = value;

  if (thisPiece?.includes('(')) {
    thisPiece = thisPiece.substr(0, thisPiece.indexOf('(') - 1);
  }

  if (ingridientData.piece !== 'g' && ingridientData.piece !== 'ml') {
    currentCalculatedKcal =
      ((parseFloat(ingridientData.amount) * parseFloat(ingridientData.preselect_g)) / 100) *
      parseFloat(getIngridient.kcal_100g);

    currentCalculatedKH =
      ((parseFloat(ingridientData.amount) * parseFloat(ingridientData.preselect_g)) / 100) *
      parseFloat(getIngridient.carbohydrates_100g);

    currentCalculatedEW =
      ((parseFloat(ingridientData.amount) * parseFloat(ingridientData.preselect_g)) / 100) *
      parseFloat(getIngridient.protein_100g);

    currentCalculatedFT =
      ((parseFloat(ingridientData.amount) * parseFloat(ingridientData.preselect_g)) / 100) *
      parseFloat(getIngridient.fat_100g);
  } else {
    currentCalculatedKcal = (parseFloat(ingridientData.amount) / 100) * parseFloat(getIngridient.kcal_100g);

    currentCalculatedKH = (parseFloat(ingridientData.amount) / 100) * parseFloat(getIngridient.carbohydrates_100g);

    currentCalculatedEW = (parseFloat(ingridientData.amount) / 100) * parseFloat(getIngridient.protein_100g);

    currentCalculatedFT = (parseFloat(ingridientData.amount) / 100) * parseFloat(getIngridient.fat_100g);
  }

  if (value !== 'g' && value !== 'ml') {
    ingridientKcal = Math.round(currentCalculatedKcal);
    ingridientKcalNew = Math.round(
      ((parseFloat(thisCurrentAmount) * parseFloat(ingridientData.preselect_g)) / 100) *
        parseFloat(getIngridient.kcal_100g)
    );

    ingridientKh = Math.round(currentCalculatedKH);
    ingridientKhNew = Math.round(
      ((parseFloat(thisCurrentAmount) * parseFloat(ingridientData.preselect_g)) / 100) *
        parseFloat(getIngridient.carbohydrates_100g)
    );

    ingridientEw = Math.round(currentCalculatedEW);
    ingridientEwNew = Math.round(
      ((parseFloat(thisCurrentAmount) * parseFloat(ingridientData.preselect_g)) / 100) *
        parseFloat(getIngridient.protein_100g)
    );

    ingridientFt = Math.round(currentCalculatedFT);
    ingridientFtNew = Math.round(
      ((parseFloat(thisCurrentAmount) * parseFloat(ingridientData.preselect_g)) / 100) *
        parseFloat(getIngridient.fat_100g)
    );
  } else {
    ingridientKcal = Math.round(currentCalculatedKcal);
    ingridientKcalNew = Math.round((parseFloat(getIngridient.kcal_100g) / 100) * thisCurrentAmount);

    ingridientKh = Math.round(currentCalculatedKH);
    ingridientKhNew = Math.round((parseFloat(getIngridient.carbohydrates_100g) / 100) * thisCurrentAmount);

    ingridientEw = Math.round(currentCalculatedEW);
    ingridientEwNew = Math.round((parseFloat(getIngridient.protein_100g) / 100) * thisCurrentAmount);

    ingridientFt = Math.round(currentCalculatedFT);
    ingridientFtNew = Math.round((parseFloat(getIngridient.fat_100g) / 100) * thisCurrentAmount);
  }

  currentKcal = Math.round(parseFloat(currentKcal) - ingridientKcal + ingridientKcalNew);
  currentKH = Math.round(parseFloat(currentKH) - ingridientKh + ingridientKhNew);
  currentEW = Math.round(parseFloat(currentEW) - ingridientEw + ingridientEwNew);
  currentFT = Math.round(parseFloat(currentFT) - ingridientFt + ingridientFtNew);

  const newColumns = {
    ...recipeData,
    kcal_total: currentKcal,
    carbohydrates_total: currentKH,
    protein_total: currentEW,
    fat_total: currentFT,
    ingredients: recipeData.ingredients.map((ingridients: any) => {
      if (parseFloat(ingridients.id) !== parseFloat(id)) return ingridients;
      return {
        ...ingridients,
        initial_piece: ingridients.piece,
        piece: thisPiece,
      };
    }),
  };

  const newColumnsDirectAdd = directAddedIngridients.map((ingridients: any) => {
    if (parseFloat(ingridients.id) !== parseFloat(id)) return ingridients;
    return {
      ...ingridients,
      piece: thisPiece,
    };
  });

  popupClass('hidden');
  updateFunction(newColumns);
  setRecipeChanged(true);
  setDirectAddedIngridients(newColumnsDirectAdd);
}

// Called if a user will edit a API ingridient (recipe and ingridient list) and go to the change amount and piece modal. If the user there change the piece this function will calculate new values
function editIngridientPieceAPI(
  value: string | undefined,
  id: any,
  recipeData: any,
  updateFunction: any,
  setRecipeChanged: any,
  ingridientData: any,
  popupClass: any,
  serving_data: any,
  serving_id: string,
  setDirectAddedIngridients: any,
  directAddedIngridients: any
) {
  let ingridientKcal = 0;
  let ingridientKh = 0;
  let ingridientEw = 0;
  let ingridientFt = 0;
  let getIngridientServingData: any;
  let thisServingDataArray = [] as any;
  let currentKcal = recipeData.kcal_total;
  let currentKH = recipeData.carbohydrates_total;
  let currentEW = recipeData.protein_total;
  let currentFT = recipeData.fat_total;

  thisServingDataArray = serving_data;

  if (serving_data instanceof Array) {
    if (value === 'g' || value === 'ml') {
      getIngridientServingData = [thisServingDataArray[0]];
    } else {
      getIngridientServingData = thisServingDataArray.filter((item: any) => item.serving_id === serving_id);
    }
  } else {
    getIngridientServingData = [serving_data];
  }

  let thisPiece = '';

  if (value === 'g' || value === 'ml') {
    thisPiece = value;
  } else if (getIngridientServingData[0].serving_description.includes('1 ')) {
    if (
      getIngridientServingData[0].serving_description.includes('g)') ||
      getIngridientServingData[0].serving_description.includes('ml)')
    ) {
      thisPiece = getIngridientServingData[0].serving_description.substr(
        2,
        getIngridientServingData[0].serving_description.indexOf(' (') - 2
      );
    } else {
      thisPiece = getIngridientServingData[0].serving_description.substr(
        2,
        getIngridientServingData[0].serving_description.length
      );
    }
  } else {
    thisPiece = getIngridientServingData[0].serving_description;
  }

  if (thisPiece.includes('(')) {
    thisPiece = thisPiece.substr(0, thisPiece.indexOf('(') - 1);
  }

  if (value !== 'g' && value !== 'ml') {
    ingridientKcal = Math.round(parseFloat(ingridientData.amount) * parseFloat(getIngridientServingData[0].calories));

    ingridientKh = Math.round(parseFloat(ingridientData.amount) * parseFloat(getIngridientServingData[0].carbohydrate));

    ingridientEw = Math.round(parseFloat(ingridientData.amount) * parseFloat(getIngridientServingData[0].protein));

    ingridientFt = Math.round(parseFloat(ingridientData.amount) * parseFloat(getIngridientServingData[0].fat));
  } else if (getIngridientServingData[0].metric_serving_amount) {
    ingridientKcal = Math.round(
      (parseFloat(ingridientData.amount) /
        parseFloat(
          getIngridientServingData[0].metric_serving_amount.substr(
            0,
            getIngridientServingData[0].metric_serving_amount.indexOf('.')
          )
        )) *
        parseFloat(getIngridientServingData[0].calories)
    );
    ingridientKh = Math.round(
      (parseFloat(ingridientData.amount) /
        parseFloat(
          getIngridientServingData[0].metric_serving_amount.substr(
            0,
            getIngridientServingData[0].metric_serving_amount.indexOf('.')
          )
        )) *
        parseFloat(getIngridientServingData[0].carbohydrate)
    );
    ingridientEw = Math.round(
      (parseFloat(ingridientData.amount) /
        parseFloat(
          getIngridientServingData[0].metric_serving_amount.substr(
            0,
            getIngridientServingData[0].metric_serving_amount.indexOf('.')
          )
        )) *
        parseFloat(getIngridientServingData[0].protein)
    );
    ingridientFt = Math.round(
      (parseFloat(ingridientData.amount) /
        parseFloat(
          getIngridientServingData[0].metric_serving_amount.substr(
            0,
            getIngridientServingData[0].metric_serving_amount.indexOf('.')
          )
        )) *
        parseFloat(getIngridientServingData[0].fat)
    );
  } else {
    ingridientKcal = Math.round(
      (parseFloat(ingridientData.amount) / 100) * parseFloat(getIngridientServingData[0].calories)
    );
    ingridientKh = Math.round(
      (parseFloat(ingridientData.amount) / 100) * parseFloat(getIngridientServingData[0].carbohydrate)
    );
    ingridientEw = Math.round(
      (parseFloat(ingridientData.amount) / 100) * parseFloat(getIngridientServingData[0].protein)
    );
    ingridientFt = Math.round((parseFloat(ingridientData.amount) / 100) * parseFloat(getIngridientServingData[0].fat));
  }

  currentKcal = Math.round(parseFloat(currentKcal) - ingridientData.kcal_total + ingridientKcal);
  currentKH = Math.round(parseFloat(currentKH) - ingridientData.carbohydrates_total + ingridientKh);
  currentEW = Math.round(parseFloat(currentEW) - ingridientData.protein_total + ingridientEw);
  currentFT = Math.round(parseFloat(currentFT) - ingridientData.fat_total + ingridientFt);

  const newColumns = {
    ...recipeData,
    kcal_total: currentKcal,
    carbohydrates_total: currentKH,
    protein_total: currentEW,
    fat_total: currentFT,
    ingredients: recipeData.ingredients.map((ingridients: any) => {
      if (parseFloat(ingridients.id) !== parseFloat(id)) return ingridients;
      return {
        ...ingridients,
        piece: thisPiece,
        kcal_total: ingridientKcal,
        carbohydrates_total: ingridientKh,
        protein_total: ingridientEw,
        fat_total: ingridientFt,
      };
    }),
  };

  const newColumnsDirectAdd = directAddedIngridients.map((ingridients: any) => {
    if (parseFloat(ingridients.id) !== parseFloat(id)) return ingridients;
    return {
      ...ingridients,
      piece: thisPiece,
      kcal_total: ingridientKcal,
      carbohydrates_total: ingridientKh,
      protein_total: ingridientEw,
      fat_total: ingridientFt,
    };
  });

  popupClass('hidden');
  updateFunction(newColumns);
  setRecipeChanged(true);
  setDirectAddedIngridients(newColumnsDirectAdd);
}

function editIngridientAmount(
  event: any,
  id: any,
  recipeData: any,
  updateFunction: any,
  setRecipeChanged: any,
  ingridientData: any,
  getIngridient: any,
  setDirectAddedIngridients: any,
  directAddedIngridients: any,
  setWidth: any
) {
  let thisCurrentAmount = event.target.value;
  let currentCalculatedKcal;
  let currentCalculatedKH;
  let currentCalculatedEW;
  let currentCalculatedFT;
  let ingridientKcal;
  let ingridientKh;
  let ingridientEw;
  let ingridientFt;
  let ingridientKcalNew;
  let ingridientKhNew;
  let ingridientEwNew;
  let ingridientFtNew;
  let currentKcal = recipeData.kcal_total;
  let currentKH = recipeData.carbohydrates_total;
  let currentEW = recipeData.protein_total;
  let currentFT = recipeData.fat_total;

  setWidth(event.target.value.length);

  // Replace Comma with Point for calculating results
  thisCurrentAmount = thisCurrentAmount.replace(',', '.');

  if (Number.isNaN(parseFloat(thisCurrentAmount))) {
    thisCurrentAmount = 0;
  }

  if (thisCurrentAmount === '') {
    thisCurrentAmount = 1;
  }

  if (ingridientData.piece !== 'g' && ingridientData.piece !== 'ml') {
    currentCalculatedKcal =
      ((parseFloat(ingridientData.amount) * parseFloat(ingridientData.preselect_g)) / 100) *
      parseFloat(getIngridient.kcal_100g);

    currentCalculatedKH =
      ((parseFloat(ingridientData.amount) * parseFloat(ingridientData.preselect_g)) / 100) *
      parseFloat(getIngridient.carbohydrates_100g);

    currentCalculatedEW =
      ((parseFloat(ingridientData.amount) * parseFloat(ingridientData.preselect_g)) / 100) *
      parseFloat(getIngridient.protein_100g);

    currentCalculatedFT =
      ((parseFloat(ingridientData.amount) * parseFloat(ingridientData.preselect_g)) / 100) *
      parseFloat(getIngridient.fat_100g);
  } else {
    currentCalculatedKcal = (parseFloat(ingridientData.amount) / 100) * parseFloat(getIngridient.kcal_100g);

    currentCalculatedKH = (parseFloat(ingridientData.amount) / 100) * parseFloat(getIngridient.carbohydrates_100g);

    currentCalculatedEW = (parseFloat(ingridientData.amount) / 100) * parseFloat(getIngridient.protein_100g);

    currentCalculatedFT = (parseFloat(ingridientData.amount) / 100) * parseFloat(getIngridient.fat_100g);
  }

  if (ingridientData.piece !== 'g' && ingridientData.piece !== 'ml') {
    ingridientKcal = Math.round(currentCalculatedKcal);
    ingridientKcalNew = Math.round(
      ((parseFloat(thisCurrentAmount) * parseFloat(ingridientData.preselect_g)) / 100) *
        parseFloat(getIngridient.kcal_100g)
    );

    ingridientKh = Math.round(currentCalculatedKH);
    ingridientKhNew = Math.round(
      ((parseFloat(thisCurrentAmount) * parseFloat(ingridientData.preselect_g)) / 100) *
        parseFloat(getIngridient.carbohydrates_100g)
    );

    ingridientEw = Math.round(currentCalculatedEW);
    ingridientEwNew = Math.round(
      ((parseFloat(thisCurrentAmount) * parseFloat(ingridientData.preselect_g)) / 100) *
        parseFloat(getIngridient.protein_100g)
    );

    ingridientFt = Math.round(currentCalculatedFT);
    ingridientFtNew = Math.round(
      ((parseFloat(thisCurrentAmount) * parseFloat(ingridientData.preselect_g)) / 100) *
        parseFloat(getIngridient.fat_100g)
    );
  } else {
    ingridientKcal = Math.round(currentCalculatedKcal);
    ingridientKcalNew = Math.round((parseFloat(getIngridient.kcal_100g) / 100) * thisCurrentAmount);

    ingridientKh = Math.round(currentCalculatedKH);
    ingridientKhNew = Math.round((parseFloat(getIngridient.carbohydrates_100g) / 100) * thisCurrentAmount);

    ingridientEw = Math.round(currentCalculatedEW);
    ingridientEwNew = Math.round((parseFloat(getIngridient.protein_100g) / 100) * thisCurrentAmount);

    ingridientFt = Math.round(currentCalculatedFT);
    ingridientFtNew = Math.round((parseFloat(getIngridient.fat_100g) / 100) * thisCurrentAmount);
  }

  currentKcal = Math.round(parseFloat(currentKcal) - ingridientKcal + ingridientKcalNew);
  currentKH = Math.round(parseFloat(currentKH) - ingridientKh + ingridientKhNew);
  currentEW = Math.round(parseFloat(currentEW) - ingridientEw + ingridientEwNew);
  currentFT = Math.round(parseFloat(currentFT) - ingridientFt + ingridientFtNew);

  const newColumns = {
    ...recipeData,
    kcal_total: currentKcal,
    carbohydrates_total: currentKH,
    protein_total: currentEW,
    fat_total: currentFT,
    ingredients: recipeData.ingredients.map((ingridients: any) => {
      if (parseFloat(ingridients.id) !== parseFloat(id)) return ingridients;
      return {
        ...ingridients,
        amount: thisCurrentAmount,
      };
    }),
  };

  const newColumnsDirectAdd = directAddedIngridients.map((ingridients: any) => {
    if (parseFloat(ingridients.id) !== parseFloat(id)) return ingridients;
    return {
      ...ingridients,
      amount: thisCurrentAmount,
    };
  });

  setDirectAddedIngridients(newColumnsDirectAdd);
  updateFunction(newColumns);
  setRecipeChanged(true);
}

function editIngridientAmountAPI(
  event: any,
  recipeData: any,
  updateFunction: any,
  setRecipeChanged: any,
  id: string,
  piece: string,
  kcal_total: string,
  carbohydrates_total: string,
  protein_total: string,
  fat_total: string,
  serving_id: string,
  serving_data: any,
  setDirectAddedIngridients: any,
  directAddedIngridients: any,
  setWidth: any
) {
  let thisCurrentKcalComplete = 0;
  let thisCurrentKHComplete = 0;
  let thisCurrentEWComplete = 0;
  let thisCurrentFTComplete = 0;
  let getIngridientServingData: any;
  let thisCurrentKcalCompleteBefore = 0;
  let thisCurrentKHCompleteBefore = 0;
  let thisCurrentEWCompleteBefore = 0;
  let thisCurrentFTCompleteBefore = 0;
  let thisServingDataArray = [] as any;
  const currentKcal = recipeData.kcal_total;
  const currentKH = recipeData.carbohydrates_total;
  const currentEW = recipeData.protein_total;
  const currentFT = recipeData.fat_total;
  let thisCurrentAmount = event.target.value;

  setWidth(event.target.value.length);

  // Replace Comma with Point for calculating results
  thisCurrentAmount = thisCurrentAmount.replace(',', '.');

  if (Number.isNaN(parseFloat(thisCurrentAmount))) {
    thisCurrentAmount = 0;
  }

  if (thisCurrentAmount === '') {
    thisCurrentAmount = 1;
  }

  thisServingDataArray = serving_data;

  if (serving_data instanceof Array) {
    if (piece === 'g' || piece === 'ml') {
      getIngridientServingData = thisServingDataArray.filter((item: any) => item.serving_id === serving_id);
    } else {
      getIngridientServingData = thisServingDataArray.filter((item: any) => item.serving_id === serving_id);
    }
  } else {
    getIngridientServingData = [serving_data];
  }

  if (piece !== 'g' && piece !== 'ml') {
    thisCurrentKcalComplete = Math.round(parseFloat(currentKcal) - parseFloat(kcal_total));
    thisCurrentKcalComplete = Math.round(
      thisCurrentKcalComplete + parseFloat(thisCurrentAmount) * parseFloat(getIngridientServingData[0].calories)
    );
    thisCurrentKcalCompleteBefore = parseFloat(thisCurrentAmount) * parseFloat(getIngridientServingData[0].calories);

    thisCurrentKHComplete = Math.round(parseFloat(currentKH) - parseFloat(carbohydrates_total));
    thisCurrentKHComplete = Math.round(
      thisCurrentKHComplete + parseFloat(thisCurrentAmount) * parseFloat(getIngridientServingData[0].carbohydrate)
    );
    thisCurrentKHCompleteBefore = parseFloat(thisCurrentAmount) * parseFloat(getIngridientServingData[0].carbohydrate);

    thisCurrentEWComplete = Math.round(parseFloat(currentEW) - parseFloat(protein_total));
    thisCurrentEWComplete = Math.round(
      thisCurrentEWComplete + parseFloat(thisCurrentAmount) * parseFloat(getIngridientServingData[0].protein)
    );
    thisCurrentEWCompleteBefore = parseFloat(thisCurrentAmount) * parseFloat(getIngridientServingData[0].protein);

    thisCurrentFTComplete = Math.round(parseFloat(currentFT) - parseFloat(fat_total));
    thisCurrentFTComplete = Math.round(
      thisCurrentFTComplete + parseFloat(thisCurrentAmount) * parseFloat(getIngridientServingData[0].fat)
    );
    thisCurrentFTCompleteBefore = parseFloat(thisCurrentAmount) * parseFloat(getIngridientServingData[0].fat);
  } else {
    thisCurrentKcalComplete = Math.round(parseFloat(currentKcal) - parseFloat(kcal_total));
    thisCurrentKHComplete = Math.round(parseFloat(currentKH) - parseFloat(carbohydrates_total));
    thisCurrentEWComplete = Math.round(parseFloat(currentEW) - parseFloat(protein_total));
    thisCurrentFTComplete = Math.round(parseFloat(currentFT) - parseFloat(fat_total));

    if (getIngridientServingData[0].metric_serving_amount) {
      thisCurrentKcalComplete = Math.round(
        thisCurrentKcalComplete +
          (parseFloat(thisCurrentAmount) /
            parseFloat(
              getIngridientServingData[0].metric_serving_amount.substr(
                0,
                getIngridientServingData[0].metric_serving_amount.indexOf('.')
              )
            )) *
            parseFloat(getIngridientServingData[0].calories)
      );
      thisCurrentKcalCompleteBefore =
        (parseFloat(thisCurrentAmount) /
          parseFloat(
            getIngridientServingData[0].metric_serving_amount.substr(
              0,
              getIngridientServingData[0].metric_serving_amount.indexOf('.')
            )
          )) *
        parseFloat(getIngridientServingData[0].calories);

      thisCurrentKHComplete = Math.round(
        thisCurrentKHComplete +
          (parseFloat(thisCurrentAmount) /
            parseFloat(
              getIngridientServingData[0].metric_serving_amount.substr(
                0,
                getIngridientServingData[0].metric_serving_amount.indexOf('.')
              )
            )) *
            parseFloat(getIngridientServingData[0].carbohydrate)
      );
      thisCurrentKHCompleteBefore =
        (parseFloat(thisCurrentAmount) /
          parseFloat(
            getIngridientServingData[0].metric_serving_amount.substr(
              0,
              getIngridientServingData[0].metric_serving_amount.indexOf('.')
            )
          )) *
        parseFloat(getIngridientServingData[0].carbohydrate);

      thisCurrentEWComplete = Math.round(
        thisCurrentEWComplete +
          (parseFloat(thisCurrentAmount) /
            parseFloat(
              getIngridientServingData[0].metric_serving_amount.substr(
                0,
                getIngridientServingData[0].metric_serving_amount.indexOf('.')
              )
            )) *
            parseFloat(getIngridientServingData[0].protein)
      );
      thisCurrentEWCompleteBefore =
        (parseFloat(thisCurrentAmount) /
          parseFloat(
            getIngridientServingData[0].metric_serving_amount.substr(
              0,
              getIngridientServingData[0].metric_serving_amount.indexOf('.')
            )
          )) *
        parseFloat(getIngridientServingData[0].protein);

      thisCurrentFTComplete = Math.round(
        thisCurrentFTComplete +
          (parseFloat(thisCurrentAmount) /
            parseFloat(
              getIngridientServingData[0].metric_serving_amount.substr(
                0,
                getIngridientServingData[0].metric_serving_amount.indexOf('.')
              )
            )) *
            parseFloat(getIngridientServingData[0].fat)
      );
      thisCurrentFTCompleteBefore =
        (parseFloat(thisCurrentAmount) /
          parseFloat(
            getIngridientServingData[0].metric_serving_amount.substr(
              0,
              getIngridientServingData[0].metric_serving_amount.indexOf('.')
            )
          )) *
        parseFloat(getIngridientServingData[0].fat);
    } else {
      thisCurrentKcalComplete = Math.round(
        thisCurrentKcalComplete +
          (parseFloat(thisCurrentAmount) / 100) * parseFloat(getIngridientServingData[0].calories)
      );
      thisCurrentKcalCompleteBefore =
        (parseFloat(thisCurrentAmount) / 100) * parseFloat(getIngridientServingData[0].calories);

      thisCurrentKHComplete = Math.round(
        thisCurrentKHComplete +
          (parseFloat(thisCurrentAmount) / 100) * parseFloat(getIngridientServingData[0].carbohydrate)
      );
      thisCurrentKHCompleteBefore =
        (parseFloat(thisCurrentAmount) / 100) * parseFloat(getIngridientServingData[0].carbohydrate);

      thisCurrentEWComplete = Math.round(
        thisCurrentEWComplete + (parseFloat(thisCurrentAmount) / 100) * parseFloat(getIngridientServingData[0].protein)
      );
      thisCurrentEWCompleteBefore =
        (parseFloat(thisCurrentAmount) / 100) * parseFloat(getIngridientServingData[0].protein);

      thisCurrentFTComplete = Math.round(
        thisCurrentFTComplete + (parseFloat(thisCurrentAmount) / 100) * parseFloat(getIngridientServingData[0].fat)
      );
      thisCurrentFTCompleteBefore = (parseFloat(thisCurrentAmount) / 100) * parseFloat(getIngridientServingData[0].fat);
    }
  }

  const thisPiece = piece;

  /* if (piece === 'g' || piece === 'ml') {
    thisPiece = piece;
  } else if (getIngridientServingData[0].serving_description.includes('1 ')) {
    if (
      getIngridientServingData[0].serving_description.includes('g)') ||
      getIngridientServingData[0].serving_description.includes('ml)')
    ) {
      thisPiece = getIngridientServingData[0].serving_description.substr(
        2,
        getIngridientServingData[0].serving_description.indexOf(' (') - 2
      );
    } else {
      thisPiece = getIngridientServingData[0].serving_description.substr(
        2,
        getIngridientServingData[0].serving_description.length
      );
    }
  } else {
    thisPiece = getIngridientServingData[0].serving_description;
  }

  if (thisPiece.includes('(')) {
    thisPiece = thisPiece.substr(0, thisPiece.indexOf('(') - 1);
  } */

  /*
  TODO: Ingridient Types as context
  let getPiece = this.state.ingridient_types.filter(t => t.label === thisPiece);
  if (getPiece[0] === undefined) {
    getPiece = this.state.ingridient_types.filter(t => t.label_long === thisPiece);
  } 

  if (thisPiece !== 'g' && thisPiece !== 'ml' && amount > 1) {
    if (getPiece[0] !== undefined) {
      thisPiece = getPiece[0].label_long;
    } else {
      thisPiece = thisPiece;
    }
  } else if (getPiece[0] !== undefined) {
    thisPiece = getPiece[0].label;
  } else {
    thisPiece = thisPiece;
  } */

  const newColumns = {
    ...recipeData,
    kcal_total: thisCurrentKcalComplete,
    carbohydrates_total: thisCurrentKHComplete,
    protein_total: thisCurrentEWComplete,
    fat_total: thisCurrentFTComplete,
    ingredients: recipeData.ingredients.map((ingridients: any) => {
      if (parseFloat(ingridients.id) !== parseFloat(id)) return ingridients;
      return {
        ...ingridients,
        amount: thisCurrentAmount,
        piece: thisPiece,
        serving_id: getIngridientServingData[0].serving_id,
        serving_unit: getIngridientServingData[0].metric_serving_unit,
        preselect_g:
          (getIngridientServingData[0].metric_serving_amount &&
            getIngridientServingData[0].metric_serving_amount.substr(
              0,
              getIngridientServingData[0].metric_serving_amount.indexOf('.')
            )) ||
          100,
        kcal_total: thisCurrentKcalCompleteBefore,
        carbohydrates_total: thisCurrentKHCompleteBefore,
        protein_total: thisCurrentEWCompleteBefore,
        fat_total: thisCurrentFTCompleteBefore,
      };
    }),
  };
  const newColumnsDirectAdd = directAddedIngridients.map((ingridients: any) => {
    if (parseFloat(ingridients.id) !== parseFloat(id)) return ingridients;
    return {
      ...ingridients,
      amount: thisCurrentAmount,
      piece: thisPiece,
      serving_id: getIngridientServingData[0].serving_id,
      serving_unit: getIngridientServingData[0].metric_serving_unit,
      preselect_g:
        (getIngridientServingData[0].metric_serving_amount &&
          getIngridientServingData[0].metric_serving_amount.substr(
            0,
            getIngridientServingData[0].metric_serving_amount.indexOf('.')
          )) ||
        100,
      kcal_total: thisCurrentKcalCompleteBefore,
      carbohydrates_total: thisCurrentKHCompleteBefore,
      protein_total: thisCurrentEWCompleteBefore,
      fat_total: thisCurrentFTCompleteBefore,
    };
  });

  updateFunction(newColumns);
  setRecipeChanged(true);
  setDirectAddedIngridients(newColumnsDirectAdd);
}

function deleteIngridientItem(
  id: any,
  recipeData: any,
  updateFunction: any,
  setRecipeChanged: any,
  ingridientData: any,
  getIngridient: any,
  setDirectAddedIngridients: any,
  directAddedIngridients: any,
  ingredientList?: any
) {
  let ingridientKcal;
  let ingridientKh;
  let ingridientEw;
  let ingridientFt;
  let thisRecipeData = recipeData;

  if (ingridientData.piece !== 'g' && ingridientData.piece !== 'ml') {
    ingridientKcal = Math.round(
      ((parseFloat(ingridientData.amount) * parseFloat(ingridientData.preselect_g)) / 100) *
        parseFloat(getIngridient.kcal_100g)
    );
    ingridientKh = Math.round(
      ((parseFloat(ingridientData.amount) * parseFloat(ingridientData.preselect_g)) / 100) *
        parseFloat(getIngridient.carbohydrates_100g)
    );
    ingridientEw = Math.round(
      ((parseFloat(ingridientData.amount) * parseFloat(ingridientData.preselect_g)) / 100) *
        parseFloat(getIngridient.protein_100g)
    );
    ingridientFt = Math.round(
      ((parseFloat(ingridientData.amount) * parseFloat(ingridientData.preselect_g)) / 100) *
        parseFloat(getIngridient.fat_100g)
    );
  } else {
    ingridientKcal = Math.round((parseFloat(getIngridient.kcal_100g) / 100) * ingridientData.amount);
    ingridientKh = Math.round((parseFloat(getIngridient.carbohydrates_100g) / 100) * ingridientData.amount);
    ingridientEw = Math.round((parseFloat(getIngridient.protein_100g) / 100) * ingridientData.amount);
    ingridientFt = Math.round((parseFloat(getIngridient.fat_100g) / 100) * ingridientData.amount);
  }

  const checkIncompabilityArray = [] as any;

  const newColumns = {
    ...thisRecipeData,
    uid: Math.random().toString(),
    kcal_total: Math.round(parseFloat(recipeData.kcal_total) - ingridientKcal),
    carbohydrates_total: `${Math.round(parseFloat(recipeData.carbohydrates_total) - ingridientKh)}`,
    protein_total: `${Math.round(parseFloat(recipeData.protein_total) - ingridientEw)}`,
    fat_total: `${Math.round(parseFloat(recipeData.fat_total) - ingridientFt)}`,
    ingredients: [...recipeData.ingredients.filter((t: any) => t.id !== id)],
  };

  // check incombality options of ingredients
  for (let i = 0; i < newColumns.ingredients.length; i += 1) {
    const getThisIngridient = ingredientList?.find((item: any) => item.name === newColumns.ingredients[i].name);

    intolerancesOption.forEach(function (key) {
      if (
        getThisIngridient !== undefined &&
        typeof getThisIngridient[key.toLowerCase()] !== undefined &&
        getThisIngridient[key.toLowerCase()] !== null
      ) {
        if (getThisIngridient[key.toLowerCase()] === true) {
          checkIncompabilityArray.push({ name: [key.toLowerCase()], status: true });
        }
      }
    });
  }

  // Copy newColumns to variable because this needs to be updated in the following sections
  thisRecipeData = { ...newColumns };

  // First set all to false
  for (let f = 0; f < intolerancesOption.length; f += 1) {
    thisRecipeData = { ...thisRecipeData, [intolerancesOption[f].toLowerCase()]: false };
  }

  // Set elements true if incompatibility exists
  for (let g = 0; g < checkIncompabilityArray.length; g += 1) {
    thisRecipeData = { ...thisRecipeData, [checkIncompabilityArray[g].name]: true };
  }

  updateFunction(thisRecipeData);
  setRecipeChanged(true);
  setDirectAddedIngridients(directAddedIngridients.filter((item: any) => item.id !== id));
}

function deleteIngridientItemAPI(
  id: string,
  kcal_total: string,
  carbohydrates_total: string,
  protein_total: string,
  fat_total: string,
  recipeData: any,
  updateFunction: any,
  setRecipeChanged: any,
  setDirectAddedIngridients: any,
  directAddedIngridients: any
) {
  const newColumns = {
    ...recipeData,
    uid: Math.random().toString(),
    kcal_total: Math.round(parseFloat(recipeData.kcal_total) - parseFloat(kcal_total)),
    carbohydrates_total: Math.round(parseFloat(recipeData.carbohydrates_total) - parseFloat(carbohydrates_total)),
    protein_total: Math.round(parseFloat(recipeData.protein_total) - parseFloat(protein_total)),
    fat_total: Math.round(parseFloat(recipeData.fat_total) - parseFloat(fat_total)),
    ingredients: [...recipeData.ingredients.filter((t: any) => t.id !== id)],
  };

  updateFunction(newColumns);
  setRecipeChanged(true);
  setDirectAddedIngridients(directAddedIngridients.filter((item: any) => item.id !== id));
}

function getPrimaryPieceValue(ingridientData: any, getIngridientData: any, type: string) {
  if (type === 'API') {
    let thisPieceValue = '';

    if (ingridientData.serving_data.serving && ingridientData.serving_data.serving instanceof Array) {
      ingridientData.serving_data.serving.map((serving: any, index: any) => {
        if (
          serving.measurement_description !== 'g' &&
          serving.measurement_description !== 'ml' &&
          serving.serving_description !== '100ml' &&
          serving.serving_description !== '100g' &&
          serving.is_default === '1' &&
          !serving.serving_description.includes('(')
        ) {
          thisPieceValue =
            (serving.serving_description.includes('1 ') &&
              serving.serving_description.substr(2, serving.serving_description.length)) ||
            `${serving.serving_description} `;

          if (
            serving.measurement_description !== 'g' &&
            serving.measurement_description !== 'ml' &&
            !serving.measurement_description.includes('g)') &&
            !serving.measurement_description.includes('ml)')
          ) {
            thisPieceValue = `${thisPieceValue} (${serving.metric_serving_amount.substr(
              0,
              serving.metric_serving_amount.indexOf('.')
            )} ${serving.metric_serving_unit})`;
          }
        }

        if (
          serving.measurement_description !== 'g' &&
          serving.measurement_description !== 'ml' &&
          serving.serving_description !== '100ml' &&
          serving.serving_description !== '100g' &&
          serving.is_default === '1' &&
          serving.serving_description.includes('(')
        ) {
          thisPieceValue =
            (serving.serving_description.includes('1 ') &&
              serving.serving_description.substr(2, serving.serving_description.indexOf('(') - 3)) ||
            `${serving.serving_description.substr(0, serving.serving_description.indexOf('(') - 3)} `;

          if (
            serving.measurement_description !== 'g' &&
            serving.measurement_description !== 'ml' &&
            !serving.measurement_description.includes('g)') &&
            !serving.measurement_description.includes('ml)')
          ) {
            thisPieceValue = `${thisPieceValue} (${serving.metric_serving_amount.substr(
              0,
              serving.metric_serving_amount.indexOf('.')
            )} ${serving.metric_serving_unit})`;
          }
        }

        return '';
      });

      return thisPieceValue;
    }

    if (
      ingridientData.serving_data.serving &&
      !(ingridientData.serving_data.serving instanceof Array) &&
      ingridientData.serving_data.serving.serving_description !== '100ml' &&
      ingridientData.serving_data.serving.serving_description !== '100g' &&
      !ingridientData.serving_data.serving.serving_description.includes('(')
    ) {
      thisPieceValue =
        (ingridientData.serving_data.serving.serving_description.includes('1 ') &&
          ingridientData.serving_data.serving.serving_description.substr(
            2,
            ingridientData.serving_data.serving.serving_description.length
          )) ||
        ingridientData.serving_data.serving.serving_description;

      if (
        ingridientData.serving_data.serving.measurement_description !== 'g' &&
        ingridientData.serving_data.serving.measurement_description !== 'ml' &&
        !ingridientData.serving_data.serving.measurement_description.includes('g)') &&
        !ingridientData.serving_data.serving.measurement_description.includes('ml)') &&
        ingridientData.serving_data.serving.metric_serving_amount
      ) {
        thisPieceValue = `${thisPieceValue} (${ingridientData.serving_data.serving.metric_serving_amount.substr(
          0,
          ingridientData.serving_data.serving.metric_serving_amount.indexOf('.')
        )} ${ingridientData.serving_data.serving.metric_serving_unit})`;
      }

      return thisPieceValue;
    }

    if (
      ingridientData.serving_data.serving &&
      !(ingridientData.serving_data.serving instanceof Array) &&
      ingridientData.serving_data.serving.serving_description !== '100ml' &&
      ingridientData.serving_data.serving.serving_description !== '100g' &&
      ingridientData.serving_data.serving.serving_description.includes('(')
    ) {
      thisPieceValue =
        (ingridientData.serving_data.serving.serving_description.includes('1 ') &&
          ingridientData.serving_data.serving.serving_description.substr(
            2,
            ingridientData.serving_data.serving.serving_description.indexOf('(') - 3
          )) ||
        ingridientData.serving_data.serving.serving_description.substr(
          0,
          ingridientData.serving_data.serving.serving_description.indexOf('(') - 3
        );

      if (
        ingridientData.serving_data.serving.measurement_description !== 'g' &&
        ingridientData.serving_data.serving.measurement_description !== 'ml' &&
        !ingridientData.serving_data.serving.measurement_description.includes('g)') &&
        !ingridientData.serving_data.serving.measurement_description.includes('ml)') &&
        ingridientData.serving_data.serving.metric_serving_amount
      ) {
        thisPieceValue = `${thisPieceValue} (${ingridientData.serving_data.serving.metric_serving_amount.substr(
          0,
          ingridientData.serving_data.serving.metric_serving_amount.indexOf('.')
        )} ${ingridientData.serving_data.serving.metric_serving_unit})`;
      }

      return thisPieceValue;
    }
  }

  if (ingridientData?.piece !== 'g' && ingridientData?.piece !== 'ml') {
    if (ingridientData?.default_piece !== undefined) {
      return `${ingridientData?.piece} (${ingridientData?.preselect_g}${ingridientData?.default_piece})`;
    }
    return `${ingridientData?.piece} (${ingridientData?.preselect_g}g)`;
  }
  if (getIngridientData?.default_piece !== undefined) {
    return `${getIngridientData?.preselect_type} (${getIngridientData?.preselect_g}${getIngridientData?.default_piece})`;
  }
  if (getIngridientData?.piece === 'ml') {
    return `${getIngridientData?.preselect_type} (${getIngridientData?.preselect_g}ml)`;
  }
  return `${getIngridientData?.preselect_type} (${getIngridientData?.preselect_g}g)`;
}

const IngridientItem: React.FC<Props> = ({
  ingridientData,
  recipeData,
  updateFunction,
  setRecipeChanged,
  setDirectAddedIngridients,
  directAddedIngridients,
  defaultValue,
}) => {
  const [piecePopupClass, setPiecePopupClass] = useState('hidden');
  const [infoPopupClass, setInfoPopupClass] = useState('hidden');
  const [initialAmount, setInitialAmount] = useState(ingridientData.amount);
  const getIngridient = useContext(MainContext).ingredientList?.find(item => item.name === ingridientData.name);
  const getRecipeIngridient = recipeData.ingredients.find((item: any) => item.id === ingridientData.id);

  const [width, setWidth] = useState(getRecipeIngridient.amount.toString().length);

  const location = useLocation<LocationState>();

  const { ingredientList } = useContext(MainContext);

  const editIngridientRef = useRef<HTMLInputElement>(null);

  let getDirectAddedAmount;

  if (directAddedIngridients) {
    getDirectAddedAmount = directAddedIngridients.map((ingridients: any) => {
      if (parseFloat(ingridients.id) !== parseFloat(ingridientData.id)) return null;
      return ingridients;
    });

    if (
      getDirectAddedAmount[0] &&
      getDirectAddedAmount[0].amountBefore !== undefined &&
      getDirectAddedAmount[0].amount !== getDirectAddedAmount[0].amountBefore
    ) {
      if (initialAmount !== getDirectAddedAmount[0].amount) {
        setInitialAmount(getDirectAddedAmount[0].amount);
      }
    }
  }

  function clickIngridientAmount() {
    if (editIngridientRef.current) {
      editIngridientRef.current.select();
    }
  }

  useEffect(() => {
    setWidth(getRecipeIngridient.amount.toString().length);
  }, [getRecipeIngridient]);

  return (
    <>
      <div className="pb-6">
        <div className="flex">
          <div className="font-extralight text-16 flex gap-1 relative cursor-pointer">
            <span
              className="my-auto"
              onClick={() =>
                (/hidden/.exec(infoPopupClass) && setInfoPopupClass('hidden')) || setInfoPopupClass('block')
              }
              aria-hidden="true"
            >
              {ingridientData.name}
              <span className="inline-block my-auto">
                <InformationCircleIcon width={20} height={15} className="text-white" />
              </span>
            </span>
            <div className={infoPopupClass}>
              <div className={styles.tooltip}>
                <div className="relative">
                  <div className="bg-lightDarkGray">
                    <span className="absolute right-10 top-15">
                      <XIcon
                        width={25}
                        height={25}
                        className="text-brownSemiDark mx-auto cursor-pointer"
                        onClick={() => setInfoPopupClass('hidden')}
                      />
                    </span>
                    <div className="pl-10 pr-40 py-15">
                      <div className="font-bold">{ingridientData.name}</div>
                      <div>
                        {ingridientData.piece === 'g' || (ingridientData.piece === 'ml' && 'Menge: ')}
                        {ingridientData.amount}
                        {ingridientData.piece.match(/^\d/) && 'x'} {ingridientData.piece}{' '}
                        {ingridientData.piece !== 'g' &&
                          ingridientData.piece !== 'ml' &&
                          `(${ingridientData.amount * ingridientData.preselect_g}`}
                        {ingridientData.serving_unit &&
                          ingridientData.piece !== 'g' &&
                          ingridientData.piece !== 'ml' &&
                          `${ingridientData.serving_unit})`}
                        {!ingridientData.serving_data &&
                          ingridientData.piece !== 'g' &&
                          ingridientData.piece !== 'ml' &&
                          ingridientData.default_piece === undefined &&
                          'g)'}
                        {!ingridientData.serving_data &&
                          ingridientData.piece !== 'g' &&
                          ingridientData.piece !== 'ml' &&
                          ingridientData.default_piece !== undefined &&
                          `${ingridientData.default_piece})`}
                        {ingridientData.serving_data &&
                          !ingridientData.serving_unit &&
                          ingridientData.piece !== 'g' &&
                          ingridientData.piece !== 'ml' &&
                          'g)'}
                      </div>
                    </div>
                  </div>
                  <div className="pl-10 pt-10 pb-20 pr-10">
                    <div className="flex justify-between py-5 border-b border-opacity-30 border-white">
                      <div className="font-bold">Kalorien: </div>
                      <div className="tooltip-value kcal-txt">
                        {getIngridientMacros(ingridientData, getIngridient, 'kcal')} kcal
                      </div>
                    </div>
                    <div className="flex justify-between py-5 border-b border-opacity-30 border-white">
                      <div className="font-bold">Kohlenhydrate: </div>
                      <div className="tooltip-value kh-txt">
                        {getIngridientMacros(ingridientData, getIngridient, 'carbohydrates')}g
                      </div>
                    </div>
                    <div className="flex justify-between py-5 border-b border-opacity-30 border-white">
                      <div className="font-bold">Eiweiß: </div>
                      <div className="tooltip-value ew-txt">
                        {getIngridientMacros(ingridientData, getIngridient, 'protein')}g
                      </div>
                    </div>
                    <div className="flex justify-between pt-5">
                      <div className="font-bold">Fett: </div>
                      <div className="tooltip-value ft-txt">
                        {getIngridientMacros(ingridientData, getIngridient, 'fat')}g
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {typeof location.state !== undefined && location.state !== null && location.state?.from === 'plans' ? (
            <div className="ml-auto my-auto pr-30">
              <div className="font-extralight text-16">
                {getRecipeIngridient.amount} {ingridientData.piece}
              </div>
            </div>
          ) : (
            <div className="flex ml-auto gap-2 my-auto ">
              <div className="flex-shrink-0">
                {ingridientData.serving_data && (
                  <>
                    <CustomUserInput
                      thisValue={getRecipeIngridient.amount === 0 ? '' : getRecipeIngridient.amount}
                      name="amount"
                      thisRef={editIngridientRef}
                      onClick={clickIngridientAmount}
                      onChange={e =>
                        editIngridientAmountAPI(
                          e,
                          recipeData,
                          updateFunction,
                          setRecipeChanged,
                          ingridientData.id,
                          ingridientData.piece,
                          ingridientData.kcal_total,
                          ingridientData.carbohydrates_total,
                          ingridientData.protein_total,
                          ingridientData.fat_total,
                          ingridientData.serving_id,
                          ingridientData.serving_data.serving,
                          setDirectAddedIngridients,
                          directAddedIngridients,
                          setWidth
                        )
                      }
                      width={width}
                    />
                  </>
                )}
                {!ingridientData.serving_data && (
                  <>
                    <CustomUserInput
                      thisValue={getRecipeIngridient.amount === 0 ? '' : getRecipeIngridient.amount}
                      name="amount"
                      thisRef={editIngridientRef}
                      onClick={clickIngridientAmount}
                      onChange={e =>
                        editIngridientAmount(
                          e,
                          ingridientData.id,
                          recipeData,
                          updateFunction,
                          setRecipeChanged,
                          ingridientData,
                          getIngridient,
                          setDirectAddedIngridients,
                          directAddedIngridients,
                          setWidth
                        )
                      }
                      width={width}
                    />
                  </>
                )}
              </div>
              <div className="flex-1 relative">
                <div className="border-opacity-30">
                  <span
                    id="piece"
                    className="appearance-none block text-center py-1 px-2 font-extralight rounded-md text-16 placeholder-gray-400 focus:outline-none bg-lightDarkGray bg-opacity-20 text-white border-solid border border-white border-opacity-30 cursor-pointer"
                    role="textbox"
                    onClick={() =>
                      (/hidden/.exec(piecePopupClass) && setPiecePopupClass('hidden')) || setPiecePopupClass('block')
                    }
                    aria-hidden="true"
                  >
                    {ingridientData.piece}
                  </span>
                </div>
                <div className={piecePopupClass}>
                  <div className="absolute right-0 shadow-main bg-blackDark mt-5 z-20 text-left w-100 rounded-md">
                    {!ingridientData.serving_data &&
                      getPrimaryPieceValue(ingridientData, getIngridient, 'static') !== 'g' && (
                        <>
                          <div
                            className="pl-10 py-10 hover:bg-lightDarkGray cursor-pointer"
                            onClick={() =>
                              editIngridientPiece(
                                getPrimaryPieceValue(ingridientData, getIngridient, 'static'),
                                ingridientData.id,
                                recipeData,
                                updateFunction,
                                setRecipeChanged,
                                ingridientData,
                                getIngridient,
                                setPiecePopupClass,
                                setDirectAddedIngridients,
                                directAddedIngridients
                              )
                            }
                            aria-hidden="true"
                          >
                            {getPrimaryPieceValue(ingridientData, getIngridient, 'static')}
                          </div>
                        </>
                      )}
                    {ingridientData.serving_data &&
                      getPrimaryPieceValue(ingridientData, getIngridient, 'API') !== 'g' &&
                      !getPrimaryPieceValue(ingridientData, getIngridient, 'API').includes('undefined') && (
                        <>
                          <div
                            className="pl-10 py-10 hover:bg-lightDarkGray cursor-pointer"
                            onClick={() =>
                              editIngridientPieceAPI(
                                getPrimaryPieceValue(ingridientData, getIngridient, 'API'),
                                ingridientData.id,
                                recipeData,
                                updateFunction,
                                setRecipeChanged,
                                ingridientData,
                                setPiecePopupClass,
                                ingridientData.serving_data.serving,
                                ingridientData.serving_id,
                                setDirectAddedIngridients,
                                directAddedIngridients
                              )
                            }
                            aria-hidden="true"
                          >
                            {getPrimaryPieceValue(ingridientData, getIngridient, 'API')}
                          </div>
                        </>
                      )}
                    {!ingridientData.serving_data && (
                      <div
                        className="pl-10 py-10 hover:bg-lightDarkGray cursor-pointer"
                        onClick={() =>
                          editIngridientPiece(
                            ingridientData.default_piece !== undefined
                              ? ingridientData.default_piece
                              : ingridientData.piece === 'ml'
                              ? 'ml'
                              : 'g',
                            ingridientData.id,
                            recipeData,
                            updateFunction,
                            setRecipeChanged,
                            ingridientData,
                            getIngridient,
                            setPiecePopupClass,
                            setDirectAddedIngridients,
                            directAddedIngridients
                          )
                        }
                        aria-hidden="true"
                      >
                        {ingridientData.default_piece !== undefined
                          ? ingridientData.default_piece === 'g'
                            ? 'Gramm'
                            : ingridientData.default_piece
                          : ingridientData.piece === 'ml'
                          ? 'ml'
                          : 'Gramm'}
                      </div>
                    )}
                    {ingridientData.serving_data && (
                      <div
                        className="pl-10 py-10 hover:bg-lightDarkGray cursor-pointer"
                        onClick={() =>
                          editIngridientPieceAPI(
                            'g',
                            ingridientData.id,
                            recipeData,
                            updateFunction,
                            setRecipeChanged,
                            ingridientData,
                            setPiecePopupClass,
                            ingridientData.serving_data.serving,
                            ingridientData.serving_id,
                            setDirectAddedIngridients,
                            directAddedIngridients
                          )
                        }
                        aria-hidden="true"
                      >
                        Gramm
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="my-auto">
                {ingridientData.serving_data && (
                  <TrashIcon
                    width={20}
                    height={20}
                    className="text-brownSemiDark cursor-pointer"
                    onClick={() =>
                      deleteIngridientItemAPI(
                        ingridientData.id,
                        ingridientData.kcal_total,
                        ingridientData.carbohydrates_total,
                        ingridientData.protein_total,
                        ingridientData.fat_total,
                        recipeData,
                        updateFunction,
                        setRecipeChanged,
                        setDirectAddedIngridients,
                        directAddedIngridients
                      )
                    }
                  />
                )}
                {!ingridientData.serving_data && (
                  <TrashIcon
                    width={20}
                    height={20}
                    className="text-brownSemiDark cursor-pointer"
                    onClick={() =>
                      deleteIngridientItem(
                        ingridientData.id,
                        recipeData,
                        updateFunction,
                        setRecipeChanged,
                        ingridientData,
                        getIngridient,
                        setDirectAddedIngridients,
                        directAddedIngridients,
                        ingredientList
                      )
                    }
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default IngridientItem;
