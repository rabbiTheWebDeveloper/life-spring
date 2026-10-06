'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Doctors, Doctor, buildDoctorId } from '../../doctor/types/Type';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  doctors: Doctors;
  resetDateRange: (doctorId: string) => void;
}

const DoctorFilter = ({ doctors, resetDateRange }: any) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>(doctors?.result);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = searchParams.get('id');
    const name = searchParams.get('name');
    if (id) {
      const doctor = doctors?.doctors?.find((d:any):any => d.id === Number(id));
      if (doctor) {
        setSelectedDoctor(doctor);
        setInputValue(`${buildDoctorId(doctor?.id)}, ${doctor?.name}`);
      }
    } else if (name) {
      setInputValue(name);
    }
  }, [searchParams, doctors?.doctors]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    setSelectedDoctor(null);
    filterDoctors(value);
    setIsOpen(true);
    updateURL('', value);
    resetDateRange('');
  };

  const filterDoctors = (value: string) => {
    const filtered = doctors?.doctors?.filter((doctor:any):any =>
      `${buildDoctorId(doctor?.id)}, ${doctor?.name}`.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredDoctors(filtered);
  };

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setInputValue(`${buildDoctorId(doctor?.id)}, ${doctor?.name}`);
    setIsOpen(false);
    updateURL(String(doctor?.id), '');
    resetDateRange(String(doctor?.id));
  };

  const handleReset = () => {
    setSelectedDoctor(null);
    setInputValue('');
    setFilteredDoctors(doctors?.doctors);
    updateURL('', '');
    resetDateRange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const updateURL = (doctorId: string, name: string) => {
    let url = '/settlement?page=0';
    if (doctorId) {
      url += `&id=${doctorId}`;
    } else if (name) {
      url += `&name=${encodeURIComponent(name)}`;
    }
    router.push(url, { scroll: false });
  };

  return (
    <div className="relative  md:w-[300px] min-w-fit">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        placeholder="Select a doctor"
        className="w-full p-2 pr-8 border-2 bg-white rounded-md text-primary focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {inputValue && (
        <button
          onClick={handleReset}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Reset filter"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
      {isOpen && filteredDoctors?.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredDoctors?.map((doctor) => (
            <li
              key={doctor.id}
              onClick={() => handleDoctorSelect(doctor)}
              className="p-2 hover:bg-gray-100 text-gr border rounded-md cursor-pointer flex flex-col gap-1 text-sm"
            >
							<p>ID: {buildDoctorId(doctor?.id)}</p>
							<p>Name: {doctor?.name}</p>
            </li>
          ))}
        </ul>
      )}

		{isOpen && filteredDoctors?.length == 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">

            <li
              className="p-2 hover:bg-gray-100 text-primary border rounded-md cursor-pointer flex flex-col gap-1 text-sm"
            >
							<p>No Doctor Found</p>
            </li>
        </ul>
      )}
    </div>
  );
};

export default DoctorFilter;
