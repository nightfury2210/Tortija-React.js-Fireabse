interface UserInfo {
  fullName: string;
  email: string;
  password: string;
  gender: string;
  age: string;
  bodySize: string;
  bodyWeight: string;
  membership?: {
    id: string;
    activated: boolean;
    nextDate: number;
    payerId: string;
    paymentMethod: string;
    type: MembershipType;
  };
  calories: string;
  physicalStrainChange: string;
  goal: string;
  formOfNutrition: string;
  eatingHabits: string[];
  incompatibilities: string[];
  profileComplete: boolean;
  role: number;
  gymID: string;
  created: any;
  kcal_total: number;
  carbohydrates_total: number;
  protein_total: number;
  fat_total: number;
}
