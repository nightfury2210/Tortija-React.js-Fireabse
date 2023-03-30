import React from 'react';
import { Transition } from '@headlessui/react';
import styles from './style.module.scss';

type Props = {
  isShown: boolean;
  children: React.ReactNode;
};

const TransitionContainer: React.FC<Props> = ({ isShown, children }) => {
  return (
    <Transition show={isShown} appear enter={styles.enter} enterFrom={styles.enterFrom} enterTo={styles.enterTo}>
      {children}
    </Transition>
  );
};

export default TransitionContainer;
