import React from 'react'
import DoctorInfoCard from './DoctorInfoCard'
import NoDataFound from '@/app/components/layout/NoDataFound'
import { Paginator } from '@/app/components/layout/Paginator'
import { Doctor, Doctors, Paginator as Pagination } from '../types/Type'
import { useSearchParams } from 'next/navigation'
interface Props {
	doctors: Doctors
	url: string
}

const DoctorsList = ({ doctors, url }: Props) => {
	const doctorData = doctors?.doctors;

	return (
		<div className='grid grid-cols-12'>
			<div className="col-span-12">
				<div className="grid grid-cols-1 md:grid-cols-5 gap-4 ">
					{doctorData?.map((doctor, index:number) => (
						<div key={doctor?.id}>
							<DoctorInfoCard text='Details' doctor={doctor} link={`/doctor/${doctor.id}`}/>
						</div>
					))}
				</div>
				<div className='flex  md:justify-end bottom-5  text-right'>
					<Paginator url={url} pagination={doctors.pagination}/>
				</div>
			</div>
		</div>
	)
}

export default DoctorsList
