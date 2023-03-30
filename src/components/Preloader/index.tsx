import React from 'react';
import ReactLoading from 'react-loading';
import Icon from 'components/Icon';
import styles from './style.module.scss';

const Preloader = () => (
  <div className={styles.wrapper}>
    <Icon name="logo" width={200} />
    <ReactLoading type="bubbles" width={50} height={20} color="#84502B" />
  </div>
);

export default Preloader;
