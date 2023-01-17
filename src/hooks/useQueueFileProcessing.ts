import { useState } from 'react';
import { toast } from 'react-toastify';

import { getFileType, randomNumber } from 'utils/helpers';

export interface IQueueFileProcessing {
  fileId: number;
  fileName: string;
  fileExtension: string;
  fileSize: number;
  fileType: string;
  thumbFile: any;
  previewFile: any;
  originalFile: any;
  progress: number;
  isProcessing: boolean;
  isCompleted: boolean;
  isCanceled: boolean;
}

const useQueueFileProcessing = () => {
  const [processedFiles, setProcessedFiles] = useState<IQueueFileProcessing[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingMessage, setProcessingMessage] = useState<string>('');

  const startFileProcessing = async (rawFiles: any, oldProcessedFiles: IQueueFileProcessing[] = []) => {
    const startProcessingTime = performance.now();
    const queueList: IQueueFileProcessing[] = [];
    setIsProcessing(true);
    await queueProcessing(0);

    async function queueProcessing(nextProcessIndex: number) {
      const file = rawFiles[nextProcessIndex];
      setProcessingMessage(`Processing left ${rawFiles?.length - nextProcessIndex} out of ${rawFiles?.length}`);

      if (!!file?.name) {
        const fileType = getFileType(file);

        let queueItem: IQueueFileProcessing = {
          fileId: randomNumber(),
          fileName: file?.name,
          fileExtension: file?.name?.split('.').pop(),
          fileSize: file?.size,
          fileType: fileType ?? '',
          thumbFile: '',
          previewFile: '',
          originalFile: file,
          progress: 0,
          isCompleted: false,
          isProcessing: true,
          isCanceled: false,
        };

        await generateNewFiles(file, fileType)
          .then((newFile: any) => {
            const newQueueItem = {
              ...queueItem,
              thumbFile: newFile?.thumbFile,
              previewFile: newFile?.previewFile,
            };
            queueItem = newQueueItem;
          })
          .catch((error) => console.log(`Thumbnail and preview generation failed. ${error}`));

        queueList.push(queueItem);
        await queueProcessing(nextProcessIndex + 1);
      }
    }

    await Promise.resolve([...oldProcessedFiles, ...queueList])
      .then((result) => {
        setProcessedFiles(result.filter((el) => !!el?.thumbFile && !!el?.previewFile));
        setIsProcessing(false);
        const endProcessingTime = performance.now();
        console.info(
          `Total processing time: ${((endProcessingTime - startProcessingTime) / 1000).toFixed(3)} seconds.`
        );
      })
      .catch(() => setProcessedFiles([...oldProcessedFiles]));
  };

  return [
    (rawFiles: any[], oldProcessedFiles: IQueueFileProcessing[] = []) =>
      startFileProcessing(rawFiles, oldProcessedFiles),
    processedFiles,
    isProcessing,
    processingMessage,
  ] as const;
};

// Generate low resolution thumbnail and preview file
const generateNewFiles = async (file: File, fileType: string = 'image') => {
  let thumbFile: any = '';
  let previewFile: any = '';
  try {
    thumbFile = previewFile = await generateCanvas(file, fileType, 2, 0.75);

    if (fileType === 'image') {
      thumbFile = await generateCanvas(previewFile, fileType, 2, 0.5);
    }

    return { thumbFile, previewFile };
  } catch (error) {
    toast.error(`${error}`);
    return { thumbFile, previewFile };
  }
};

const generateCanvas = (file: any, fileType: string, divisionBy = 5, quality = 0.75) => {
  return new Promise((resolve, reject) => {
    let canvas: any = document.createElement('canvas');
    canvas.imageSmoothingQuality = 'medium'; // [low, medium, high] Reference:https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingQuality
    let context: any = canvas.getContext('2d');

    if (fileType === 'image') {
      let img = document.createElement('img');
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        canvas.width = img.width / divisionBy;
        canvas.height = img.height / divisionBy;
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        return context.canvas.toBlob((blob: any) => resolve(blob), 'image/jpeg', quality);
      };

      img.onerror = () => reject(`${file.name} is invalid image format.`);
    } else if (fileType === 'video') {
      const video = document.createElement('video');
      video.autoplay = true;
      video.muted = true;
      video.src = URL.createObjectURL(file);

      video.onloadeddata = () => {
        canvas.width = video.videoWidth / divisionBy;
        canvas.height = video.videoHeight / divisionBy;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        video.pause();
        return context.canvas.toBlob((blob: any) => resolve(blob), 'image/jpeg', quality);
      };

      video.onerror = () => reject(`${file.name} is invalid video format.`);
    }
  });
};

export default useQueueFileProcessing;
