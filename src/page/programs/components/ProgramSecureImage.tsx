import { FC, useEffect, useState } from 'react';
import { Image } from 'antd';

import { getProgramImage } from 'api/ProgramService';

interface IProps {
  imagePath: string;
  alt: string;
  defaultImage: string;
}

export const SecureImage: FC<IProps> = ({ imagePath, alt, defaultImage }) => {
  const [imageUrl, setImageUrl] = useState<string>(defaultImage);

  useEffect(() => {
    if (!imagePath) return;
    let blobUrl: string | null = null;

    getProgramImage(imagePath)
      .then(({ data }) => {
        if (data instanceof Blob) {
          blobUrl = URL.createObjectURL(data);
          setImageUrl(blobUrl);
        } else {
          console.error('Ожидался Blob, получено:', data);
          setImageUrl(defaultImage);
        }
      })
      .catch((error) => {
        console.error('Ошибка загрузки изображения:', error);
        setImageUrl(defaultImage);
      });

    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [imagePath, defaultImage]);

  return (
    <Image
      src={imageUrl}
      alt={alt}
      preview={false}
      height={140}
      style={{ objectFit: 'cover' }}
      fallback={defaultImage} // Запасное изображение при ошибке
    />
  );
};
