import React from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';

type Props = {
  className?: string;
  isCircle?: boolean;
  translucent?: boolean;
};

const Skeleton: React.FC<Props> = ({ className, translucent = false, isCircle = false }) => (
  <div className={classNames(styles.parent, className, { [styles.circle]: isCircle })}>
    <div className={classNames(styles.pulse, { [styles.translucent]: translucent })} />
  </div>
);

export default Skeleton;
