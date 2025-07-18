import { FC, useEffect, useState } from 'react';
import { Image } from 'antd';

import { getProgramImage } from 'api/ProgramService';

interface IProps {
  imagePath: string;
  alt: string;
  defaultImage: string;
}

export const SecureImage: FC<IProps> = ({ imagePath, alt, defaultImage }) => {
  const [imageUrl, setImageUrl] = useState(defaultImage);

  useEffect(() => {
    if (!imagePath) return;

    getProgramImage(imagePath)
      .then(({ data }) => {
        const blobUrl = URL.createObjectURL(data);
        setImageUrl(blobUrl);
      })
      .catch(() => {
        setImageUrl(defaultImage);
      });

    // Очистка Blob URL при размонтировании
    return () => {
      if (imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imagePath]);

  return <Image src={imageUrl} alt={alt} preview={false} height={140} style={{ objectFit: 'cover' }} />;
};
