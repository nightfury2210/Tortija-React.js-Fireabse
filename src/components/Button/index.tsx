import React, { ReactNode } from 'react';
import classNames from 'classnames';
import ReactLoading from 'react-loading';
import Styles from './style.module.scss';

type Props = {
  type?: 'submit' | 'button' | 'reset' | undefined;
  buttonStyle?: 'primary' | 'white' | 'dark';
  className?: string;
  children: ReactNode;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  isPending?: boolean;
};

export default function Button({
  type = 'submit',
  className = '',
  children,
  disabled = false,
  buttonStyle = 'primary',
  onClick = () => {},
  isPending = false,
}: Props) {
  return (
    <button
      // eslint-disable-next-line
      type={type}
      disabled={disabled}
      className={classNames(
        className,
        Styles.buttonStyle,
        { [Styles.primaryAddition]: buttonStyle === 'primary' },
        { [Styles.whiteAddition]: buttonStyle === 'white' },
        { [Styles.darkAddition]: buttonStyle === 'dark' }
      )}
      onClick={onClick}
    >
      {isPending ? (
        <ReactLoading type="bars" width={20} height={20} color={buttonStyle === 'white' ? 'black' : 'white'} />
      ) : (
        children
      )}
    </button>
  );
}
