interface GymType {
  title: string;
  location: string;
  logoImage: string;
  created?: string;
  id?: string;
}

interface TableDataType {
  type: string;
  value: string | number;
}

interface StepList {
  id: string;
  title: string;
}

type MembershipType = 'free' | 'basic' | 'basic12' | 'pro' | 'pro12';

type MembershipPlanType = {
  name: string;
  price: string;
  planType: MembershipType;
  description: string;
  includedFeatures: string[];
};
