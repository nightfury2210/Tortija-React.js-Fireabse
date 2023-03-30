import React, { forwardRef } from 'react';
import classNames from 'classnames';
import styles from './style.module.scss';

type Props = {
  className?: string;
  label: string;
  name: string;
  register: any;
};

const Checkbox = forwardRef(({ label, name, className = '', register = {} }: Props, ref) => (
  <div className={styles.wrapper}>
    <input
      id={name}
      name={name}
      type="checkbox"
      ref={ref}
      className={classNames(styles.checkbox, className)}
      {...register}
    />
    <label htmlFor={name} className={styles.label}>
      {label}
    </label>
  </div>
));

export default Checkbox;
