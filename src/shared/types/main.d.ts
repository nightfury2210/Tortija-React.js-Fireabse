interface RecipesType {
  uid: string;
  category: string;
  celery: boolean;
  description: {
    id: string;
    text: string;
  }[];
  difficulty_level: number;
  egg: boolean;
  protein_total: string;
  fat_total: string;
  fructose: boolean;
  histamine: boolean;
  imageUrl: string;
  ingredients: Ingredients[];
  kcal_total: string;
  ketogen: boolean;
  carbohydrates_total: string;
  lactose: boolean;
  name: string;
  nuts: boolean;
  peanuts: boolean;
  portion_g: string;
  sorbitol: boolean;
  soy: boolean;
  thermomix: boolean;
  vegan: boolean;
  vegetarian: boolean;
  flexitarian: boolean;
  userRecipe: boolean;
  alghorithmus: boolean;
  [key: string]: string;
}

interface Ingredients {
  amount: number;
  category: string;
  id: number;
  initial_amount: number;
  name: string;
  piece: string;
  preselect_g: number;
}

interface RecipeFavorites {
  name: string;
  uid: string;
  origId: string;
}
interface PlansFavorites {
  uid: string;
  origId: string;
}

interface IngredientType {
  uid: string;
  addition_100g: string;
  ballast_100g: string;
  carbohydrates_100g: string;
  category: string;
  celery: boolean;
  egg: boolean;
  fat_100g: string;
  fructose: boolean;
  histamin: boolean;
  imageUrl: string;
  kcal_100g: string;
  lactose: boolean;
  name: string;
  nuts: boolean;
  peanuts: boolean;
  default_piece: string;
  preselect_amount: string;
  preselect_g: string;
  preselect_type: string;
  protein_100g: string;
  sorbitol: boolean;
  soy: boolean;
  vegan: boolean;
  vegetarian: boolean;
  userIngridient: boolean;
  [key: string]: string;
}

interface PlanType {
  uid: string | undefined;
  name: string;
  origId: string;
  startDate: firebase.firestore.Timestamp | null;
  endDate: firebase.firestore.Timestamp | null;
  kcal_total: number;
  carbohydrates_total: number;
  dayEntries: DayEntries[];
  protein_total: number;
  fat_total: number;
  imageUrl: string;
  ketogen: boolean;
  vegan: boolean;
  vegetarian: boolean;
  flexitarian: boolean;
  egg: boolean;
  fructose: boolean;
  gluten: boolean;
  histamine: boolean;
  lactose: boolean;
  nuts: boolean;
  peanuts: boolean;
  sorbitol: boolean;
  soy: boolean;
  type: string;
  dayEntries: [];
  [key: string]: string;
}

interface DayEntries {
  id: number;
  name: string;
  breakfast: MealType;
  lunch: MealType;
  dinner: MealType;
  snacks: MealType;
  kcal_total: number;
  carbohydrates_total: number;
  protein_total: number;
  fat_total: number;
  date: firebase.firestore.Timestamp | null;
  [key]: any;
  [key: string]: MealType;
}

interface MealType {
  label: string;
  kcal_total: number;
  carbohydrates_total: number;
  protein_total: number;
  fat_total: number;
  recipes: PlanRecipeItem[];
  ingredients: PlanIngredientItem[];
}

interface PlanRecipeItem {
  id: string;
  amount: number;
  piece: string;
  portion_g: string;
  name: string;
  imageUrl: string;
  kcal_total: number;
  carbohydrates_total: number;
  protein_total: number;
  fat_total: number;
  uid: string;
}

interface PlanIngredientItem {
  id: string;
  amount: number;
  piece: string;
  portion_g: string;
  name: string;
  imageUrl: string;
  kcal_total: number;
  carbohydrates_total: number;
  protein_total: number;
  fat_total: number;
}

interface LocationState {
  pathname: string;
  from: string;
  scrollPos: number | undefined;
  uid: string | undefined;
  type: string | undefined;
  id: number;
  label: string | undefined;
  mealLabel: string | undefined;
}
