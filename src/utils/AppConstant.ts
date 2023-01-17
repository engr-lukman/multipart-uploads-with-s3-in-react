import pkg from '../../package.json';

export const APP_VERSION = pkg.version;
export const APP_NAME =
  'Multiple multipart large files (1GB And Beyond) uploads to the AWS S3 server using pre-signed URLs and react.js';
export const CHUNK_SIZE = 1024 * 1024 * 100; // 100MB, This must be bigger than or equal to 5MB, otherwise AWS will respond with: "Your proposed upload is smaller than the minimum allowed size"
