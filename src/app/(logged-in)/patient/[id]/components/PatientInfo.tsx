import React from 'react'
import { Patient, buildPatientId } from '../../types/Types'
import { formateDate } from '@/helper/DateHelper'
import { cmToFeetInch, getBMI } from '@/helper/StringHelper'

const PatientInfo = ({ patient }: { patient: Patient }) => {
	return (
		<div className='flex p-4 flex-col md:gap-9 '>
			<h2 className='font-bold text-sm md:text-xl leading-6'>
				Patient Information
			</h2>

			<div className="flex justify-between items-center gap-4 font-medium text-sm md:text-xl">
				<div className='flex flex-col gap-3 text-[#A51C89]'>
					<h2>ID</h2>
					<h2>Weight</h2>
					<h2>Height</h2>
					<h2>BMI</h2>
					<h2>DOB</h2>
				</div>
				<div className='flex flex-col gap-3'>
					<h2>:</h2>
					<h2>:</h2>
					<h2>:</h2>
					<h2>:</h2>
					<h2>:</h2>
				</div>
				<div className='flex flex-col gap-3'>
					<h2>{buildPatientId(patient)}</h2>
					<h2>{patient.weight ?? "-"} kg</h2>
					<h2>{cmToFeetInch(patient.height) ?? "-"}</h2>
					<h2>{getBMI(patient.height, patient.weight) ?? "-"}</h2>
					<h2>{formateDate(patient.dob) ?? "-"}</h2>
				</div>
			</div>
		</div>
	)
}

export default PatientInfo
