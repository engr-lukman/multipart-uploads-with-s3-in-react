export const getFileType = (file: File) => {
  if (file && !!file?.type) {
    if (file.type.match('image.*')) {
      return 'image';
    } else if (file.type.match('video.*')) {
      return 'video';
    } else if (file.type.match('audio.*')) {
      return 'audio';
    } else if (file.type.match('application/pdf')) {
      return 'pdf';
    } else if (file.type.match('application.*')) {
      return 'doc';
    }
  }
  return 'other';
};

export const randomNumber = (start = 100000, end = 999999) => {
  return Math.floor(Math.random() * end) + start;
};

export const bytesToMB = (bytes: number) => (bytes / (1024 * 1024)).toFixed(2);
