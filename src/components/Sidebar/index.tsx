import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import LogoImg from 'assets/img/svg/logo.svg';
import { AuthContext } from 'providers/AuthProvider';
import { navLinkList } from 'shared/constants/global';
import Icon from '../Icon';
import styles from './style.module.scss';

const Sidebar = () => {
  const { t } = useTranslation();
  const { userData } = useContext(AuthContext);
  const [isAdminNavi, setIsAdminNavi] = useState(false);

  return (
    <div className={styles.sidebar}>
      <div className={classNames(styles.navContainer, 'custom-scrollbar')}>
        <div className="w-full desktop:space-y-70">
          <img
            className="hidden mx-auto w-120 desktop:block"
            width={160}
            height={140}
            src={LogoImg}
            alt="Tortija Logo"
          />
          {userData?.role === 1 && (
            <button type="button" onClick={() => setIsAdminNavi(!isAdminNavi)} className={styles.adminBtn}>
              {t('Admin')}
            </button>
          )}

          <nav className={styles.nav}>
            {!isAdminNavi ? (
              <>
                {navLinkList.map((item, index) => (
                  <NavLink
                    to={item.link}
                    exact={index === 0}
                    className={styles.link}
                    activeClassName={styles.selected}
                    key={index}
                  >
                    <Icon name={item.icon} height={22} width={22} className={styles.icon} />
                    <span className={styles.label}>{t(item.label)}</span>
                  </NavLink>
                ))}
              </>
            ) : (
              <>
                {userData?.role === 1 && (
                  <div className={styles.adminLinkWrapper}>
                    <NavLink to="/admin/gym" className={styles.link} activeClassName={styles.selected}>
                      <span className={styles.label}>{t('Gym')}</span>
                    </NavLink>
                  </div>
                )}
              </>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
