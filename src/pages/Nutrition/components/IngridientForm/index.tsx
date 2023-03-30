import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import Button from 'components/Button';
import { useTranslation } from 'react-i18next';
import firebase from 'services/firebase';
import { AuthContext } from 'providers/AuthProvider';
import { formOfNutrition, intolerancesOption } from 'shared/constants/profile-wizard';
import { toast } from 'react-toast';
import ReactCrop, { Crop } from 'react-image-crop';
import { ingredientCategoryValues, ingredientPieceValues } from 'shared/constants/global';
import { OptionTypeBase } from 'react-select';
import { generateRandomUid } from 'shared/functions/global';

import SwitchButton from 'components/SwitchButton';
import { ChevronDownIcon } from '@heroicons/react/outline';
import CustomSelect from 'components/CustomSelect';
import FormItem from '../FormItem';

type Props = {
  className?: string;
  overlayClassFunc?: any;
  ingridientState?: any;
  ingridientStateValue?: any;
  type?: string;
  editIngridientObject?: any;
};

interface CompletedCrop {
  x: number;
  y: number;
  width: number;
  height: number;
  unit: string;
  aspect: number;
}

type TonSelectFile = (evt: React.ChangeEvent<HTMLInputElement>) => void;

const IngridientForm: React.FC<Props> = ({
  overlayClassFunc,
  ingridientState,
  ingridientStateValue,
  type,
  editIngridientObject,
}) => {
  const [currentEditIngridientObject, setCurrentEditIngridientObject] = useState<any>({});
  const [ingridientName, setIngridientName] = useState('');
  const [initialIngridientName, setInitialIngridientName] = useState('');
  const [ingridientKcal100g, setIngridientKcal100g] = useState('');
  const [initialIngridientKcal100g, setInitialIngridientKcal100g] = useState('');
  const [ingridientCarbohydrates100g, setIngridientCarbohydrates100g] = useState('');
  const [initialIngridientCarbohydrates100g, setInitialIngridientCarbohydrates100g] = useState('');
  const [ingridientProtein100g, setIngridientProtein100g] = useState('');
  const [initialIngridientProtein100g, setInitialIngridientProtein100g] = useState('');
  const [ingridientFat100g, setIngridientFat100g] = useState('');
  const [initialIngridientFat100g, setInitialIngridientFat100g] = useState('');
  const [ingridientBallast100g, setIngridientBallast100g] = useState('');
  const [intialIngridientBallast100g, setIntialIngridientBallast100g] = useState('');
  const [ingridientCategory, setIngridientCategory] = useState('');
  const [ingridientDefaultPiece, setIngridientDefaultPiece] = useState('g');
  const [ingridientPreselectG, setIngridientPreselectG] = useState('');
  const [initialIngridientPreselectG, setInitialIngridientPreselectG] = useState('');
  const [ingridientPreselectAmount, setIngridientPreselectAmount] = useState('');
  const [initialIngridientPreselectAmount, setInitialIngridientPreselectAmount] = useState('');
  const [ingridientPreselectType, setIngridientPreselectType] = useState('');
  const [initialIngridientPreselectType, setInitialIngridientPreselectType] = useState('');
  const [initialIngridientImageUrl, setInitialIngridientImageUrl] = useState('');

  const [incompatibilitiesChevronClass, setIncompatibilitiesChevronClass] = useState('text-brownSemiDark');
  const [incompatibilitiesClass, setIncompatibilitiesClass] = useState('hidden');
  const [initialIncompatibilitiesOptions, changeIncompatibilitiesOptions] = useState<any>({
    celery: false,
    egg: false,
    fructose: false,
    histamin: false,
    lactose: false,
    nuts: false,
    peanuts: false,
    sorbitol: false,
    soy: false,
    wheat: false,
  });
  const [incompatibilitiesOptions, setIncompatibilitiesOptions] = useState<any>(initialIncompatibilitiesOptions);

  const [initialFormOfNutritionOptions, setInitialFormOfNutritionOptions] = useState<any>({
    vegan: false,
    vegetarian: false,
    ketogen: false,
    flexitarian: false,
  });
  const [formOfNutritionOptions, setFormOfNutritionOptions] = useState<any>(initialFormOfNutritionOptions);

  const imgRef = useRef<HTMLImageElement>();
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const [upImg, setUpImg] = useState<FileReader['result']>();
  const [crop, setCrop] = useState<Crop>({
    unit: 'px',
    width: 425,
    height: 180,
    x: 25,
    y: 25,
  });
  const [completedCrop, setCompletedCrop] = useState<CompletedCrop>();

  const onSelectFile: TonSelectFile = evt => {
    if (evt.target.files && evt.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setUpImg(reader.result));
      reader.readAsDataURL(evt.target.files[0]);
    }
  };

  const onLoad = useCallback(img => {
    imgRef.current = img;
  }, []);

  const authContext = useContext(AuthContext);
  const { userData } = useContext(AuthContext);

  // Toggle incompatibility area
  const toggleIncompatibilities = (): void => {
    if (incompatibilitiesClass === 'hidden') {
      setIncompatibilitiesClass('block');
      setIncompatibilitiesChevronClass('text-brownSemiDark transition duration-300 transform rotate-180');
    } else {
      setIncompatibilitiesClass('hidden');
      setIncompatibilitiesChevronClass('text-brownSemiDark transition duration-300 transform rotate-360');
    }
  };

  // Change incompatibility items
  const setIncompatibilities = (status: boolean, item: string): void => {
    const newColumns = {
      ...incompatibilitiesOptions,
      [item.toLowerCase()]: status,
    };

    const newColumnsEditObject = {
      ...currentEditIngridientObject[0],
      [item.toLowerCase()]: status,
    };

    setIncompatibilitiesOptions(newColumns);
    setCurrentEditIngridientObject([newColumnsEditObject]);
  };

  const { t } = useTranslation();

  function dataURItoBlob(dataURI: any) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) byteString = atob(dataURI.split(',')[1]);
    else byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i += 1) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }

  const saveExistingIngridientToFirebase = async () => {
    const thisImage = dataURItoBlob(previewCanvasRef.current?.toDataURL());
    let thisUserUid = authContext.user!.uid;
    if (userData?.role === 1) {
      thisUserUid = 'tortija';
    }

    let thisImageUrl = initialIngridientImageUrl;

    if (upImg !== undefined) {
      const res = await firebase.storage().ref(`Ingredient_Pictures/${thisUserUid}/${Math.random()}`).put(thisImage);
      thisImageUrl = await res.ref.getDownloadURL();
    }

    const newColumns = {
      ...currentEditIngridientObject[0],
      ballast_100g: ingridientBallast100g,
      kcal_100g: ingridientKcal100g,
      carbohydrates_100g: ingridientCarbohydrates100g,
      protein_100g: ingridientProtein100g,
      fat_100g: ingridientFat100g,
      category: ingridientCategory,
      default_piece: ingridientDefaultPiece,
      imageUrl: thisImageUrl,
      preselect_amount: ingridientPreselectAmount,
      preselect_g: ingridientPreselectG,
      preselect_type: ingridientPreselectType,
      name: ingridientName,
    };

    const newColumnsState = [
      newColumns,
      ...ingridientStateValue.filter((item: any) => item.uid !== currentEditIngridientObject[0].uid),
    ];

    if (userData?.role === 1) {
      try {
        await firebase
          .firestore()
          .collection('ingredients')
          .doc(currentEditIngridientObject[0].uid)
          .update(newColumns as object);
        toast.success(t('Dein Lebensmittel wurde erfolgreich gespeichert!'));
      } catch (error: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        toast.error(`Es ist leider etwas schief gegangen!${error}`);
      }
    } else {
      try {
        await firebase
          .firestore()
          .collection('users')
          .doc(authContext.user?.uid)
          .collection('ingredients')
          .doc(currentEditIngridientObject[0].uid)
          .update(newColumns as object);
        toast.success(t('Dein Lebensmittel wurde erfolgreich gespeichert!'));
      } catch (error: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        toast.error('Es ist leider etwas schief gegangen!');
      }
    }

    ingridientState(newColumnsState);
    overlayClassFunc('hidden');
  };

  // Push Function
  const saveNewIngridientToFirebase = async () => {
    const thisIngridientUid = generateRandomUid();

    const thisImage = dataURItoBlob(previewCanvasRef.current?.toDataURL());
    let thisUserUid = authContext.user!.uid;
    if (userData?.role === 1) {
      thisUserUid = 'tortija';
    }
    const res = await firebase.storage().ref(`Ingredient_Pictures/${thisUserUid}/${Math.random()}`).put(thisImage);
    const thisImageUrl = await res.ref.getDownloadURL();

    const newColumns = {
      ballast_100g: ingridientBallast100g,
      kcal_100g: ingridientKcal100g,
      carbohydrates_100g: ingridientCarbohydrates100g,
      protein_100g: ingridientProtein100g,
      fat_100g: ingridientFat100g,
      category: ingridientCategory,
      default_piece: ingridientDefaultPiece,
      imageUrl: thisImageUrl,
      preselect_amount: ingridientPreselectAmount,
      preselect_g: ingridientPreselectG,
      preselect_type: ingridientPreselectType,
      name: ingridientName,
      userIngridient: true,
      uid: thisIngridientUid,
      ...incompatibilitiesOptions,
      ...formOfNutritionOptions,
    };

    const newColumnsAdmin = {
      ballast_100g: ingridientBallast100g,
      kcal_100g: ingridientKcal100g,
      carbohydrates_100g: ingridientCarbohydrates100g,
      protein_100g: ingridientProtein100g,
      fat_100g: ingridientFat100g,
      category: ingridientCategory,
      default_piece: ingridientDefaultPiece,
      imageUrl: thisImageUrl,
      preselect_amount: ingridientPreselectAmount,
      preselect_g: ingridientPreselectG,
      preselect_type: ingridientPreselectType,
      name: ingridientName,
      uid: thisIngridientUid,
      ...incompatibilitiesOptions,
      ...formOfNutritionOptions,
    };

    const newColumnsFavorite = {
      uid: thisIngridientUid,
      name: ingridientName,
      origId: thisIngridientUid,
    };

    const newColumnsState = [newColumns, ...ingridientStateValue];

    if (userData?.role === 1) {
      try {
        await firebase
          .firestore()
          .collection('ingredients')
          .doc(thisIngridientUid)
          .set(newColumnsAdmin as object);
        toast.success(t('Dein Lebensmittel wurde erfolgreich erstellt!'));
      } catch (error: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        toast.error('Es ist leider etwas schief gegangen!');
      }
    } else {
      try {
        await firebase
          .firestore()
          .collection('users')
          .doc(authContext.user?.uid)
          .collection('ingredients')
          .doc(thisIngridientUid)
          .set(newColumns as object);
        try {
          await firebase
            .firestore()
            .collection('users')
            .doc(authContext.user?.uid)
            .collection('favorites_ingredients')
            .doc()
            .set(newColumnsFavorite as object);
        } catch (error: any) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          toast.error('Es ist leider etwas schief gegangen!');
        }
        toast.success(t('Dein Lebensmittel wurde erfolgreich erstellt!'));
      } catch (error: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        toast.error('Es ist leider etwas schief gegangen!');
      }
    }

    ingridientState(newColumnsState);
    setInitialIngridientName(' ');
    setInitialIngridientKcal100g(' ');
    setInitialIngridientCarbohydrates100g(' ');
    setInitialIngridientProtein100g(' ');
    setInitialIngridientFat100g(' ');
    setIntialIngridientBallast100g(' ');
    setIngridientCategory('');
    setIngridientDefaultPiece('g');
    setInitialIngridientPreselectG(' ');
    setInitialIngridientPreselectAmount(' ');
    setInitialIngridientPreselectType(' ');
    setIncompatibilitiesOptions(initialIncompatibilitiesOptions);
    if (incompatibilitiesClass === 'block') {
      toggleIncompatibilities();
    }
    setUpImg(' ');
    overlayClassFunc('hidden');
  };

  // Change ingredient category
  const updateCategory = (value: OptionTypeBase) => {
    setIngridientCategory(value.label);
  };

  // Change ingredient category
  const updateDefaultPiece = (value: OptionTypeBase) => {
    setIngridientDefaultPiece(value.value);
  };

  // Change nutrition form items
  const setFormOfNutrition = (status: boolean, item: string): void => {
    const newColumns = {
      ...formOfNutritionOptions,
      [item.toLowerCase()]: status,
    };

    const newColumnsEditObject = {
      ...currentEditIngridientObject[0],
      [item.toLowerCase()]: status,
    };

    setFormOfNutritionOptions(newColumns);
    setCurrentEditIngridientObject([newColumnsEditObject]);
  };

  // Image Crop
  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image: any = imgRef.current;
    const canvas: any = previewCanvasRef.current;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const pixelRatio = window.devicePixelRatio;

    const width = 425;
    const height = 180;
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    const cropC = crop;

    ctx.drawImage(
      image,
      cropC.x * scaleX,
      cropC.y * scaleY,
      cropC.width * scaleX,
      cropC.height * scaleY,
      0,
      0,
      cropC.width,
      cropC.height
    );
  }, [crop, completedCrop]);

  useEffect(() => {
    if (type === 'edit') {
      setInitialIngridientName(editIngridientObject[0].name);

      setInitialIngridientKcal100g(editIngridientObject[0].kcal_100g);
      setInitialIngridientCarbohydrates100g(editIngridientObject[0].carbohydrates_100g);
      setInitialIngridientProtein100g(editIngridientObject[0].protein_100g);
      setInitialIngridientFat100g(editIngridientObject[0].fat_100g);
      setIntialIngridientBallast100g(editIngridientObject[0].ballast_100g);
      setIngridientCategory(editIngridientObject[0].category);
      setInitialIngridientPreselectG(editIngridientObject[0].preselect_g);
      setInitialIngridientPreselectAmount(editIngridientObject[0].preselect_amount);
      setInitialIngridientPreselectType(editIngridientObject[0].preselect_type);
      setInitialIngridientImageUrl(editIngridientObject[0].imageUrl);

      if (editIngridientObject[0].default_piece !== undefined) {
        setIngridientDefaultPiece(editIngridientObject[0].default_piece);
      }

      setIngridientName(editIngridientObject[0].name);
      setIngridientKcal100g(editIngridientObject[0].kcal_100g);
      setIngridientCarbohydrates100g(editIngridientObject[0].carbohydrates_100g);
      setIngridientProtein100g(editIngridientObject[0].protein_100g);
      setIngridientFat100g(editIngridientObject[0].fat_100g);
      setIngridientBallast100g(editIngridientObject[0].ballast_100g);
      setIngridientCategory(editIngridientObject[0].category);
      setIngridientPreselectG(editIngridientObject[0].preselect_g);
      setIngridientPreselectAmount(editIngridientObject[0].preselect_amount);
      setIngridientPreselectType(editIngridientObject[0].preselect_type);

      setCurrentEditIngridientObject(editIngridientObject);
    }
  }, [editIngridientObject, type]);

  return (
    <>
      <div>
        <FormItem name="Name" dbField="name" stateFunction={setIngridientName} initialValue={initialIngridientName} />
        <FormItem
          name="Kalorien 100g"
          dbField="kcal_100g"
          stateFunction={setIngridientKcal100g}
          initialValue={initialIngridientKcal100g}
        />
        <FormItem
          name="Kohlenhydrate 100g"
          dbField="carbohydrates_100g"
          stateFunction={setIngridientCarbohydrates100g}
          initialValue={initialIngridientCarbohydrates100g}
        />
        <FormItem
          name="Eiweiß 100g"
          dbField="protein_100g"
          stateFunction={setIngridientProtein100g}
          initialValue={initialIngridientProtein100g}
        />
        <FormItem
          name="Fett 100g"
          dbField="fat_100g"
          stateFunction={setIngridientFat100g}
          initialValue={initialIngridientFat100g}
        />
        <FormItem
          name="Ballaststoffe 100g"
          dbField="ballast_100g"
          stateFunction={setIngridientBallast100g}
          initialValue={intialIngridientBallast100g}
        />
        <div className=" pt-10 px-20">
          <div className="flex gap-20 pt-4">
            <div className="font-light my-auto w-130">Kategorie:</div>
            <div>
              <div className="font-light left text-xs border-opacity-30 w-200">
                {type === 'edit' ? (
                  <CustomSelect
                    name="category"
                    dropDownOption={ingredientCategoryValues}
                    defaultValue={
                      editIngridientObject[0]?.category !== ''
                        ? ingredientCategoryValues.filter(st => st.label === editIngridientObject[0].category)
                        : ingredientCategoryValues[0]
                    }
                    onChange={updateCategory}
                  />
                ) : (
                  <CustomSelect
                    name="category"
                    dropDownOption={ingredientCategoryValues}
                    defaultValue={
                      ingridientCategory !== ''
                        ? ingredientCategoryValues.filter(st => st.label === ingridientCategory)
                        : ingredientCategoryValues[0]
                    }
                    onChange={updateCategory}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className=" pt-10 px-20">
          <div className="flex gap-20 pt-4">
            <div className="font-light my-auto w-130">Einheit:</div>
            <div>
              <div className="font-light left text-xs border-opacity-30 w-200">
                {type === 'edit' ? (
                  <CustomSelect
                    name="default_piece"
                    dropDownOption={ingredientPieceValues}
                    defaultValue={
                      editIngridientObject[0]?.default_piece !== undefined
                        ? ingredientPieceValues.filter(st => st.value === editIngridientObject[0].default_piece)
                        : ingredientPieceValues[0]
                    }
                    onChange={updateDefaultPiece}
                  />
                ) : (
                  <CustomSelect
                    name="default_piece"
                    dropDownOption={ingredientPieceValues}
                    defaultValue={
                      ingridientDefaultPiece !== ''
                        ? ingredientPieceValues.filter(st => st.value === ingridientDefaultPiece)
                        : ingredientPieceValues[0]
                    }
                    onChange={updateDefaultPiece}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <FormItem
          name="Vorgabewert (Portionsgröße)"
          dbField="preselect_g"
          stateFunction={setIngridientPreselectG}
          initialValue={initialIngridientPreselectG}
        />
        <FormItem
          name="Vorgabewert (Menge)"
          dbField="preselect_amount"
          stateFunction={setIngridientPreselectAmount}
          initialValue={initialIngridientPreselectAmount}
        />
        <FormItem
          name="Vorgabewert (Einheit)"
          dbField="preselect_type"
          stateFunction={setIngridientPreselectType}
          initialValue={initialIngridientPreselectType}
        />
      </div>
      <div className="font-light text-base pt-20 pl-20 pr-15">
        Hier kannst du dein eigenes Foto von dem neuen Lebensmittel hochladen und einen geeigneten Ausschnitt wählen!
      </div>
      <div className="pt-20 pl-20 pr-15">
        <input type="file" accept="image/*" onChange={onSelectFile} />
      </div>
      <div className="pt-20 md:pl-20 md:pr-15 pb-20">
        {type === 'edit' ? (
          <>
            {upImg !== undefined ? (
              <>
                <ReactCrop
                  src={upImg as string}
                  onImageLoaded={onLoad}
                  crop={crop}
                  locked
                  onChange={c => setCrop(c)}
                  onComplete={c => setCompletedCrop(c as CompletedCrop)}
                />
                <div className="pt-10">
                  <Button onClick={() => setUpImg(undefined)} className="text-12 py-2">
                    Originalbild wiederherstellen
                  </Button>
                </div>
              </>
            ) : (
              <>
                <img src={initialIngridientImageUrl} alt="Ingredient" />
              </>
            )}
          </>
        ) : (
          <ReactCrop
            src={upImg as string}
            onImageLoaded={onLoad}
            crop={crop}
            locked
            onChange={c => setCrop(c)}
            onComplete={c => setCompletedCrop(c as CompletedCrop)}
          />
        )}
      </div>
      <div className="hidden">
        <canvas
          ref={previewCanvasRef}
          // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
          style={{
            width: Math.round(completedCrop?.width ?? 0),
            height: Math.round(completedCrop?.height ?? 0),
          }}
        />
      </div>
      <div className="md:pl-20 md:pr-20">
        <div className="flex gap-40 pt-40 pb-20">
          <div className="font-light">Für welche Ernährungsform ist dieses Lebensmittel geeignet?</div>
        </div>
        <div className="mb-40">
          {formOfNutrition.map((item: string, index: number) => (
            <>
              {type === 'edit' ? (
                <SwitchButton
                  key={index}
                  label={item}
                  enabled={
                    currentEditIngridientObject.length > 0 &&
                    Boolean(currentEditIngridientObject[0][item?.toLowerCase()])
                  }
                  isBackground={index % 2 === 0}
                  onChange={setFormOfNutrition}
                />
              ) : (
                <SwitchButton
                  enabled={formOfNutritionOptions[item.toLowerCase()]}
                  key={index}
                  label={item}
                  isBackground={index % 2 === 0}
                  onChange={setFormOfNutrition}
                />
              )}
            </>
          ))}
        </div>
      </div>
      <div className="pb-30 md:pl-20 md:pr-20">
        <div
          className="flex  pt-0 mb-14 cursor-pointer"
          id="descriptionJumpContainer"
          onClick={() => toggleIncompatibilities()}
          onKeyDown={() => toggleIncompatibilities()}
          aria-hidden="true"
        >
          <div className="font-light text-2xl">{t('Intolerances')}</div>
          <div className="pl-5 my-auto">
            <ChevronDownIcon className={incompatibilitiesChevronClass} height={30} width={30} />
          </div>
        </div>
        <div className={incompatibilitiesClass}>
          {intolerancesOption.map((item: string, index: number) => (
            <>
              {type === 'edit' ? (
                <SwitchButton
                  key={index}
                  label={item}
                  enabled={
                    currentEditIngridientObject.length > 0 &&
                    Boolean(currentEditIngridientObject[0][item?.toLowerCase()])
                  }
                  isBackground={index % 2 === 0}
                  onChange={setIncompatibilities}
                />
              ) : (
                <SwitchButton
                  enabled={incompatibilitiesOptions[item.toLowerCase()]}
                  key={index}
                  label={item}
                  isBackground={index % 2 === 0}
                  onChange={setIncompatibilities}
                />
              )}
            </>
          ))}
        </div>
      </div>

      <div className="px-20 pb-20">
        {type === 'edit' ? (
          <Button className="w-full" onClick={() => saveExistingIngridientToFirebase()}>
            Änderungen speichern
          </Button>
        ) : (
          <Button className="w-full" onClick={() => saveNewIngridientToFirebase()}>
            {t('Add')}
          </Button>
        )}
      </div>
    </>
  );
};

export default IngridientForm;
