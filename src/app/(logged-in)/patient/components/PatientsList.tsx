"use client";

import React from "react";
import PatientInfoCard from "./PatientInfoCard";
import { Paginator } from "@/app/components/layout/Paginator";


interface Props {
	patients: any;
	url: string;
}

const PatientsList = ({ patients, url }: Props) => {
	const patientData = patients?.data;

	return (
		<div className="flex flex-col gap-4">
			<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
				{patientData.map((patient:any, index:any) => (
					<div key={index}>
						<PatientInfoCard patient={patient} />
					</div>
				))}
			</div>
			<div className="flex md:justify-end bottom-5  text-right">
				<Paginator url={url} pagination={patients?.pagination} />
			</div>
		</div>
	);
};

export default PatientsList;
