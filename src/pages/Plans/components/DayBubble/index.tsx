import React from 'react';
import styles from './styles.module.scss';

type Props = {
  thisId?: number;
};

const DayBubble: React.FC<Props> = thisId => {
  return (
    <div className="bg-lightDarkGray rounded-full  w-50 h-50 pt-5">
      <div className="font-thin text-10 text-center">Tag</div>
      <div className="text-17 font-light text-center">{thisId && thisId}</div>
    </div>
  );
};

export default DayBubble;
