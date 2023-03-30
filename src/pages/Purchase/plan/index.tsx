import React, { useContext, useMemo, useState } from 'react';
import SwitchSelector from 'react-switch-selector';
import { CheckIcon } from '@heroicons/react/solid';
import { Link, Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Button from 'components/Button';
import Container from 'components/Container';
import Headline from 'components/Headline';
import Icon from 'components/Icon';
import { AuthContext } from 'providers/AuthProvider';
import { monthlyPlanList, yearlyPlanList } from 'shared/constants/global';
import moment from 'moment';
import styles from './styles.module.scss';

export default function PurchasePlan() {
  const { userData } = useContext(AuthContext);
  const { t } = useTranslation();

  const durationOption = [
    {
      label: t('Monthly'),
      value: 'monthly',
    },
    {
      label: t('Yearly'),
      value: 'yearly',
    },
  ];

  const [currentSection, setCurrentSection] = useState<any>(durationOption[0].value);
  const planList = useMemo(
    () => (currentSection === durationOption[0].value ? monthlyPlanList : yearlyPlanList),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentSection]
  );
  if (
    userData?.membership &&
    userData?.membership.type !== 'free' &&
    moment().isBefore(userData?.membership.nextDate)
  ) {
    return <Redirect to="/" />;
  }
  return (
    <Container>
      <div className={styles.wrapper}>
        <div className={styles.title}>
          <Icon name="logo" width={200} />
          <Headline className={styles.header}>{t('Pricing Plans')}</Headline>
          <p className={styles.description}>
            Start building for free, then add a site plan to go live. Account plans unlock additional features.
          </p>
          <div className={styles.switchWrapper}>
            <SwitchSelector
              onChange={setCurrentSection}
              options={durationOption}
              initialSelectedIndex={0}
              backgroundColor="#3D4045"
              fontColor="white"
              fontSize={20}
              selectionIndicatorMargin={0}
            />
          </div>
        </div>
        <div className={styles.cardWrapper}>
          {planList.map((tier, index) => (
            <div key={index} className={styles.card}>
              <div className="p-6">
                <h2 className="text-lg font-medium leading-6 text-gray-900">{t(tier.name)}</h2>
                <p className="mt-4 text-sm text-gray-500">{tier.description}</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">{tier.price}€</span>{' '}
                  <span className="text-base font-medium text-gray-500">
                    / {currentSection === durationOption[0].value ? 'mo' : 'yr'}
                  </span>
                </p>
                <Link to={`/purchase/payment/${tier.planType}`}>
                  <Button buttonStyle="primary" className="w-full mt-8">
                    {t('Buy')} {t(tier.name)}
                  </Button>
                </Link>
              </div>
              <div className="px-6 pt-6 pb-8">
                <h3 className="text-xs font-medium tracking-wide text-gray-900 uppercase">{t("What's included")}</h3>
                <ul className="mt-6 space-y-4">
                  {tier.includedFeatures.map((feature, findex: number) => (
                    <li key={findex} className="flex space-x-3">
                      <CheckIcon className="flex-shrink-0 w-6 h-6 text-green-500" aria-hidden="true" />
                      <span className="text-sm text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
