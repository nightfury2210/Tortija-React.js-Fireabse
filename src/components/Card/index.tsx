import React from 'react';
import classNames from 'classnames';
import Skeleton from 'components/skeleton';
import styles from './style.module.scss';

type Props = {
  image?: string;
  children: React.ReactNode;
  isOverlay?: boolean;
  className?: string;
  isLoading?: boolean;
  isWithoutImage?: boolean;
};

const Card: React.FC<Props> = ({
  image,
  children,
  isOverlay = false,
  className,
  isLoading = false,
  isWithoutImage = false,
}) => {
  return (
    <div className={classNames(styles.container, className)}>
      {isWithoutImage ? (
        <div>{children}</div>
      ) : (
        <>
          <div className={isOverlay ? styles.overlayImage : styles.image}>
            {isLoading ? (
              <Skeleton translucent className="w-full" />
            ) : (
              <img src={image} height={220} loading="lazy" alt="" className={isOverlay ? 'opacity-50' : ''} />
            )}
          </div>
          <div className={classNames({ [styles.overlay]: isOverlay })}>
            <div className={styles.description}>{children}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default Card;
