'use client'

import React, { useState } from 'react'
import SettlementTable from './SettlementTable'
import DoctorFilter from './DoctorFilter'
import { Doctors } from '../../doctor/types/Type'
import NoDataFound from '@/app/components/layout/NoDataFound'
import { Settlements } from '../types/Types'
import { useRouter, useSearchParams } from 'next/navigation'
import AllSettlementTable from './AllSettlementTable'
import DateRangePicker from '@/app/components/layout/DateRangePicker'
import SidebarPermission from "@/app/components/sidebar/SidebarPermisson";
import RolePermissionChecker from "@/app/components/rolepermission/HandleRolePermission";

interface Props {
    doctors: Doctors
    settlements: Settlements;
		allSettlements: Settlements;
}

const SettlementSection = ({ doctors, settlements, allSettlements}: Props) => {
  const router = useRouter();
	const searchParams = useSearchParams();
  const urlParams = Object.fromEntries(searchParams);
  const from = urlParams.from || '';
  const to = urlParams.to || '';
  const id = urlParams.id || '';
  const [url, setUrl] = useState(`/settlement?page=0 ${id && `&id=${id}`}  ${from ? `&from=${from}` : ''}${to ? `&to=${to}` : ''}`);
	const [startDate, setStartDate] = useState<Date | null>(from ? new Date(from) : null);
  const [endDate, setEndDate] = useState<Date | null>(to ? new Date(to) : null);


	const handleDateRangeChange = (start: Date | null, end: Date | null) => {
		setStartDate(start);
		setEndDate(end);
		let newUrl = `/settlement?page=0${id ? `&id=${id}` : ''}`;
		if (start && end) {
			const startStr = new Date(start.getTime() - start.getTimezoneOffset() * 60000)
				.toISOString()
				.split('T')[0];
			const endStr = new Date(end.getTime() - end.getTimezoneOffset() * 60000)
				.toISOString()
				.split('T')[0];
			newUrl += `&from=${startStr}&to=${endStr}`;
		}
		setUrl(newUrl);
		router.push(newUrl, { scroll: false });
	};

  const resetDateRange = (doctorId: string) => {
    setStartDate(null);
    setEndDate(null);
    const newUrl = `/settlement?page=0${doctorId ? `&id=${doctorId}` : ''}`;
    setUrl(newUrl);
    router.push(newUrl, { scroll: false });
  };


    return (
			<SidebarPermission tag="administration">
				<RolePermissionChecker tag="administration-settlements" name="list">
					<div className='bg-white grid grid-cols-12 '>
						<div className="col-span-12">
							<div className='flex flex-col '>
								<div className="flex flex-wrap gap-4 items-center">
									<DoctorFilter doctors={doctors} resetDateRange={resetDateRange}/>
									<DateRangePicker
										onDateRangeChange={handleDateRangeChange}
										startDate={startDate}
										endDate={endDate}
									/>
								</div>
								{(() => {
									if (!id) {
										return allSettlements && allSettlements?.appointments?.length > 0
											? <AllSettlementTable settlements={allSettlements}/>
											: <NoDataFound/>;
									} else {
										return settlements && settlements?.appointments?.length > 0
											? <SettlementTable settlements={settlements}/>
											: <NoDataFound/>;
									}
								})()}
							</div>
						</div>
					</div>
				</RolePermissionChecker>

			</SidebarPermission>

		)
}

export default SettlementSection
