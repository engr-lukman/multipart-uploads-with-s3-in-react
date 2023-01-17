import S3 from 'aws-sdk/clients/s3';
import axios from 'axios';
import cuid from 'cuid';

import { IQueueFileProcessing } from 'hooks/useQueueFileProcessing';
import { CHUNK_SIZE } from 'utils/AppConstant';

export class S3FileUploadService {
  s3Client: S3;
  bucketName: string;

  item: IQueueFileProcessing;
  uploadId: string;
  uploadKey: string;
  chunkSize: number;
  numberOfParts: number;
  preSignedUrls: any[];
  uploadedParts: IPart[];

  onProgressFn: (progress: any) => void;
  onErrorFn: (err: any) => void;
  onSuccessFn: (resp: any) => void;

  aborted: boolean;

  constructor(options: S3UploadProps) {
    this.s3Client = new S3({
      apiVersion: '2006-03-01',
      accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_S3_SECRET_ACCESS_KEY,
      region: process.env.REACT_APP_S3_REGION,
      signatureVersion: 'v4',
    });

    this.bucketName = process.env.REACT_APP_S3_BUCKET_NAME!;

    this.item = options?.item;
    this.uploadId = '';
    this.uploadKey = '';
    this.chunkSize = CHUNK_SIZE;
    this.numberOfParts = 0;
    this.preSignedUrls = [];
    this.uploadedParts = [];

    this.onProgressFn = () => {};
    this.onErrorFn = () => {};
    this.onSuccessFn = () => {};

    this.aborted = false;
  }

  // Starting the multipart (chunk) upload
  start() {
    this.initUpload();
  }

  // Initiate a multipart upload request
  async initUpload() {
    try {
      const Key = `test/${cuid()}.${this.item?.fileExtension}`;
      const Bucket = this.bucketName;

      const initResp: any = await this.s3Client.createMultipartUpload({ Bucket, Key }).promise();
      this.uploadId = initResp.UploadId;
      this.uploadKey = initResp.Key;
      this.numberOfParts = Math.ceil(this.item?.fileSize / this.chunkSize);

      this.getSignedUrls();
    } catch (error) {
      this.complete(error);
    }
  }

  // Create pre-signed URLs for each part
  async getSignedUrls() {
    try {
      const Bucket = this.bucketName;
      const Key = this.uploadKey;
      const UploadId = this.uploadId;
      const numberOfParts = this.numberOfParts;
      const promises = [];

      for (let i = 0; i < numberOfParts; i++) {
        promises.push(this.s3Client.getSignedUrlPromise('uploadPart', { Bucket, Key, UploadId, PartNumber: i + 1 }));
      }

      const resp: any = await Promise.all(promises);

      const urls: any[] = await resp?.map((el: any, index: number) => ({
        partNumber: index + 1,
        url: el,
      }));

      this.preSignedUrls = urls;

      this.onStartChunkUpload();
    } catch (error) {
      this.complete(error);
    }
  }

  // Uploading start
  async onStartChunkUpload() {
    try {
      const axiosInstant = axios.create();
      delete axiosInstant.defaults.headers.put['Content-Type'];

      const urls: any = this.preSignedUrls;
      const file = this.item?.originalFile;
      const fileName = this.item?.fileName;
      const numberOfParts = this.numberOfParts;
      const chunkSize = this.chunkSize;

      let _progressList: IProgressList[] = await urls.map((item: any) => ({
        fileName,
        numberOfParts,
        partNumber: item?.partNumber,
        percentage: 0,
      }));

      const cancelRequest = axios.CancelToken.source();

      const chunkUploadedPromises = await urls?.map(async (part: any, index: number) => {
        const chunkStartFrom = index * chunkSize;
        const chunkEndTo = (index + 1) * chunkSize;
        const blobSlice = index < urls.length ? file.slice(chunkStartFrom, chunkEndTo) : file.slice(chunkStartFrom);

        const resp = await axiosInstant.put(part?.url, blobSlice, {
          onUploadProgress: async (progressEvent: any) => {
            if (this.aborted) {
              cancelRequest.cancel(`${fileName} uploading canceled.`);
            }

            const { loaded, total } = progressEvent;
            let percentage = Math.floor((loaded * 100) / total);

            _progressList[
              _progressList.findIndex(
                (el: IProgressList) => el?.fileName === this.item?.fileName && el?.partNumber === part?.partNumber
              )
            ] = {
              fileName,
              numberOfParts,
              partNumber: part?.partNumber,
              percentage,
            };

            this.onProgressFn(_progressList);
          },
          cancelToken: cancelRequest.token,
        });

        return resp;
      });

      const respParts = await Promise.all(chunkUploadedPromises);

      const uploadedParts: IPart[] = await respParts.map((part, index) => ({
        ETag: (part as any).headers.etag,
        PartNumber: index + 1,
      }));

      this.uploadedParts = uploadedParts;
      this.finalizeMultipartUpload();
    } catch (error) {
      this.complete(error);
    }
  }

  // Finalize multipart upload
  async finalizeMultipartUpload() {
    try {
      const Bucket = this.bucketName;
      const Key = this.uploadKey;
      const UploadId = this.uploadId;
      const parts: IPart[] = this.uploadedParts;

      const params = { Bucket, Key, UploadId, MultipartUpload: { Parts: parts } };
      const resp = await this.s3Client.completeMultipartUpload(params).promise();
      this.complete();
    } catch (error) {
      this.complete(error);
    }
  }

  // Complete the multipart upload request on success or fail.
  async complete(error?: any) {
    try {
      if (error) {
        this.onErrorFn(error);

        const Bucket = this.bucketName;
        const Key = this.uploadKey;
        const UploadId = this.uploadId;
        const params = { Bucket, Key, UploadId };

        await this.s3Client.abortMultipartUpload(params).promise();
        return;
      }

      this.onSuccessFn(`${this.item?.fileName} successfully uploaded.`);
    } catch (error) {
      this.onErrorFn(error);
    }
  }

  onProgress(onProgress: any) {
    this.onProgressFn = onProgress;
    return this;
  }

  onError(onError: any) {
    this.onErrorFn = onError;
    return this;
  }

  onSuccess(resp: any) {
    this.onSuccessFn = resp;
    return this;
  }

  abort() {
    this.aborted = true;
  }
}

interface IPart {
  ETag: string;
  PartNumber: number;
}

interface IProgressList {
  fileName: string;
  numberOfParts: number;
  partNumber: number;
  percentage: number;
}

export interface S3UploadProps {
  item: IQueueFileProcessing;
}
