"use client";

import { Patient } from '@/app/(logged-in)/patient/types/Types';
import React from 'react';


interface DataItem {
  name: string;
  age: number;
  city: string;
}

interface Props{
	data: any[]
}

const ExcelExportButton = ({data} : Props) => {



  return (
    <button  className="bg-primary rounded-md text-white font-semibold py-2 px-4 ">
      Export
    </button>
  );
};

export default ExcelExportButton;
