"use client"
import DoctorUpdateForm from './DoctorUpdateForm'
import { Doctor } from '../../../types/Type';

import { Tabs } from 'antd';

const { TabPane } = Tabs;
interface DoctorUpdateProps {
    doctor: Doctor;
    specialties: any;
	organizationList:any
}

const DoctorUpdate = ({ doctor, specialties,organizationList }: DoctorUpdateProps) => {
    return (
        <div >
					<DoctorUpdateForm doctor={doctor} specialties={specialties?.data} organizationList={organizationList}/>
        </div>
    )
}

export default DoctorUpdate
