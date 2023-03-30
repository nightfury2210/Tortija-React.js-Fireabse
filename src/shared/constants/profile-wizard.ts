import { OptionTypeBase } from 'react-select';

export const stepLists: StepList[] = [
  { id: '01', title: 'Personal information' },
  { id: '02', title: 'Your Goal' },
  { id: '03', title: 'Form of nutrition' },
  { id: '04', title: 'Eating habits' },
  { id: '05', title: 'Intolerances' },
];

export const genderOption: OptionTypeBase[] = [
  { value: 'woman', label: 'Women' },
  { value: 'man', label: 'Man' },
  { value: 'various', label: 'Various' },
];

export const physicalStrainOption: OptionTypeBase[] = [
  { value: 'Sleep', label: 'Sleep', pal: 1.2 },
  { value: 'Sitting or lying only', label: 'Sitting or lying only', pal: 1.4 },
  {
    value: 'Exclusively sedentary work with little or no physical activity in leisure time, e.g. office work',
    label: 'Exclusively sedentary work with little or no physical activity in leisure time, e.g. office work',
    pal: 1.6,
  },
  {
    value:
      'Sedentary work with temporarily walking or standing work, e.g. students, assembly line workers, laboratory technicians, drivers',
    label:
      'Sedentary work with temporarily walking or standing work, e.g. students, assembly line workers, laboratory technicians, drivers',
    pal: 1.8,
  },
  { value: 'Physically demanding professional work', label: 'Physically demanding professional work', pal: 2.0 },
];

export const formOfNutrition = ['Flexitarian', 'Vegan', 'Vegetarian', 'Ketogen'];
export const yourGoal = ['Decrease', 'Gain', 'Maintain'];
export const GoalDescription = ['Reduce body fat', 'Muscle building', 'Optimize nutrition'];

export const eatingHabitsOption: string[] = [
  'Warm meals',
  'Snacks',
  'Hearty',
  'Sweets',
  'Bread - baked goods',
  'Breakfast',
  'Meal prep',
  'Thermomix',
  'Smoothies & Shakes',
];

export const intolerancesOption: string[] = [
  'Histamine',
  'Lactose',
  'Gluten',
  'Sorbitol',
  'wheat',
  'Fructose',
  'Peanuts',
  'Nuts',
  'Soy',
  'Egg',
  'Celery',
];
