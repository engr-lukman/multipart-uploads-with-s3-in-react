import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';

import Icon from 'components/Icon';
import useQueueFileProcessing, { IQueueFileProcessing } from 'hooks/useQueueFileProcessing';
import FilePreview from './FilePreview';
import FileUploadProgressBar from './FileUploadProgressBar';

const UploadFeature = () => {
  const [queueFiles, setQueueFiles] = useState<IQueueFileProcessing[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // File processing
  const [fileProcessingFn, processedFiles, isProcessing, processingMessage] = useQueueFileProcessing();
  useEffect(() => {
    if (!!processedFiles?.length && !isProcessing) {
      setQueueFiles(processedFiles);
    }
  }, [processedFiles, isProcessing]);

  // React-dropzone
  const onDrop = useCallback(
    async (acceptedFiles: any) => await fileProcessingFn(acceptedFiles, queueFiles),
    [queueFiles]
  );

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/jpg': [], 'image/png': [], 'image/gif': [], 'video/*': [] },
    noClick: true,
    noKeyboard: true,
    onDropRejected: (fileRejections: FileRejection[]) => {
      fileRejections?.map((item: any) => {
        toast.error(`${item?.errors[0]?.message}. ${item?.file?.name}.`);
      });
    },
  });

  const fileRemoveHandler = useMemo(
    () => (itemIndex: number) => {
      queueFiles.splice(itemIndex, 1);
      setQueueFiles([...queueFiles]);
    },
    [queueFiles]
  );

  const onSubmitHandler = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsUploading(true);
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <div className="relative px-5 py-2">
      <div className="flex justify-center">
        <form method="POST" onSubmit={onSubmitHandler} encType="multipart/form-data" className="w-[50vw] h-full">
          <h2 className="flex justify-between items-center font-semibold text-yellow-300 mb-2">
            Photo &amp; Video Upload
            <button
              disabled={!queueFiles?.length || isUploading}
              className="flex justify-center items-center bg-yellow-300 text-yellow-900 text-sm py-1 w-32 space-x-2 rounded-lg font-semibold cursor-pointer hover:bg-yellow-200 disabled:cursor-not-allowed disabled:bg-yellow-200 disabled:opacity-50"
            >
              <Icon name="cloud-upload" className="w-6 h-6" />
              <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
            </button>
          </h2>
          <div className="flex w-full h-[75vh] justify-center items-center border border-dashed border-yellow-300 text-white p-4">
            <div className="w-full">
              <FilePreview
                isProcessing={isProcessing}
                processingMessage={processingMessage}
                queueFiles={queueFiles}
                fileRemoveHandler={fileRemoveHandler}
              />
              <div {...getRootProps()} className="w-full text-center pt-4">
                <input {...getInputProps()} />
                <div className="w-full mb-5 border border-dashed py-5">
                  <div className="flex items-center justify-center">
                    <button type="button" onClick={open} className="relative">
                      <Icon name="photo" className="text-gray-600 w-20 h-20" />
                      <Icon
                        name="plus-circle"
                        className="text-gray-500 w-8 h-8 bg-gray-700 absolute bottom-2 right-0 rounded-full"
                      />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400">
                    Upload your image by <span className="font-bold">add button</span>
                  </p>
                  {isDragActive ? (
                    'Drop the files here ...'
                  ) : (
                    <>
                      Drop photos or videos to upload Or{' '}
                      <button type="button" onClick={open} className="underline">
                        Browse
                      </button>
                    </>
                  )}
                  <p className="text-yellow-300">{!!queueFiles?.length && `${queueFiles?.length} files selected`}</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {!!queueFiles?.length && isUploading && (
        <FileUploadProgressBar queueFiles={queueFiles} setQueueFiles={setQueueFiles} setIsUploading={setIsUploading} />
      )}
    </div>
  );
};

export default UploadFeature;
