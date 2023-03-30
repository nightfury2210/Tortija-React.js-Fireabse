import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRightIcon } from '@heroicons/react/outline';
import firebase from 'services/firebase';
import { toast } from 'react-toast';
import Headline from 'components/Headline';
import { AuthContext } from 'providers/AuthProvider';
import Button from 'components/Button';
import { profileMenu } from 'shared/constants/profile';
import classNames from 'classnames';
import EditProfile from './components/editProfile';
import Analyze from './components/analyze';
import Settings from './components/settings';
import HelpAndFAQ from './components/helpFaq';
import Subscription from './components/subscription';
import Legal from './components/legal';
import styles from './styles.module.scss';

type Props = {};

const contentComponents = [EditProfile, Analyze, Settings, HelpAndFAQ, Subscription, Legal];

const Profile: React.FC<Props> = () => {
  const { t } = useTranslation();
  const { userData } = React.useContext(AuthContext);
  const [profileItemIndex, setProfileItemIndex] = useState(-1);

  const logOutUser = () => {
    try {
      firebase.auth().signOut();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className={styles.header}>
        <Headline level={1}>{t('Profile')}</Headline>
      </div>
      <div className={styles.wrapper}>
        <div className={classNames(styles.menuWrapper, { hidden: profileItemIndex >= 0 })}>
          <div className={styles.avatar}>
            <div className={styles.photo}>
              <img src="/logo192.png" width={100} height={100} className="object-cover" alt="User Avatar" />
            </div>
            <div className={styles.name}>{userData?.fullName}</div>
          </div>
          <div
            className={classNames(styles.menuList, {
              hidden: profileItemIndex >= 0,
            })}
          >
            {profileMenu.map((item, index) => (
              <Button
                buttonStyle={profileItemIndex === index ? 'primary' : 'dark'}
                className="w-full"
                onClick={() => {
                  setProfileItemIndex(index);
                }}
                key={index}
              >
                <div className="w-full flex justify-between items-center">
                  <p className="text-18 font-light">{t(item)}</p>
                  <ChevronRightIcon
                    className={classNames({ 'text-brownSemiDark': profileItemIndex !== index }, 'text-white')}
                    height={30}
                    width={30}
                  />
                </div>
              </Button>
            ))}
            <Button className={styles.logoutBtn} onClick={logOutUser}>
              {t('Log out')}
            </Button>
          </div>
        </div>
        <div className={classNames(styles.content, 'custom-desktop-scrollbar')}>
          {contentComponents.map((Component, index) => (
            <Component
              isShown={profileItemIndex === index}
              key={index}
              title={profileMenu[index]}
              goBack={() => {
                setProfileItemIndex(-1);
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Profile;
