import clsx from 'clsx';
import { Circle } from 'rc-progress';
import { memo, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import Icon from 'components/Icon';
import Spinner from 'components/Spinner';
import { IQueueFileProcessing } from 'hooks/useQueueFileProcessing';
import { S3FileUploadService, S3UploadProps } from 'services/S3FileUploadService';

const s3UploaderInstList: any[] = [];

interface Props {
  queueFiles: IQueueFileProcessing[];
  setQueueFiles: Function;
  setIsUploading: Function;
}

const FileUploadProgressBar = (props: Props) => {
  const { queueFiles, setQueueFiles, setIsUploading } = props;

  const isUploadingStartRef = useRef(false);
  const [progressList, setProgressList] = useState<any>({ list: [] });
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [completedProcessCount, setCompletedProcessCount] = useState<number>(0);

  useEffect(() => {
    if (!!isUploadingStartRef?.current) {
      setCompletedProcessCount(0);
      isMinimized ? setIsMinimized(true) : setIsMinimized(false);

      let _progressList: IQueueFileProcessing[] = queueFiles;
      setProgressList({ list: _progressList });
      startUploadingQueue(0, _progressList);
    }

    return () => {
      isUploadingStartRef.current = true;
    };
  }, [queueFiles]);

  const startUploadingQueue = async (currentProcessIndex: number, _progressList: IQueueFileProcessing[]) => {
    try {
      const item: any = queueFiles?.find((el, index) => currentProcessIndex === index && !el?.isCompleted);

      if (!!item?.fileId) {
        const s3UploaderPayload: S3UploadProps = { item };
        const s3Uploader = new S3FileUploadService(s3UploaderPayload);
        s3UploaderInstList.push(s3Uploader);

        let _updatedProgressList = [..._progressList];

        await s3Uploader
          .onProgress((progress: any) => {
            const sumTotal = progress.reduce((acc: number, cv: { percentage: number }) => acc + cv.percentage, 0);
            const percentage = Math.floor(sumTotal / progress[0].numberOfParts);
            if (percentage < 100 && percentage % 2 === 0) {
              _updatedProgressList[currentProcessIndex] = { ...item, progress: percentage };
              setProgressList({ list: _updatedProgressList });
            }
          })
          .onError((error: any) => {
            _updatedProgressList[currentProcessIndex] = { ...item, isCanceled: true, isProcessing: false };
            setProgressList({ list: _updatedProgressList });

            setCompletedProcessCount((prevCount) => prevCount + 1);
            startUploadingQueue(currentProcessIndex + 1, _updatedProgressList);

            toast.error(error?.message);
          })
          .onSuccess((resp: any) => {
            _updatedProgressList[currentProcessIndex] = { ...item, isCompleted: true, progress: 100 };
            setProgressList({ list: _updatedProgressList });

            setCompletedProcessCount((prevCount) => prevCount + 1);
            startUploadingQueue(currentProcessIndex + 1, _updatedProgressList);

            toast.success(`${item?.fileName} successfully uploaded.`);
          });

        s3Uploader.start();
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  const onCancelHandler = (cancelIndex: number) => {
    s3UploaderInstList.filter((el: IQueueFileProcessing, index) => cancelIndex === index)[0].abort();
  };

  const onCloseHandler = () => {
    setIsUploading(false);
    setQueueFiles([]);
  };

  return (
    <div className="absolute right-0 bottom-0 w-[20vw] h-auto bg-gray-400 shadow mr-[1px]">
      <div className="">
        <h2 className="flex justify-between items-center font-semibold text-yellow-300 p-2 bg-gray-700">
          {`${completedProcessCount} out of ${progressList?.list?.length} uploads complete`}
          <button onClick={() => setIsMinimized(!isMinimized)} className="">
            <Icon name={isMinimized ? 'go-back' : 'minus'} className="w-4 h-4 text-yellow-400" />
          </button>
          <button onClick={() => onCloseHandler()} className="">
            <Icon name="x" className="w-4 h-4 text-yellow-400" />
          </button>
        </h2>
        <div
          className={clsx('w-full max-h-[55vh] overflow-hidden overflow-y-auto bg-gray-600', isMinimized && 'hidden')}
        >
          {progressList?.list.map((item: IQueueFileProcessing, index: number) => (
            <div key={item?.fileId}>
              <div className="flex justify-between items-center text-white p-1">
                <div className="w-full flex justify-between items-center space-x-2">
                  <div className="flex justify-between items-center space-x-1">
                    <span>
                      <Icon name={item?.fileType === 'image' ? 'photo' : 'video'} className="w-4 h-4" />
                    </span>
                    <span className="text-[10px]">
                      {item?.fileName} - (<span className="text-yellow-300">{item?.progress}%)</span>
                    </span>
                  </div>
                  <div className="pr-2">
                    {item?.isProcessing && item?.progress > 0 && item?.progress < 100 && (
                      <button onClick={() => onCancelHandler(index)} className="text-red-600">
                        <Icon name="x" className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex justify-center w-auto">
                  {item?.isProcessing && item?.progress <= 0 && <Spinner className="w-4 h-4" />}
                  {item?.isProcessing && item?.progress > 0 && item?.progress < 100 && (
                    <div className="w-3 flex justify-center items-center">
                      <Circle
                        percent={item?.progress}
                        trailWidth={3}
                        strokeWidth={3}
                        trailColor="white"
                        strokeColor="green"
                      />
                    </div>
                  )}
                  {item?.progress >= 100 && <Icon name="check" className="w-4 h-4 text-green-700" />}
                  {item?.isCanceled && <Icon name="error" className="w-4 h-w-4 text-red-600" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(FileUploadProgressBar);
