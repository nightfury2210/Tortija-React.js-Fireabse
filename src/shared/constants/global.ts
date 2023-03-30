import { IconType } from 'components/Icon';
import { OptionTypeBase } from 'react-select';
import firebase from 'services/firebase';

const monthName: OptionTypeBase[] = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

const difficultyValues: OptionTypeBase[] = [
  { value: '1', label: 'Leicht' },
  { value: '2', label: 'Mittel' },
  { value: '3', label: 'Schwer' },
];

const recipeCategoryValues: OptionTypeBase[] = [
  { value: '1', label: 'Aufläufe & Überbackenes' },
  { value: '2', label: 'Aufstriche' },
  { value: '3', label: 'Brot & Backwaren' },
  { value: '4', label: 'Suppen & Eintöpfe' },
  { value: '5', label: 'Salate' },
  { value: '6', label: 'Nüsse, Samen & Snacks' },
  { value: '7', label: 'Snacks' },
  { value: '8', label: 'Müsli & Joghurtspeisen' },
  { value: '9', label: 'Fast Food' },
  { value: '10', label: 'Pasta' },
  { value: '11', label: 'Smoothies & Shakes' },
  { value: '12', label: 'Reisgerichte' },
  { value: '13', label: 'Eierspeisen' },
  { value: '14', label: 'Süßes' },
  { value: '15', label: 'Kartoffelgerichte' },
  { value: '16', label: 'Specials' },
  { value: '17', label: 'Dressing & Saucen' },
];

const ingredientCategoryValues: OptionTypeBase[] = [
  { value: '1', label: 'Aufschnitt' },
  { value: '2', label: 'Aufstrich' },
  { value: '3', label: 'Gemüse' },
  { value: '4', label: 'Obst' },
  { value: '5', label: 'Fisch - Fleisch' },
  { value: '6', label: 'Konserven' },
  { value: '7', label: 'Nüsse & Samen' },
  { value: '8', label: 'Kräuter & Gewürze' },
  { value: '9', label: 'Beilagen' },
  { value: '10', label: 'Brot & Backwaren' },
  { value: '11', label: 'Nahrungsergänzungsmittel' },
  { value: '12', label: 'Süßungsmittel' },
  { value: '13', label: 'Essig & Öle' },
  { value: '14', label: 'Ei- & Milchprodukte' },
  { value: '15', label: 'Snacks' },
  { value: '16', label: 'TK' },
  { value: '17', label: 'Sonstiges' },
];

const ingredientPieceValues: OptionTypeBase[] = [
  { value: 'g', label: 'Gramm' },
  { value: 'ml', label: 'Milliliter' },
];

const gymCollection = firebase.firestore().collection('gyms');
const userCollection = firebase.firestore().collection('users');

const DropDownOption: OptionTypeBase[] = [
  { value: 'first', label: 'First Item' },
  { value: 'second', label: 'Second Item' },
  { value: 'third', label: 'Third Item' },
  { value: 'fourth', label: 'Forth Item' },
];

const customSelectStyles = {
  control: (provided: any) => ({
    ...provided,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0)',
    border: 'solid 2px rgba(255, 255, 255, 0.3)',
  }),
  option: (provided: any, { isDisabled }: any) => ({
    ...provided,
    color: isDisabled ? '#ccc' : 'black',
    cursor: isDisabled ? 'not-allowed' : 'default',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: 'white',
  }),
  input: (provided: any) => ({
    ...provided,
    color: 'white',
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    display: 'none',
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: '#C97132',
  }),
};

const navLinkList: { link: string; icon: IconType; label: string }[] = [
  { link: '/', icon: 'home', label: 'Dashboard' },
  { link: '/plans', icon: 'plan', label: 'Plans' },
  { link: '/nutrition', icon: 'recipes', label: 'Nutrition' },
  { link: '/shopping-list', icon: 'shoppingList', label: 'Shopping list' },
  { link: '/profile', icon: 'profile', label: 'Profile' },
];

const monthlyPlanList: MembershipPlanType[] = [
  {
    name: 'Basic',
    price: '9,90',
    planType: 'basic',
    description: 'All the basics for starting a new business',
    includedFeatures: ['Lorem Ipsum', 'Lorem Ipsum', 'Lorem Ipsum'],
  },
  {
    name: 'Pro',
    price: '14,90',
    planType: 'pro',
    description: 'All the basics for starting a new business',
    includedFeatures: ['Lorem Ipsum ', 'Lorem Ipsum', 'Lorem Ipsum', 'Lorem Ipsum'],
  },
];

const yearlyPlanList: MembershipPlanType[] = [
  {
    name: 'Basic',
    price: '99',
    planType: 'basic12',
    description: 'All the basics for starting a new business',
    includedFeatures: ['Lorem Ipsum', 'Lorem Ipsum', 'Lorem Ipsum'],
  },
  {
    name: 'Pro',
    price: '149',
    planType: 'pro12',
    description: 'All the basics for starting a new business',
    includedFeatures: ['Lorem Ipsum', 'Lorem Ipsum', 'Lorem Ipsum', 'Lorem Ipsum'],
  },
];

const planID: { [key in MembershipType]: string } = {
  free: '',
  basic: process.env.REACT_APP_PAYPAL_BASIC_PLANID ?? '',
  pro: process.env.REACT_APP_PAYPAL_PRO_PLANID ?? '',
  basic12: process.env.REACT_APP_PAYPAL_BASIC12_PLANID ?? '',
  pro12: process.env.REACT_APP_PAYPAL_PRO12_PLANID ?? '',
};

const stripePlanID: { [key in MembershipType]: string } = {
  free: '',
  basic: process.env.REACT_APP_STRIPE_BASIC_PLANID ?? '',
  pro: process.env.REACT_APP_STRIPE_PRO_PLANID ?? '',
  basic12: process.env.REACT_APP_STRIPE_BASIC12_PLANID ?? '',
  pro12: process.env.REACT_APP_STRIPE_PRO12_PLANID ?? '',
};

export {
  DropDownOption,
  customSelectStyles,
  difficultyValues,
  gymCollection,
  ingredientCategoryValues,
  ingredientPieceValues,
  monthName,
  monthlyPlanList,
  navLinkList,
  planID,
  recipeCategoryValues,
  stripePlanID,
  userCollection,
  yearlyPlanList,
};
