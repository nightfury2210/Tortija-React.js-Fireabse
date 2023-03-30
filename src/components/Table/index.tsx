import React from 'react';
import classNames from 'classnames';
import QRCode from 'react-qr-code';
import Skeleton from 'components/skeleton';
import styles from './style.module.scss';

type Props = {
  header: string[];
  body: TableDataType[][];
  className?: string;
  isSkeleton?: boolean;
};

const Table: React.FC<Props> = ({ header, body, className, isSkeleton = false }) => {
  if (isSkeleton) {
    return (
      <div className={classNames(className, styles.wrapper)}>
        <table className={styles.table}>
          <thead className={styles.header}>
            <tr>
              {header.map(item => (
                <th scope="col" key={item} className={styles.cell}>
                  &nbsp;
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={styles.body}>
            {body.map((row, rIndex) => (
              <tr key={rIndex} className={classNames(styles.row, { 'bg-gray-100': rIndex % 2 === 1 })}>
                {row.map((item, iIndex) => (
                  <td className={styles.cell} key={iIndex}>
                    {item.type === 'text' ? (
                      <Skeleton className={styles.skeletonText} />
                    ) : item.type === 'image' ? (
                      <Skeleton className={styles.skeletonImage} />
                    ) : item.type === 'qr' ? (
                      <Skeleton className={styles.skeletonImage} />
                    ) : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (!body) {
    return null;
  }
  return (
    <div className={classNames(className, styles.wrapper)}>
      <table className={styles.table}>
        <thead className={styles.header}>
          <tr>
            {header.map(item => (
              <th scope="col" key={item} className={styles.cell}>
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.body}>
          {body.map((row, rIndex) => (
            <tr key={rIndex} className={classNames(styles.row, { 'bg-gray-100': rIndex % 2 === 1 })}>
              {row.map((item, iIndex) => (
                <td className={styles.cell} key={iIndex}>
                  {item.type === 'text' ? (
                    item.value
                  ) : item.type === 'image' ? (
                    <img src={item.value.toString()} alt="" height={100} width={100} className={styles.image} />
                  ) : item.type === 'qr' ? (
                    <div className={styles.qrcode}>
                      <QRCode value={item.value.toString()} level="M" size={100} />
                    </div>
                  ) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
