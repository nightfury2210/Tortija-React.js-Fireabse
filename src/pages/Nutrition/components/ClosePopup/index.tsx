import React from 'react';
import Button from 'components/Button';
import { useTranslation } from 'react-i18next';
import { XIcon } from '@heroicons/react/outline';
import styles from './styles.module.scss';

type Props = {
  className?: string;
  closeFunction?: any;
  reOpenFunction?: any;
};

const ClosePopup: React.FC<Props> = ({ closeFunction, reOpenFunction }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className={styles.backgroundPopupLayer}>
        <div className={styles.editIngridientPopup}>
          <div className="flex justify-between pt-20 pl-20">
            <div className="flex">
              <div className="my-auto pr-10">
                <XIcon width={25} height={25} className="text-brownSemiDark mx-auto" />
              </div>
              <div className="text-xl my-auto font-light">Dialog schließen</div>
            </div>
          </div>
          <div className={styles.editIngridientPopupContent}>
            <div className="pt-15 pl-20 pb-30">
              <div className="pt-20 font-light text-base">
                Wollen Sie den Dialog wirklich verlassen? Alle gespeicherten Daten gehen dabei verloren.
              </div>
              <div className="pt-30 flex gap-30 justify-between">
                <div>
                  <Button className="w-full" onClick={() => closeFunction()}>
                    Ja, verlassen
                  </Button>
                </div>
                <div>
                  <Button className="w-full" onClick={() => reOpenFunction()}>
                    Nein, zurück zur Eingabe
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClosePopup;
