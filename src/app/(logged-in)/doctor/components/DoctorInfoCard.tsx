"use client"

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Doctor } from '../types/Type'
import { convertToAMPM } from '@/helper/DateHelper'
import { loaderProp } from '@/helper/ImageHelper'
import clsx from 'clsx'
import ImageWithLoader from '@/app/components/image/ImageWithLoader'
import {CiCircleCheck} from "react-icons/ci";
import RolePermissionChecker from "@/app/components/rolepermission/HandleRolePermission";

interface Props {
	doctor: Doctor;
	text: string;
	link: string;
}

const DoctorInfoCard = ({ doctor, text, link }: Props) => {
	const disabledClass = doctor.isActive ? '' : 'opacity-50';
	// `workingDays` is precomputed by the API. Fall back to deriving it from the
	// full collection for callers that still request includeSchedules=true.
	// @ts-ignore
	const workDays: any = doctor?.workingDays ?? [...new Set(doctor?.schedules?.map(item => item.dayOfWeek) ?? [])];
	return (
		<div className={`w-[370px] md:w-[275px] h-[380px] py-7 px-4 rounded-xl shadow border flex flex-col gap-6`}>
			<div className="flex justify-between">
				<div className={`flex gap-3.5 items-center  ${disabledClass}`}>
					<div className='overflow-hidden rounded-full min-w-fit' style={{ width: '63px', height: '63px' }}>
						<ImageWithLoader src={doctor.profilePic} width={63} height={63} alt={'doctor'} altImage={'/user.png'} cls='rounded-full object-cover h-[63px] w-[63px]' />
					</div>
					<div className="flex flex-col items-start gap-1">
						<h2 className='font-bold text-sm'>{doctor.name}</h2>
						<h2 className='font-normal text-sm min-w-fit'>{doctor.specialty?.name.en}</h2>
					</div>
				</div>
				{doctor.isActive && <CiCircleCheck className="bg-green-500 text-white rounded-full" size={22}/>}
			</div>

			<div className={`flex justify-between items-center  ${disabledClass}`}>
				<div className='flex flex-col gap-2.5 items-center w-[82px] h-[92px]'>
					<Image src='/badge1.svg' width={40} height={40} alt='doctor' />
					<div className='flex flex-col items-center gap-[1px]'>
						<h2 className="font-bold text-sm">{doctor.patientChecked ?? 0}</h2>
						<h2 className="font-medium text-[10px]">Patients</h2>
					</div>
				</div>
				<div className='flex flex-col gap-2.5 items-center w-[82px] h-[92px]'>
					<Image src='/badge2.svg' width={40} height={40} alt='doctor' />
					<div className='flex flex-col items-center gap-[1px]'>
						<h2 className="font-bold text-sm">{doctor.experience} Y</h2>
						<h2 className="font-medium text-[10px]">Experience</h2>
					</div>
				</div>
				<div className='flex flex-col gap-2.5 items-center w-[82px] h-[92px]'>
					<Image src='/badge3.svg' width={40} height={40} alt='doctor' />
					<div className='flex flex-col items-center gap-[1px]'>
						<h2 className="font-bold text-sm">{(doctor.rating?.rating ?? 0).toFixed(1)}</h2>
						<h2 className="font-medium text-[10px]">Ratings</h2>
					</div>
				</div>
			</div>

			<hr />
			<div className={`flex flex-col gap-1 text-[10px] leading-3 ${disabledClass}`}>
				{
					workDays?.length > 0 && <div className="">
						<div className="flex flex-wrap min-w-[85px] gap-2.5 justify-between items-center">
							<h2 className="text-sm">Available Days</h2>
						</div>
						<h2 className="text-primary-500 font-bold">{workDays?.join(', ')}</h2>
					</div>
				}

			</div>
			<RolePermissionChecker tag="doctor" name="view">
				<Link href={link} className='  py-1.5 px-[100px] bg-primary-400 flex  justify-center items-center rounded-md'>
					<h2 className='text-sm text-white'>{text}</h2>
				</Link>
			</RolePermissionChecker>


		</div>
	)
}

export default DoctorInfoCard;
