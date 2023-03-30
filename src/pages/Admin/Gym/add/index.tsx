import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ImageUploader from 'react-images-upload';
import firebase from 'services/firebase';
import { toast } from 'react-toast';
import Headline from 'components/Headline';
import Input from 'components/Input';
import Button from 'components/Button';
import styles from './styles.module.scss';

export default function AddGym() {
  const { t } = useTranslation();
  const history = useHistory();

  const { register, handleSubmit } = useForm();

  const [logoImage, setLogoImage] = useState<File>();
  const [isPending, setIsPending] = useState(false);

  const onSubmit = async (data: any) => {
    const collection = firebase.firestore().collection('gyms');
    if (!logoImage) {
      toast.warn(t('Select gym logo'));
      return;
    }

    const gymData = await collection.where('title', '==', data.title).where('location', '==', data.location).get();
    if (!gymData.empty) {
      toast.warn(t('Gym data already exists'));
      return;
    }
    setIsPending(true);
    // Image upload to firebase storage
    const res = await firebase.storage().ref(`Gyms/${logoImage.name}`).put(logoImage);
    const imageUrl = await res.ref.getDownloadURL();

    // Save Gym data to Firestore

    collection.add({
      ...data,
      logoImage: imageUrl,
      created: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setIsPending(false);
  };

  const onDrop = (pictureFiles: File[]) => {
    setLogoImage(pictureFiles[0]);
  };

  return (
    <>
      <div className={styles.header}>
        <Headline level={1} classLevel={3} displayBackBtn goBack={history.goBack}>
          {t('Add Gym')}
        </Headline>
      </div>
      <div className={styles.content}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <Input name="title" type="text" label="Title" required register={register('title')} />

          <Input name="location" type="text" label="Location" required register={register('location')} />

          <ImageUploader
            withIcon
            withPreview
            singleImage
            buttonText="Choose Logo"
            name="logoImage"
            onChange={onDrop}
            imgExtension={['.jpg', '.gif', '.png', '.gif']}
            maxFileSize={5242880}
          />
          <Button disabled={isPending} isPending={isPending} className="w-full">
            {t('Register')}
          </Button>
        </form>
      </div>
    </>
  );
}
