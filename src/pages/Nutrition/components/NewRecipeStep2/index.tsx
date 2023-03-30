import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import firebase from 'services/firebase';
import { useTranslation } from 'react-i18next';
import { AuthContext } from 'providers/AuthProvider';
import { toast } from 'react-toast';
import { scrollToTop } from 'shared/functions/global';
import ReactCrop, { Crop } from 'react-image-crop';
import RecipeStepSwitch from '../RecipeStepSwitch';

type Props = {
  className?: string;
  currentStep?: any;
  currentStepValue?: string;
  recipeState?: any;
  recipeStateValue?: any;
  popupContainerRef?: any;
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

const NewRecipeStep2: React.FC<Props> = ({
  currentStep,
  currentStepValue,
  recipeState,
  recipeStateValue,
  popupContainerRef,
}) => {
  const imgRef = useRef<HTMLImageElement>();
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const [visible, setVisible] = useState('block');

  const [currentLazyLoad, setCurrentLazyLoad] = useState(false);

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

  // Push Function
  const saveNewRecipePictureToFirebase = async () => {
    setCurrentLazyLoad(true);
    if (recipeStateValue?.imageUrl && upImg === undefined) {
      setVisible('hidden');
      currentStep('3');
    } else if (upImg === undefined) {
      const newColumns = {
        ...recipeStateValue,
        imageUrl: '',
      };

      recipeState(newColumns);
      setVisible('hidden');
      currentStep('3');
      // toast.warn(t('Select Image'));
    } else {
      const thisImage = dataURItoBlob(previewCanvasRef.current?.toDataURL());
      let thisUserUid = authContext.user!.uid;
      if (userData?.role === 1) {
        thisUserUid = 'tortija';
      }
      const res = await firebase.storage().ref(`Recipe_Pictures/${thisUserUid}/${Math.random()}`).put(thisImage);
      const thisImageUrl = await res.ref.getDownloadURL();

      const newColumns = {
        ...recipeStateValue,
        imageUrl: thisImageUrl,
      };

      setCurrentLazyLoad(false);
      recipeState(newColumns);
      setVisible('hidden');
      currentStep('3');
    }
  };

  function returnToPreviousStep() {
    setVisible('hidden');
    currentStep('1');
  }

  useEffect(() => {
    if (currentStepValue !== '2') {
      setVisible('hidden');
    }

    if (visible === 'block') {
      scrollToTop(popupContainerRef);
    }
    console.log(recipeStateValue);
  }, [currentStepValue, popupContainerRef, recipeStateValue, visible]);

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

  return (
    <>
      <div className={visible}>
        {recipeStateValue?.imageUrl && upImg === undefined ? (
          <div className="pt-20 font-light text-base">Du hast schon ein Foto hochgeladen!</div>
        ) : (
          <div className="pt-20 font-light text-base">Bitte laden Sie ein Foto für das neue Rezept hoch!</div>
        )}

        <div>
          <div className="pt-20 pb-20">
            <input type="file" accept="image/*" onChange={onSelectFile} />
          </div>
          {recipeStateValue?.imageUrl && upImg === undefined && (
            <div>
              <div className="font-light text-base pb-10">
                Wenn du ein neues Foto hochladen möchtest wähle oben über die Dateiauswahl ein neues Foto aus.
              </div>{' '}
              <img src={recipeStateValue?.imageUrl} alt="Recipe" />
            </div>
          )}
          <div className="pt-20 pb-80">
            <ReactCrop
              src={upImg as string}
              onImageLoaded={onLoad}
              crop={crop}
              locked
              onChange={c => setCrop(c)}
              onComplete={c => setCompletedCrop(c as CompletedCrop)}
            />
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
        </div>
        <RecipeStepSwitch
          returnFunction={returnToPreviousStep}
          nextFunction={saveNewRecipePictureToFirebase}
          currentStepValue="2"
          totalSteps={6}
          lazyload={currentLazyLoad}
        />
      </div>
    </>
  );
};

export default NewRecipeStep2;
