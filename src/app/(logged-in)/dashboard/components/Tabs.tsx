import clsx from 'clsx';
import React from 'react';

interface Props {
  active: boolean;
  text: string;
  handleFn: () => void;
}

const Tabs = ({ active, text, handleFn }: Props) => {

  return (
    <button
      className={clsx(
        'py-3.5 font-medium leading-7',
        {
          'border-b-2 border-primary-400 font-bold text-primary-500': active,
          'text-gray-500': !active,
        }
      )}
      onClick={handleFn}
    >
      {text}
    </button>
  );
};

export default Tabs;
