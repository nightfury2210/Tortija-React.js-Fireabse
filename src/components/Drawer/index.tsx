import React from 'react';
import { ChevronRightIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import styles from './style.module.scss';

type Props = {
  isOpen?: boolean;
  closeDrawer?: (value: boolean) => void;
  children: React.ReactNode;
};

const Drawer: React.FC<Props> = ({ isOpen = false, closeDrawer = () => {}, children }) => {
  const close = () => {
    closeDrawer(false);
  };

  return (
    <>
      <aside
        className={classNames(styles.drawerContainer, { 'translate-x-0': isOpen }, { 'translate-x-full': !isOpen })}
      >
        <div className="h-full overflow-auto custom-scrollbar p-45">
          <div aria-hidden="true" onClick={close} className={styles.drawerCloseButton}>
            <ChevronRightIcon width={28} height={28} className="text-brownSemiDark" />
          </div>
          <div className="pl-30">{children}</div>
        </div>
      </aside>
      {isOpen && <div className={styles.backDrop} aria-hidden="true" onClick={close} />}
    </>
  );
};

export default Drawer;
