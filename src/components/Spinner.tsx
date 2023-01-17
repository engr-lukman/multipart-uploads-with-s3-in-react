import { CgSpinner } from 'react-icons/cg';

interface Props {
  className?: string;
}

const Spinner = ({ className = '', ...props }: Props) => {
  return <CgSpinner className={`animate-spin ${className}`} {...props} />;
};

export default Spinner;
