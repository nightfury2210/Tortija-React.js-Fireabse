import React, { ReactNode } from 'react';
import styles from './style.module.scss';

type HeaderProps = {
  children: ReactNode;
};

const Header: React.FC<HeaderProps> = ({ children }) => (
  <header className={styles.header}>
    <div className={styles.wrapper}>{children}</div>
  </header>
);

export default Header;
