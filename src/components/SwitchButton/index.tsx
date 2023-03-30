import React from 'react';
import { Switch } from '@headlessui/react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import styles from './style.module.scss';

type Props = {
  label?: string;
  enabled?: boolean;
  isBackground?: boolean;
  isDisabled?: boolean;
  className?: string;
  notContainer?: boolean;
  onChange?: (status: boolean, item: string) => void;
};

const SwitchButton: React.FC<Props> = ({
  label = '',
  className,
  isBackground = false,
  notContainer = false,
  enabled = false,
  isDisabled = false,
  onChange = () => {},
}) => {
  const { t } = useTranslation();

  const onChangeEvent = (value: boolean) => {
    onChange(value, label ?? '');
  };

  return (
    <Switch.Group>
      <div
        className={classNames(
          styles.wrapper,
          { [styles.notContainer]: !notContainer },
          { [styles.isBackground]: isBackground },
          className
        )}
      >
        <Switch.Label className={styles.label}>{t(label.toString())}</Switch.Label>
        <Switch disabled={isDisabled} checked={enabled} onChange={onChangeEvent} className={styles.switch}>
          <span aria-hidden="true" className={styles.switchContainer} />
          <span
            aria-hidden="true"
            className={classNames(styles.switcher, { [styles.enable]: enabled }, { [styles.disable]: !enabled })}
          />
        </Switch>
      </div>
    </Switch.Group>
  );
};

export default SwitchButton;
