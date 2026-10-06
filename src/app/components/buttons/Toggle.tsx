import React, { useState } from 'react';

interface ToggleProps {
  label: string;
  name: string;
  defaultChecked?: boolean;
  onChange: (checked: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ label, name, defaultChecked = false, onChange }) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleToggle = (newValue: boolean) => {
    if (newValue !== isChecked) {
      setIsChecked(newValue);
      onChange(newValue);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <label htmlFor={name} className="text-gr ">{label} :</label>
      <div
        className="flex w-32 h-7 rounded-md overflow-hidden cursor-pointer"
      >
        <div
          onClick={() => handleToggle(true)}
          className={`flex-1 flex items-center justify-center text-sm transition-colors duration-300 ${
            isChecked
              ? 'bg-primary text-white shadow-login-btn'
              : 'bg-gray-100 text-teal-300 rounded-l-md border border-white hover:bg-slate-300 hover:text-white'
          }`}>
          YES
        </div>
        <div
          onClick={() => handleToggle(false)}
          className={`flex-1 flex items-center justify-center text-sm transition-colors duration-300 ${
            !isChecked
              ? 'bg-primary text-white shadow-login-btn'
              : 'bg-gray-100 text-teal-300 rounded-r-md border border-white hover:bg-slate-300 hover:text-white'
          }`}>
          NO
        </div>
      </div>
    </div>
  );
};

export default Toggle;
