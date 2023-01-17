import React, { SVGAttributes } from 'react';

export type IconName = keyof typeof IconComponentMappings;

interface IconProps extends React.SVGAttributes<SVGElement> {
  /**
   * Icon name to render
   */
  name: IconName;
  /**
   * Additional classes for icon styling
   */
  className?: string;
}

const IconComponentMappings = {
  trash: TrashIcon,
  x: XIcon,
  'go-back': GoBackIcon,
  minus: MinusIcon,
  photo: PhotoIcon,
  video: VideoIcon,
  'cloud-download': CloudDownloadIcon,
  'cloud-upload': CloudUploadIcon,
  error: ErrorIcon,
  check: CheckIcon,
  'plus-circle': PlusCircleIcon,
};

export default function Icon({ name, className = '', ...others }: IconProps) {
  const Component = IconComponentMappings[name];

  if (!Component) return null;

  return <Component className={className} {...others} />;
}

function TrashIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}

function XIcon(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function GoBackIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-6 h-6"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
    </svg>
  );
}

function MinusIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-6 h-6"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
    </svg>
  );
}

function PhotoIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-6 h-6"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
      />
    </svg>
  );
}

function VideoIcon(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M23.0002 49.9999C22.0002 49.8749 21.0002 49.8749 20.0002 49.7499C16.8752 49.3749 13.7502 48.6249 10.7502 47.3749C6.62521 45.4999 3.75021 42.4999 2.12521 38.2499C0.750209 34.8749 0.125208 31.3749 -0.124792 27.7499C-0.374792 23.6249 -0.124791 19.4999 1.00021 15.4999C1.62521 13.7499 2.25021 12.1249 2.87521 10.4999C4.50021 6.74995 7.50021 4.12495 11.2502 2.49995C14.5002 1.12495 17.8752 0.499946 21.3752 0.124946C25.8752 -0.250054 30.3752 -5.41806e-05 34.7502 1.12495C37.8752 1.87495 40.7502 3.12495 43.2502 5.12495C43.5002 5.37495 43.8752 5.62495 44.1252 5.87495C44.5002 6.24995 44.3752 6.62495 44.1252 6.87495C43.8752 7.12495 43.5002 7.24995 43.1252 6.87495C39.5002 3.74995 35.1252 2.49995 30.5002 1.87495C25.8752 1.24995 21.3752 1.37495 16.8752 2.37495C14.8752 2.74995 13.0002 3.49995 11.1252 4.24995C7.50021 5.87495 5.12521 8.62495 3.75021 12.2499C2.37521 15.6249 1.75021 19.1249 1.62521 22.7499C1.37521 26.6249 1.75021 30.4999 2.75021 34.2499C3.25021 35.8749 3.87521 37.4999 4.50021 38.9999C5.87521 42.1249 8.25021 44.2499 11.3752 45.6249C14.1252 46.8749 17.1252 47.6249 20.1252 47.9999C25.0002 48.6249 29.8752 48.3749 34.6252 47.1249C36.1252 46.7499 37.6252 46.1249 39.0002 45.4999C42.5002 43.9999 44.7502 41.3749 46.2502 37.8749C47.6252 34.6249 48.2502 31.3749 48.5002 27.8749C48.8752 23.8749 48.6252 19.8749 47.6252 15.9999C47.1252 13.7499 46.3752 11.4999 45.1252 9.49995C44.8752 8.99995 44.8752 8.49995 45.2502 8.24995C45.6252 7.99995 46.0002 8.12495 46.3752 8.74995C47.8752 11.3749 48.7502 14.2499 49.2502 17.1249C49.5002 18.8749 49.6252 20.4999 49.8752 22.2499C49.8752 22.3749 49.8752 22.4999 50.0002 22.6249C50.0002 23.8749 50.0002 25.2499 50.0002 26.4999C50.0002 26.7499 49.8752 27.1249 49.8752 27.3749C49.6252 31.2499 48.8752 34.9999 47.3752 38.4999C45.7502 42.1249 43.2502 44.8749 39.6252 46.6249C36.5002 48.1249 33.2502 48.8749 29.8752 49.2499C28.8752 49.3749 27.8752 49.4999 26.8752 49.4999C25.6252 49.9999 24.3752 49.9999 23.0002 49.9999Z"
        fill="white"
      />
      <path
        d="M18.25 24.9999C18.25 28.2499 18.25 31.3749 18.25 34.6249C18.25 35.1249 18.375 35.4999 18.75 35.7499C19.25 35.9999 19.625 35.8749 20 35.6249C25 32.3749 29.875 29.2499 34.875 25.9999C35.875 25.3749 35.875 24.6249 34.875 23.9999C33.25 22.8749 31.5 21.8749 29.875 20.7499C29.75 20.6249 29.625 20.6249 29.5 20.4999C29.125 20.2499 29 19.8749 29.25 19.4999C29.5 19.1249 29.875 19.1249 30.25 19.2499C30.875 19.6249 31.5 19.9999 32 20.3749C33.25 21.1249 34.375 21.8749 35.625 22.7499C37.5 23.8749 37.5 25.9999 35.625 27.2499C30.625 30.4999 25.625 33.6249 20.75 36.8749C19.625 37.6249 18.375 37.6249 17.5 36.7499C16.875 36.2499 16.75 35.4999 16.75 34.7499C16.75 29.8749 16.75 24.9999 16.75 20.2499C16.75 18.6249 16.75 16.9999 16.75 15.4999C16.75 14.4999 17.125 13.6249 18.125 13.1249C19 12.6249 19.875 12.7499 20.75 13.2499C22.875 14.6249 25 15.9999 27.125 17.3749L27.25 17.4999C27.625 17.7499 27.75 18.2499 27.5 18.4999C27.25 18.8749 26.875 18.8749 26.5 18.6249C25.125 17.7499 23.75 16.8749 22.375 15.9999C21.625 15.4999 20.75 14.9999 20 14.4999C19.625 14.2499 19.25 14.1249 18.75 14.3749C18.375 14.6249 18.25 14.9999 18.25 15.4999C18.25 18.4999 18.25 21.7499 18.25 24.9999Z"
        fill="white"
      />
    </svg>
  );
}

function CloudDownloadIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-6 h-6"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
      />
    </svg>
  );
}

function CloudUploadIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-6 h-6"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
      />
    </svg>
  );
}

function ErrorIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-6 h-6"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      />
    </svg>
  );
}

function CheckIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-6 h-6"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function PlusCircleIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-6 h-6"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
