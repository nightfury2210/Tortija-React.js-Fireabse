import React from 'react';
import { ReactComponent as logo } from 'assets/img/svg/logo.svg';
import { ReactComponent as home } from 'assets/img/svg/home.svg';
import { ReactComponent as plan } from 'assets/img/svg/plan.svg';
import { ReactComponent as profile } from 'assets/img/svg/profile.svg';
import { ReactComponent as recipes } from 'assets/img/svg/recipes.svg';
import { ReactComponent as cooking } from 'assets/img/svg/cooking.svg';
import { ReactComponent as shoppingList } from 'assets/img/svg/shoppingList.svg';

export type IconType = 'logo' | 'shoppingList' | 'recipes' | 'profile' | 'plan' | 'home' | 'cooking';

type IconProps = {
  name: IconType;
  width?: number;
  height?: number;
  className?: string;
};

const Icon: React.FC<IconProps> = ({ name, width, height, className }) => {
  if (!name) {
    return null;
  }

  const icons = {
    logo,
    home,
    plan,
    profile,
    recipes,
    shoppingList,
    cooking,
  };

  const CurrentIcon = icons[name];

  return <CurrentIcon width={width} height={height} className={className} />;
};

export default Icon;
