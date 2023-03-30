import React from 'react';
import classNames from 'classnames';
import Container from 'components/Container';
import Sidebar from 'components/Sidebar';
import styles from './style.module.scss';

type Props = {
  children: React.ReactNode;
};

const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <Container>
      <Sidebar />
      <div className={styles.wrapper}>
        <div className={classNames(styles.container, 'custom-scrollbar')} id="mainContainer">
          {children}
        </div>
      </div>
    </Container>
  );
};

export default MainLayout;
