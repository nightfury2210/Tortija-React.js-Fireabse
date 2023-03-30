import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { SearchIcon } from '@heroicons/react/solid';
import Styles from './style.module.scss';

type Props = {
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  className?: string;
  searchValue: string;
  thisRef?: any;
};

const SearchBox = ({ className = '', onChange, thisRef, searchValue }: Props) => {
  const { t } = useTranslation();
  console.log(searchValue);
  return (
    <div className={classNames('relative', className)}>
      <input
        ref={thisRef}
        tabIndex={0}
        className={Styles.inputStyle}
        onChange={onChange}
        defaultValue={searchValue}
        placeholder={t('Search')}
        type="search"
      />
      <div className={Styles.searchWrapper}>
        <SearchIcon className={Styles.searchIcon} height={27} width={27} />
      </div>
    </div>
  );
};

export default SearchBox;
