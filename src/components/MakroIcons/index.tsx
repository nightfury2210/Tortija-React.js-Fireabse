import React from 'react';
import { CheckIcon, ArrowSmDownIcon, ArrowSmUpIcon, ExclamationIcon } from '@heroicons/react/outline';

type Props = {
  percent?: number;
};

const MakroIcons: React.FC<Props> = ({ percent = 0 }) => {
  if (percent < 80) {
    return <ArrowSmUpIcon width={20} height={20} className="text-brownSemiDark" />;
  }
  if (percent > 80 && percent < 100) {
    return <CheckIcon width={20} height={20} className="text-brownSemiDark" />;
  }
  if (percent > 100) {
    return <ExclamationIcon width={20} height={20} className="text-brownSemiDark" />;
  }
  return <CheckIcon width={20} height={20} className="text-brownSemiDark" />;
};

export default MakroIcons;
