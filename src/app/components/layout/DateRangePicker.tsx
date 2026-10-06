'use client'

import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateRangePickerProps {
  onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void;
  startDate: Date | null;
  endDate: Date | null;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onDateRangeChange, startDate, endDate }) => {
  const handleStartDateChange = (date: Date | null) => {
    onDateRangeChange(date, endDate);
  };

  const handleEndDateChange = (date: Date | null) => {
    onDateRangeChange(startDate, date);
  };

  const resetStartDate = () => {
    onDateRangeChange(null, endDate);
  };

  const resetEndDate = () => {
    onDateRangeChange(startDate, null);
  };

  const CrossIcon = ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
      aria-label="Reset date"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </button>
  );

  return (
    <div className="flex-row md:flex gap-4 rounded-lg">
      <div className="flex flex-col relative">
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Start Date"
          dateFormat="yyyy-MM-dd"
          className="p-2 pr-8  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {startDate && <CrossIcon onClick={resetStartDate} />}
      </div>
      <div className="flex mt-2 md:mt-0 flex-col relative">
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          placeholderText="End Date"
          dateFormat="yyyy-MM-dd"
          className="p-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {endDate && <CrossIcon onClick={resetEndDate} />}
      </div>
    </div>
  );
};

export default DateRangePicker;
