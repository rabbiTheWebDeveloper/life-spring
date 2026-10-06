'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';



const YearFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  useEffect(() => {
    const yearParam = searchParams.get('year');
    if (yearParam) {
      setSelectedYear(parseInt(yearParam, 10));
    } else {
      setSelectedYear(currentYear);
    }
  }, [searchParams, currentYear]);

  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(event.target.value, 10);
    setSelectedYear(year);

    const params = new URLSearchParams(searchParams.toString());
    params.set('year', year.toString());
		router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center space-x-3">
      <select
        id="year-select"
        value={selectedYear}
        onChange={handleYearChange}
        className="border border-gray-300 text-gr w-[100px] rounded-md bg-white shadow-sm py-2 px-3 focus:outline-none"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default YearFilter;
