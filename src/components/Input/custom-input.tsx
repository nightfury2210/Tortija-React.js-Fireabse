import classNames from 'classnames';
import React from 'react';
import Styles from './style.module.scss';

type Props = {
  autoComplete?: string;
  className?: string;
  defaultValue?: string;
  label?: string;
  name: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  placeholder?: string;
  required?: boolean;
  suffix?: string;
  type: string;
  value?: string;
};

const CustomInput = ({
  autoComplete = '',
  className = '',
  defaultValue,
  label,
  name,
  onChange,
  placeholder = '',
  required = false,
  suffix,
  type,
  value,
}: Props) => (
  <div className={className}>
    {label ? (
      <label htmlFor={name} className="block text-sm font-regular text-gray-500 mb-1">
        {label}
      </label>
    ) : null}
    <div className={Styles.inputWrapper}>
      <input
        autoComplete={autoComplete}
        className={classNames(Styles.inputStyle, { [Styles.suffixInput]: suffix })}
        defaultValue={defaultValue}
        id={name}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        tabIndex={0}
        type={type}
        {...(value ? { value } : {})}
      />
      {suffix && <span className={Styles.suffix}>{suffix}</span>}
    </div>
  </div>
);
export default CustomInput;
