'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import AddButton from '@/app/components/buttons/AddButton';
import DateRangePicker from '@/app/components/layout/DateRangePicker';
import PatientTable from './PatientTable';
import DoctorTable from './DoctorTable';
import AppointmentDashTable from './AppointmentDashTable';
import { Appointments } from '../../appointment/types/Types';
import Tabs from './Tabs';
import { Patients } from '../../patient/types/Types';
import { Doctors } from '../../doctor/types/Type';
import NoDataFound from '@/app/components/layout/NoDataFound';
import RolePermissionChecker from "@/app/components/rolepermission/HandleRolePermission";

interface Props {
  appointments: any;
  patients: any;
  doctors: any
}

const DashboardTabs = ({ appointments, patients, doctors }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlParams = Object.fromEntries(searchParams);
  const from = urlParams.from || '';
  const to = urlParams.to || '';

  const [url, setUrl] = useState(`/dashboard?size=5${from ? `&from=${from}` : ''}${to ? `&to=${to}` : ''}`);
  const [startDate, setStartDate] = useState<Date | null>(from ? new Date(from) : null);
  const [endDate, setEndDate] = useState<Date | null>(to ? new Date(to) : null);

  const [patientTab, setPatientTab] = useState<boolean>(false);
  const [doctorTab, setDoctorTab] = useState<boolean>(true);
  const [appointmentTab, setAppointmentTab] = useState<boolean>(false);



  const resetDateRange = () => {
    setStartDate(null);
    setEndDate(null);
    const newUrl = `/dashboard?size=5`;
    setUrl(newUrl);
    router.push(newUrl, { scroll: false });
  };

  const handleDoctors = () => {
    setDoctorTab(true);
    setAppointmentTab(false);
    setPatientTab(false);
    resetDateRange();
  };

  const handlePatients = () => {
    setDoctorTab(false);
    setAppointmentTab(false);
    setPatientTab(true);
    resetDateRange();
  };

  const handleAppointments = () => {
    setDoctorTab(false);
    setAppointmentTab(true);
    setPatientTab(false);
    resetDateRange();
  };
  return (
    <div className="flex flex-col gap-4 w-full p-4">
      <div className="flex-row md:flex  md:justify-between border-b border-gray-200">
        <div className='flex justify-between md:gap-10'>
					<RolePermissionChecker tag="doctor" name="list">
						<Tabs active={doctorTab} text='Doctor List' handleFn={handleDoctors} />
					</RolePermissionChecker>
					<RolePermissionChecker tag="patient" name="list">
						<Tabs active={patientTab} text='Patient List' handleFn={handlePatients} />
					</RolePermissionChecker>
					<RolePermissionChecker tag="appointment" name="list">
						<Tabs active={appointmentTab} text='Appointment List' handleFn={handleAppointments} />
					</RolePermissionChecker>

        </div>

      </div>
      <div className="overflow-scroll max-h-[300px]">
        <div>
          {patientTab && (patients && patients?.data?.data?.length > 0 ? <PatientTable patients={patients?.data} url={url} /> : <NoDataFound />)}
          {doctorTab && (doctors && doctors?.data?.doctors?.length > 0 ? <DoctorTable doctors={doctors?.data} url={url} /> : <NoDataFound />)}
          {appointmentTab && (appointments && appointments?.data?.appointments?.length > 0 ? <AppointmentDashTable appointments={appointments?.data}  url={url} /> : <NoDataFound />)}
        </div>
      </div>
    </div>
  )
}

export default DashboardTabs
