import React from 'react';
import classNames from 'classnames';
import Select, { OptionTypeBase } from 'react-select';
import { customSelectStyles } from 'shared/constants/global';
import Headline from 'components/Headline';
import { useTranslation } from 'react-i18next';

type Props = {
  isClearable?: boolean;
  dropDownOption: Array<OptionTypeBase>;
  name: string;
  label?: string;
  isSearchable?: boolean;
  isMulti?: boolean;
  className?: string;
  onChange?: (value: OptionTypeBase | OptionTypeBase[]) => void | Promise<void>;
  defaultValue?: OptionTypeBase | OptionTypeBase[];
};

export const optionToValue = (value: OptionTypeBase[]) => value.map(item => item.value);

export default function CustomSelect({
  className,
  isClearable = false,
  isSearchable = false,
  dropDownOption,
  name,
  label = '',
  onChange,
  isMulti = false,
  defaultValue,
}: Props) {
  const { t } = useTranslation();
  return (
    <div>
      {label && (
        <Headline className="mb-15" level={4}>
          {t(label)}
        </Headline>
      )}
      <Select
        className={classNames('custom-select', className)}
        classNamePrefix="custom-select"
        isClearable={isClearable}
        isSearchable={isSearchable}
        isMulti={isMulti}
        name={name}
        options={dropDownOption}
        onChange={onChange}
        defaultValue={defaultValue}
        menuPlacement="auto"
        styles={customSelectStyles}
      />
    </div>
  );
}
