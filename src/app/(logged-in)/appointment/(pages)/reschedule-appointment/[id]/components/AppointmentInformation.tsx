import React from 'react';
import {patientAge} from "@/helper/DateHelper";
import {Appts, Payments} from "@/app/(logged-in)/appointment/types/Models";
import DoctorDetailField from "@/app/(logged-in)/doctor/[id]/components/DoctorDetailField";
import FormattedTime from "@/app/components/layout/FormattedTime";
import FormattedDate from "@/app/components/layout/FormattedDate";
import clsx from "clsx";

const AppointmentInformation = ({appointment}:any) => {
	const patientFields = [
		{ title: "Name", value: appointment?.patientDetails?.fullName },
		{ title: "Mobile", value: appointment?.patientDetails?.mobile || appointment?.patient?.mobile },
		{ title: "Age", value: patientAge(appointment?.patientDetails, appointment?.patient) },
		{ title: "Gender", value: appointment?.patientDetails?.gender },
		{
			title: "Weight",
			value: `${appointment?.patientDetails?.weight ? appointment?.patientDetails?.weight + "KG" : "N/A"}`,
		},
		// { title: "Problems", value: appointment?.patientDetails?.problems },
	];
	return (
		<div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="p-6 bg-gray-100 rounded-lg border border-gray-200">
					<div className="flex items-center justify-between">
						<h4 className="text-lg font-semibold text-blue-600 mb-2">Current Appointment Information</h4>
					</div>
					<DoctorDetailField title="Appointment ID" value={appointment?.id}/>
					<div className="flex items-center justify-between border-b border-slate-300">
						<h2 className="font-semibold">Created At: </h2>
						<h2 className='text-sm font-medium'>
							<>
								<FormattedTime isoString={appointment?.createdAt}/>,{" "}
								<FormattedDate isoString={appointment?.createdAt}/>
							</>
						</h2>
					</div>
					<div className="flex items-center justify-between border-b border-slate-300">
						<h2 className="font-semibold text-sm">Previous Scheduled Start: </h2>
						<h2 className='text-sm font-medium'>
							<>
								<FormattedTime isoString={appointment?.scheduleStart}/>,{" "}
								<FormattedDate isoString={appointment?.scheduleStart}/>
							</>
						</h2>
					</div>
					<div className="flex items-center justify-between border-b border-slate-300">
						<h2 className="font-semibold text-sm">Previous Scheduled End: </h2>
						<h2 className='text-sm font-medium'>
							<>
								<FormattedTime isoString={appointment?.scheduleEnd}/>,{" "}
								<FormattedDate isoString={appointment?.scheduleEnd}/>
							</>
						</h2>
					</div>
					<DoctorDetailField title="Created By" value={appointment?.createdByType}/>
					{appointment?.statusChangelog?.length > 0 && (
						<DoctorDetailField
							title="Last Updated By"
							value={appointment.statusChangelog[0].changerName || appointment.statusChangelog[0].changerType}
						/>
					)}

					<div className="flex items-center justify-between mt-1">
						<h2 className='font-semibold'>Appointment Status</h2>
						<button
							className={clsx("rounded-md py-.5 px-3.5", {
								"bg-[#DBEAFE] border-[#93C5FD] text-[#1E40AF]": Appts.isScheduled(appointment),
								"bg-[#DBFEE3] border-[#B5FD93] text-[#12B76A]": Appts.isCompleted(appointment),
								"bg-[#FEDBDB] border-[#FD9393] text-[#B71212]": Appts.isCancelled(appointment),
								"bg-[#bcb9e2] border-[#be9292] text-white": Appts.isPending(appointment),
							})}
						>
							{appointment.status}
						</button>
					</div>
					<div className="flex items-center justify-between mt-1">
						<h2 className='font-semibold'>Payment Status</h2>
						<button
							className={clsx("rounded-md py-.5 px-3.5", {
								"bg-teal-500 border-[#B5FD93] text-white": Payments?.isPaid(appointment),
								"bg-amber-500 border-amber-300 text-white": Payments?.isPartiallyPaid(appointment),
								"bg-cyan-500 border-[#93C5FD] text-white": Payments?.isUnpaid(appointment),
							})}
						>
							{Payments?.getStatusValue(appointment)}
						</button>
					</div>
				</div>
				<div className="p-6 bg-gray-100 rounded-lg border border-gray-200">
					<h4 className="text-lg font-semibold text-blue-600 mb-2">Patient Information</h4>
					{patientFields.map((field, index) => (
						<DoctorDetailField key={index} title={field.title} value={field.value}/>
					))}
				</div>
			</div>
		</div>
	);
};

export default AppointmentInformation;
