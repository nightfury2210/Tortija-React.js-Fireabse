import Header from 'components/Header';
import React from 'react';
import { useTranslation } from 'react-i18next';
// import firebase from '../../services/firebase';
// import useFirestoreDoc from '../../hooks/useFirestoreDoc';
import Headline from '../../components/Headline';
import styles from './style.module.scss';

const ShoppingList: React.FC = () => {
  const { t } = useTranslation();
  // const userRef = firebase.firestore().collection(`users`).doc(firebase.auth().currentUser.uid);
  // const { isLoading, data: user } = useFirestoreDoc(userRef);

  return (
    <div className={styles.container}>
      <Header>
        <Headline level={1}>{t('Shopping list')}</Headline>
      </Header>
      {/* {isLoading && <span>Loading...</span>}
      {user && (
        <p>
          Hello {user.firstname} {user.lastname}
        </p>
      )} */}
    </div>
  );
};

export default ShoppingList;
