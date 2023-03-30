import React, { createContext, ReactNode, useState, useContext, useEffect, useMemo } from 'react';
import firebase from 'services/firebase';
import { AuthContext } from 'providers/AuthProvider';

type ContextProps = {
  recipesList: RecipesType[] | undefined;
  ingredientList: IngredientType[] | undefined;
  favoritesRecipesList: RecipeFavorites[] | undefined;
  favoritesPlansList: PlansFavorites[] | undefined;
  planList: PlanType[] | undefined;
};

type Props = {
  children: ReactNode;
};

export const MainContext = createContext<ContextProps>({
  recipesList: [],
  ingredientList: [],
  favoritesRecipesList: [],
  favoritesPlansList: [],
  planList: [],
});

export const MainProvider = ({ children }: Props) => {
  // Get User Data
  const authContext = useContext(AuthContext);
  // Get Recipe Data
  const [recipesMainList, setRecipesMainList] = useState<RecipesType[]>();
  const [recipesUserList, setRecipesUserList] = useState<RecipesType[]>();
  const recipesList = useMemo(() => {
    if (recipesMainList && recipesUserList) {
      return [...recipesUserList, ...recipesMainList];
    }
    return undefined;
  }, [recipesMainList, recipesUserList]);

  const recipesCollection = firebase.firestore().collection('recipes');
  const userRecipesCollection = firebase
    .firestore()
    .collection('users')
    .doc(authContext.user?.uid)
    .collection('recipes');

  // Get Favourite Recipe Data
  const [favoritesRecipesList, setFavoritesRecipesList] = useState<RecipeFavorites[]>();
  const userRecipesFavoritesCollection = firebase
    .firestore()
    .collection('users')
    .doc(authContext.user?.uid)
    .collection('favorites_recipes');

  // Get Favourite Plan Data
  const [favoritesPlansList, setFavoritesPlansList] = useState<PlansFavorites[]>([]);
  const userPlansFavoritesCollection = firebase
    .firestore()
    .collection('users')
    .doc(authContext.user?.uid)
    .collection('favorites_plans');

  // Get Ingredient Data
  const [ingredientMainList, setIngredientMainList] = useState<IngredientType[]>();
  const [ingredientUserList, setIngredientUserList] = useState<IngredientType[]>();
  const ingredientList = useMemo(() => {
    if (ingredientMainList && ingredientUserList) {
      return [...ingredientMainList, ...ingredientUserList];
    }
    return undefined;
  }, [ingredientMainList, ingredientUserList]);

  const ingredientCollection = firebase.firestore().collection('ingredients');
  const userIngredientsCollection = firebase
    .firestore()
    .collection('users')
    .doc(authContext.user?.uid)
    .collection('ingredients');

  // Get Plan Data
  const [planMainList, setPlanMainList] = useState<PlanType[]>();
  const [planUserList, setPlanUserList] = useState<PlanType[]>();
  const planList = useMemo(() => {
    if (planMainList && planUserList) {
      return [...planMainList, ...planUserList];
    }
    return undefined;
  }, [planMainList, planUserList]);

  const planCollection = firebase.firestore().collection('plans');
  const userPlansCollection = firebase.firestore().collection('users').doc(authContext.user?.uid).collection('plans');

  useEffect(() => {
    const unsubscribeRecipes = recipesCollection.onSnapshot(docs => {
      const list: RecipesType[] = docs.docs.map(item => ({ uid: item.id, ...item.data() } as RecipesType));
      setRecipesMainList(list);
    });
    const unsubscribeUserRecipes = userRecipesCollection.onSnapshot(docs => {
      const list: RecipesType[] = docs.docs.map(item => ({ uid: item.id, ...item.data() } as RecipesType));
      setRecipesUserList(list);
    });

    const unsubscribeIngredient = ingredientCollection.onSnapshot(docs => {
      const list: IngredientType[] = docs.docs.map(item => ({ uid: item.id, ...item.data() } as IngredientType));
      setIngredientMainList(list);
    });
    const unsubscribeUserIngredient = userIngredientsCollection.onSnapshot(docs => {
      const list: IngredientType[] = docs.docs.map(item => ({ uid: item.id, ...item.data() } as IngredientType));
      setIngredientUserList(list);
    });

    const unsubscribeRecipeFavorites = userRecipesFavoritesCollection.onSnapshot(docs => {
      const list: RecipeFavorites[] = docs.docs.map(
        item => ({ uid: item.id, name: item.data().name, origId: item.data().origId } as RecipeFavorites)
      );
      setFavoritesRecipesList(list);
    });

    const unsubscribePlanFavorites = userPlansFavoritesCollection.onSnapshot(docs => {
      const list: PlansFavorites[] = docs.docs.map(
        item => ({ uid: item.id, name: item.data().name, origId: item.data().origId } as PlansFavorites)
      );
      setFavoritesPlansList(list);
    });

    const unsubscribePlans = planCollection.onSnapshot(docs => {
      const list: PlanType[] = docs.docs.map(item => ({ uid: item.id, ...item.data() } as PlanType));
      setPlanMainList(list);
    });
    const unsubscribeUserPlans = userPlansCollection.onSnapshot(docs => {
      const list: PlanType[] = docs.docs.map(item => ({ uid: item.id, ...item.data() } as PlanType));
      setPlanUserList(list);
    });

    return () => {
      unsubscribeRecipes();
      unsubscribeUserRecipes();
      unsubscribeIngredient();
      unsubscribeUserIngredient();
      unsubscribeRecipeFavorites();
      unsubscribePlanFavorites();
      unsubscribePlans();
      unsubscribeUserPlans();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MainContext.Provider
      value={{
        recipesList,
        ingredientList,
        favoritesRecipesList,
        favoritesPlansList,
        planList,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};
