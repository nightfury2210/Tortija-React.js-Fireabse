import React, { forwardRef } from 'react';
import { FieldError } from 'react-hook-form';
import Styles from './style.module.scss';

type Props = {
  label?: string;
  name: string;
  type: string;
  className?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  register: any;
  error?: any;
};

const Input = forwardRef(
  (
    {
      className = '',
      name,
      type,
      required = false,
      placeholder,
      label,
      autoComplete = '',
      register = {},
      error,
    }: Props,
    ref
  ) => (
    <div className={className}>
      <div className="mt-1">
        <input
          ref={ref}
          tabIndex={0}
          id={name}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required={required}
          placeholder={placeholder ?? label}
          className={Styles.inputStyle}
          {...register}
        />
      </div>
      {error ? (
        <div className="flex-1">
          <p className="mt-1 text-xs text-red-500">{error.message}</p>
        </div>
      ) : null}
    </div>
  )
);

export default Input;
