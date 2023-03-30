import React from 'react';
import classNames from 'classnames';
import styles from './style.module.scss';

type Props = {
  thisValue?: string;
  name?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onClick?: any;
  thisRef?: any;
  submitFunction?: any;
  width?: any;
  textCenter?: boolean;
  headline?: boolean;
  lightBackground?: boolean;
};

function keyPress(event: any, submitFunction: any) {
  if (event.charCode === 13) {
    event.preventDefault();
    if (submitFunction !== undefined) {
      submitFunction();
    }
  }
}

const CustomUserInput = ({
  thisRef,
  submitFunction,
  thisValue,
  onChange,
  onClick,
  width,
  name,
  textCenter,
  headline,
  lightBackground,
}: Props) => (
  <div className="rounded-md border-solid border border-white border-opacity-30 py-1 px-2">
    {headline ? (
      <input
        name={name}
        ref={thisRef}
        className="appearance-none block text-2xl pb-5 font-semibold placeholder-gray-400 focus:outline-none bg-lightDarkGray bg-opacity-20 text-white text-center"
        style={{ width: `${width}ch` }}
        type="text"
        onChange={onChange}
        onKeyPress={e => keyPress(e, submitFunction)}
        value={thisValue}
        autoComplete="off"
      />
    ) : (
      <input
        name={name}
        ref={thisRef}
        className={classNames(lightBackground ? styles.customUserInputLight : styles.customUserInput)}
        style={{ width: `${width}ch` }}
        type="text"
        onChange={onChange}
        onClick={onClick}
        onKeyPress={e => keyPress(e, submitFunction)}
        inputMode="decimal"
        value={thisValue}
        autoComplete="off"
      />
    )}
  </div>
);
export default CustomUserInput;
