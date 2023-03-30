import React, { useEffect, useState } from 'react';
import moment from 'moment';
import firebase from 'services/firebase';
import Headline from 'components/Headline';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import Table from 'components/Table';
import CustomSelect from 'components/CustomSelect';
import { monthName, gymCollection, userCollection } from 'shared/constants/global';
import { toast } from 'react-toast';
import { OptionTypeBase } from 'react-select';
import styles from './styles.module.scss';

type GymType = { id: string; gym: string };

const gymStatusSkeletonData = new Array(2).fill([
  { type: 'text', value: '' },
  { type: 'text', value: '' },
]);

const GymStatus: React.FC = () => {
  const currentMonth = new Date().getMonth();
  const { t } = useTranslation();
  const history = useHistory();
  const [gymStatus, setGymStatus] = useState<TableDataType[][]>([]);
  const [isPending, setIsPending] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const header = [t('Gym'), t('New User')];
  const monthList = monthName.map((month: OptionTypeBase) => ({
    ...month,
    isDisabled: month.value > currentMonth + 1,
  }));

  const getGymUser = async (value: OptionTypeBase) => {
    setSelectedMonth(value.value - 1);
    setIsPending(true);
    try {
      const gymStatusData: TableDataType[][] = [];
      const data: GymType[] = (await gymCollection.get()).docs.map(item => ({ id: item.id, gym: item.data().title }));

      const promiseFunction: Promise<void>[] = [];

      const getUsers = async (item: GymType) => {
        const fromDay = moment
          .utc()
          .set({ month: value.value - 1, date: 1, hour: 0, minute: 0, second: 0, millisecond: 0 })
          .format('x');
        const toDay = moment
          .utc()
          .set({ month: value.value, date: 0, hour: 23, minute: 59, second: 59, millisecond: 0 })
          .format('x');
        const userCount = (
          await userCollection
            .where('created', '>=', firebase.firestore.Timestamp.fromMillis(parseInt(fromDay, 10)))
            .where('created', '<=', firebase.firestore.Timestamp.fromMillis(parseInt(toDay, 10)))
            .where('gymID', '==', item.id)
            .get()
        ).docs.length;
        gymStatusData.push([
          { type: 'text', value: item.gym },
          { type: 'text', value: userCount },
        ]);
      };

      data.forEach((item: GymType) => {
        promiseFunction.push(getUsers(item));
      });

      await Promise.all(promiseFunction);
      setGymStatus(gymStatusData);
      setIsPending(false);
    } catch (error: any) {
      setIsPending(false);
      toast.warn(error.message);
    }
  };

  useEffect(() => {
    getGymUser(monthList[currentMonth]);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className={styles.header}>
        <Headline level={1} classLevel={3} displayBackBtn goBack={history.goBack}>
          {t('Gym Status')}
        </Headline>
      </div>
      <CustomSelect
        name="goal"
        className={styles.monthSelect}
        dropDownOption={monthList}
        isSearchable
        onChange={getGymUser}
        defaultValue={monthList[selectedMonth]}
      />
      {isPending ? (
        <Table header={Array.from(new Array(2))} body={gymStatusSkeletonData} isSkeleton className={styles.table} />
      ) : (
        <Table header={header} body={gymStatus} className={styles.table} />
      )}
    </>
  );
};

export default GymStatus;
