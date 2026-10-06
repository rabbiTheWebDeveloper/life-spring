"use client"

import React, { useState } from 'react'
import { CreateDoctorActionFn } from '../types/Types';
import DoctorForm from './DoctorForm';
import ContentWrapper from "@/app/components/layout/wrappers/ContentWrapper";

interface DoctorCreateProps {
	specialties: any;
	organizationList:any;
}

const DoctorCreate = ({ specialties, organizationList }: DoctorCreateProps) => {
	const [preview, setPreview] = useState<string | null>(null);
	return (
		<ContentWrapper>
			<div className="flex justify-between items-center">
				<div className="w-full">
					<DoctorForm  specialties={specialties?.data} setPreview={setPreview} preview={preview} organizationList={organizationList}/>
				</div>
			</div>
		</ContentWrapper>
	)
}

export default DoctorCreate;
