import React, { useEffect, useState } from 'react';
import { PlusIcon } from '@heroicons/react/solid';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Table from 'components/Table';
import Headline from 'components/Headline';
import Button from 'components/Button';
import { gymCollection } from 'shared/constants/global';
import styles from './styles.module.scss';

const skeletonTable: TableDataType[][] = new Array(3).fill([
  { type: 'text', value: '' },
  { type: 'text', value: '' },
  { type: 'image', value: '' },
  { type: 'qr', value: '' },
]);

export default function Gym() {
  const { t } = useTranslation();

  const header = [t('Name'), t('City'), t('Logo'), t('QR Code')];

  const [gymData, setGymData] = useState<TableDataType[][]>([]);
  const [isPending, setIsPending] = useState(false);

  const getGymData = async () => {
    setIsPending(true);
    const data: TableDataType[][] = (await gymCollection.get()).docs.map(item => [
      { type: 'text', value: item.data().title },
      { type: 'text', value: item.data().location },
      { type: 'image', value: item.data().logoImage },
      { type: 'qr', value: `${process.env.REACT_APP_BASE_URL as string}/register/${item.id}` },
    ]);
    setGymData(data);
    setIsPending(false);
  };

  useEffect(() => {
    getGymData();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={styles.wrapper}>
      <Headline level={1} classLevel={3} className={styles.header}>
        {t('Gym Overview')}
      </Headline>
      <div className={styles.content}>
        <Link to="/admin/gym/status">
          <Button buttonStyle="primary">{t('Status')}</Button>
        </Link>
        <Link to="/admin/gym/add" type="button" className={styles.addButton}>
          <PlusIcon width={28} height={28} className="text-brownSemiDark" />
        </Link>
      </div>
      {isPending || !gymData ? (
        <Table header={Array.from(new Array(4))} body={skeletonTable} className="w-full" isSkeleton />
      ) : (
        <Table header={header} body={gymData} className="w-full" />
      )}
    </div>
  );
}
