import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import Headline from 'components/Headline';
import { getButtonGroupList } from 'shared/functions/global';
import styles from './style.module.scss';

type Props = {
  options: string[];
  initialOption?: string[] | string;
  isRadio?: boolean;
  className?: string;
  itemsClassName?: string;
  label?: string;
  changeSelectedItem: Function;
};

const ButtonGroup: React.FC<Props> = ({
  options,
  initialOption = [],
  isRadio = false,
  className,
  itemsClassName,
  label,
  changeSelectedItem,
}) => {
  const { t } = useTranslation();

  const onChangeItem = (value: string) => {
    changeSelectedItem(isRadio ? value : getButtonGroupList(initialOption as Array<string>, value));
  };

  return (
    <div className={className}>
      {label && (
        <Headline className="mb-15" level={4}>
          {t(label)}
        </Headline>
      )}
      <div className={classNames('grid gap-10', itemsClassName)}>
        {options.map((item: string, index: number) => (
          <div
            key={index}
            className={classNames(styles.button, {
              [styles.active]: initialOption.includes(item) || initialOption === item,
            })}
            aria-hidden
            onClick={() => {
              onChangeItem(item);
            }}
          >
            {t(item)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ButtonGroup;
