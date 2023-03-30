import React from 'react';

import BGDesktopImg from 'assets/img/desktop/index-bg.png';
import BGImg from 'assets/img/mobile/index-bg.png';
import classNames from 'classnames';
import styles from './style.module.scss';

type Props = {
  isBackImage?: boolean;
  children: React.ReactNode;
};

const AuthLayout: React.FC<Props> = ({ children, isBackImage = false }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.backImage}>
        <img className={styles.image} width={1100} height={900} src={BGDesktopImg} alt="" />
      </div>
      <div className={styles.body}>
        <div className={classNames(styles.container, 'custom-scrollbar')}>
          {isBackImage && <img className={styles.image} width={400} height={700} src={BGImg} alt="" />}
          <div className={classNames(styles.content, { [styles.isBack]: isBackImage })}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
