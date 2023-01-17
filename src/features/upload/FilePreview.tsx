import { memo } from 'react';

import Icon from 'components/Icon';
import Spinner from 'components/Spinner';
import { IQueueFileProcessing } from 'hooks/useQueueFileProcessing';

interface FilePreviewProps {
  isProcessing: boolean;
  processingMessage: string;
  queueFiles: IQueueFileProcessing[];
  fileRemoveHandler: Function;
}

const FilePreview = (props: FilePreviewProps) => {
  const { isProcessing, processingMessage, queueFiles, fileRemoveHandler } = props;

  if (isProcessing)
    return (
      <div className="max-h-[200px] overflow-hidden shadow-2xl bg-gray-400 rounded-sm">
        <div className="flex items-center justify-center h-full py-5 text-yellow-300">
          <Spinner className="w-8 h-8" /> <span>{processingMessage}</span>
        </div>
      </div>
    );

  return (
    <>
      {!!queueFiles.length && (
        <div className="max-h-[200px] overflow-hidden overflow-y-auto mt-2 border-1 shadow-2xl p-2 bg-gray-400 rounded-sm">
          <div className="grid gap-2 grid-cols-6">
            {queueFiles.map((item: IQueueFileProcessing, index: number) => {
              return (
                <div key={index} className="relative">
                  <div className="relative w-full h-14 rounded-sm">
                    <img
                      src={URL.createObjectURL(item?.thumbFile)}
                      alt={item?.fileName}
                      className="object-cover h-full w-full rounded-sm"
                    />
                  </div>
                  <button
                    className="absolute text-red-600 top-0 right-0 bottom-0 left-0 z-10 opacity-0 hover:opacity-100"
                    type="button"
                    onClick={() => fileRemoveHandler(index)}
                  >
                    <p className="flex w-full h-full justify-center items-center">
                      <Icon name="trash" className="w-6 h-6 rounded-full bg-gray-600 p-1" />
                    </p>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default memo(FilePreview);
