import moment from 'moment';

const remainTrialDay = (seconds: number | undefined) => {
  if (!seconds) return -1;
  const userCreated = moment.unix(seconds).utc();
  const diffDate = moment.utc().diff(userCreated, 'days');
  return 7 - diffDate;
};

const getButtonGroupList = (beforeArray: string[], value: string) => {
  const tempList = [...beforeArray];
  const index = tempList.indexOf(value);
  if (index > -1) {
    tempList.splice(index, 1);
    return tempList;
  }
  tempList.push(value);
  return tempList;
};

const scrollToTop = (scrollContainerRef: any) => {
  setTimeout(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo(0, 0);
    }
  }, 1);
};

const scrollToElement = (scrollContainerRef: any) => {
  if (scrollContainerRef.current) {
    scrollContainerRef.current.scrollIntoView();
  }
};

const generateRandomUid = () => {
  const partOne = Math.random().toString(36).substring(2);
  const partTwo = Math.random().toString(36).substring(2);

  return partOne + partTwo;
};

const handleOpenClosePopups = (closeStateObject: any, openStateObject: any, type: string) => {
  if (type === 'both') {
    closeStateObject('hidden');
    openStateObject('block');
  } else if (type === 'open') {
    openStateObject('block');
  } else if (type === 'close') {
    closeStateObject('hidden');
  }
};

const getIngridientMacros = (ingridientData: any, getIngridient: any, type: string) => {
  if (ingridientData.piece !== 'g' && ingridientData.piece !== 'ml') {
    if (type === 'kcal' || type === 'kcal-initial') {
      if (getIngridient !== undefined) {
        if (type === 'kcal') {
          return Math.round(
            ((parseFloat(ingridientData.amount) * parseFloat(ingridientData.preselect_g)) / 100) *
              parseFloat(getIngridient.kcal_100g)
          );
        }
        return Math.round(
          ((parseFloat(ingridientData.initial_amount) * parseFloat(ingridientData.preselect_g)) / 100) *
            parseFloat(getIngridient.kcal_100g)
        );
      }
      if (ingridientData.serving_data) {
        return ingridientData.kcal_total;
      }
      return 'N/A';
    }

    if (type === 'carbohydrates' || type === 'carbohydrates-initial') {
      if (getIngridient !== undefined) {
        if (type === 'carbohydrates') {
          return Math.round(
            ((parseFloat(ingridientData.amount) * parseFloat(ingridientData.preselect_g)) / 100) *
              parseFloat(getIngridient.carbohydrates_100g)
          );
        }
        return Math.round(
          ((parseFloat(ingridientData.initial_amount) * parseFloat(ingridientData.preselect_g)) / 100) *
            parseFloat(getIngridient.carbohydrates_100g)
        );
      }
      if (ingridientData.serving_data) {
        return Math.round(ingridientData.carbohydrates_total);
      }
      return 'N/A';
    }

    if (type === 'protein' || type === 'protein-initial') {
      if (getIngridient !== undefined) {
        if (type === 'protein') {
          return Math.round(
            ((parseFloat(ingridientData.amount) * parseFloat(ingridientData.preselect_g)) / 100) *
              parseFloat(getIngridient.protein_100g)
          );
        }
        return Math.round(
          ((parseFloat(ingridientData.initial_amount) * parseFloat(ingridientData.preselect_g)) / 100) *
            parseFloat(getIngridient.protein_100g)
        );
      }
      if (ingridientData.serving_data) {
        return Math.round(ingridientData.protein_total);
      }
      return 'N/A';
    }

    if (type === 'fat' || type === 'fat-initial') {
      if (getIngridient !== undefined) {
        if (type === 'fat') {
          return Math.round(
            ((parseFloat(ingridientData.amount) * parseFloat(ingridientData.preselect_g)) / 100) *
              parseFloat(getIngridient.fat_100g)
          );
        }
        return Math.round(
          ((parseFloat(ingridientData.initial_amount) * parseFloat(ingridientData.preselect_g)) / 100) *
            parseFloat(getIngridient.fat_100g)
        );
      }
      if (ingridientData.serving_data) {
        return Math.round(ingridientData.fat_total);
      }
      return 'N/A';
    }
  }

  if (type === 'kcal' || type === 'kcal-initial') {
    if (getIngridient !== undefined) {
      if (type === 'kcal') {
        return Math.round((parseFloat(ingridientData.amount) / 100) * parseFloat(getIngridient.kcal_100g));
      }
      return Math.round((parseFloat(ingridientData.initial_amount) / 100) * parseFloat(getIngridient.kcal_100g));
    }
    if (ingridientData.serving_data) {
      return ingridientData.kcal_total;
    }
    return 'N/A';
  }

  if (type === 'carbohydrates' || type === 'carbohydrates-initial') {
    if (getIngridient !== undefined) {
      if (type === 'carbohydrates') {
        return Math.round((parseFloat(ingridientData.amount) / 100) * parseFloat(getIngridient.carbohydrates_100g));
      }
      return Math.round(
        (parseFloat(ingridientData.initial_amount) / 100) * parseFloat(getIngridient.carbohydrates_100g)
      );
    }
    if (ingridientData.serving_data) {
      return Math.round(ingridientData.carbohydrates_total);
    }
    return 'N/A';
  }

  if (type === 'protein' || type === 'protein-initial') {
    if (getIngridient !== undefined) {
      if (type === 'protein') {
        return Math.round((parseFloat(ingridientData.amount) / 100) * parseFloat(getIngridient.protein_100g));
      }
      return Math.round((parseFloat(ingridientData.initial_amount) / 100) * parseFloat(getIngridient.protein_100g));
    }
    if (ingridientData.serving_data) {
      return Math.round(ingridientData.protein_total);
    }
    return 'N/A';
  }

  if (type === 'fat' || type === 'fat-initial') {
    if (getIngridient !== undefined) {
      if (type === 'fat') {
        return Math.round((parseFloat(ingridientData.amount) / 100) * parseFloat(getIngridient.fat_100g));
      }
      return Math.round((parseFloat(ingridientData.initial_amount) / 100) * parseFloat(getIngridient.fat_100g));
    }
    if (ingridientData.serving_data) {
      return Math.round(ingridientData.fat_total);
    }
    return 'N/A';
  }

  return '0';
};

const getRoundedValue = (value: string | number) => {
  if (typeof value === 'string') {
    return Math.round(parseFloat(value.replace(',', '.')));
  }
  return Math.round(value);
};

export {
  remainTrialDay,
  getButtonGroupList,
  scrollToTop,
  scrollToElement,
  getIngridientMacros,
  handleOpenClosePopups,
  generateRandomUid,
  getRoundedValue,
};
