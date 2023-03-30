import React from 'react';
import classNames from 'classnames';
import { ChevronLeftIcon } from '@heroicons/react/solid';
import styles from './style.module.scss';

type HeadlineProps = {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  classLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  centered?: boolean;
  color?: 'Primary' | 'Secondary' | 'White' | 'Black';
  displayBackBtn?: boolean;
  className?: string;
  goBack?: React.MouseEventHandler<HTMLButtonElement> | undefined;
};

const Headline: React.FC<HeadlineProps> = ({
  children,
  level = 1,
  classLevel,
  centered = false,
  color = 'white',
  displayBackBtn = false,
  className,
  goBack,
}) => {
  const HeadlineTag = ({ ...props }) => React.createElement(`h${level}`, props, children);
  const headlineClass = !classLevel ? level : classLevel;

  const renderHeadline = () => (
    <HeadlineTag
      className={classNames(
        { [styles.headline1]: headlineClass === 1 },
        { [styles.headline2]: headlineClass === 2 },
        { [styles.headline3]: headlineClass === 3 },
        { [styles.headline4]: headlineClass === 4 },
        { [styles.headline5]: headlineClass === 5 },
        { [styles.headline6]: headlineClass === 6 },
        { 'text-center': centered },
        { 'text-dark-blue': color === 'blue' },
        { 'text-white': color === 'white' },
        className
      )}
    >
      {children}
    </HeadlineTag>
  );

  if (displayBackBtn) {
    return (
      <button type="button" className={classNames(styles.backBtn, className)} onClick={goBack}>
        <ChevronLeftIcon className={styles.icon} height={30} width={30} />
        {renderHeadline()}
      </button>
    );
  }

  return renderHeadline();
};

export default Headline;
