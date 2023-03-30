import React, { ReactNode } from 'react';
import classNames from 'classnames';
import { ChevronLeftIcon } from '@heroicons/react/solid';
import styles from './style.module.scss';

type Props = {
  text?: string;
  goBack?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  className?: string;
};

export default function ButtonBack({ text = 'Zurück', goBack, className }: Props) {
  return (
    <button className={classNames(styles.backBtn, className)} type="button" onClick={goBack}>
      <ChevronLeftIcon className={styles.icon} height={30} width={30} />
      {text}
    </button>
  );
}
