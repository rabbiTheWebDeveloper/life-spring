"use client";

import { CiCircleCheck } from "react-icons/ci";

const SingleDoctorOverview = ({ doctor }: any) => {
	return (
		<div>
			<div className="border rounded-md overflow-hidden">
				{/* Card Header */}
				<div className="p-4 ">
					<div className="flex items-center gap-3">
						<div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary-100">
							<img src={doctor.profilePic} alt={doctor.name} className="object-cover w-full h-full" />
						</div>
						<div>
							<div className="flex items-center gap-1">
								<span className="text-lg font-bold">{doctor.name}</span>
								{doctor.isActive && <CiCircleCheck className="bg-green-500 text-white rounded-full" size={16} />}
							</div>
							<span className="text-sm text-primary-500">{doctor.specialty?.name.en}</span>
						</div>
					</div>
				</div>

				{/* Doctor Badges */}
				{/* <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg mx-4 mt-4">
					<div className="flex flex-col items-center">
						<div className="bg-blue-50 p-2 rounded-full mb-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 text-blue-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
								/>
							</svg>
						</div>
						<p className="text-sm font-bold">{doctor.patientChecked ?? 0}</p>
						<p className="text-xs text-gray-500">Patients</p>
					</div>

					<div className="flex flex-col items-center ">
						<div className="bg-green-50 p-2 rounded-full mb-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 text-green-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<p className="text-sm font-bold">{doctor.experience} Y</p>
						<p className="text-xs text-gray-500">Experience</p>
					</div>

					<div className="flex flex-col items-center">
						<div className="bg-amber-50 p-2 rounded-full mb-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 text-amber-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
								/>
							</svg>
						</div>
						<p className="text-sm font-bold">{(doctor.rating?.rating ?? 0).toFixed(1)}</p>
						<p className="text-xs text-gray-500">Rating</p>
					</div>
				</div> */}

				{/* Doctor Details Section */}
				<div className="p-4">
					{/* Qualification Section */}
					{/* <div className="mb-4">
						<h4 className="text-base font-semibold mb-2 flex items-center">
							<span className="bg-primary-100 text-primary-600 p-1 rounded-full mr-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.7 2.7 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"
									/>
								</svg>
							</span>
							Qualifications
						</h4>
						<p className="text-gray-700 ml-8">{doctor.degrees}</p>
					</div> */}

					{/* Biography Section */}
					{/* <div className="mb-4">
						<h4 className="text-base font-semibold mb-2 flex items-center">
							<span className="bg-blue-100 text-blue-600 p-1 rounded-full mr-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									/>
								</svg>
							</span>
							About
						</h4>
						<p className="text-gray-700 ml-8">{doctor.biography}</p>
					</div> */}

					{/* Professional Details Section */}
					{/* <div>
						<h4 className="text-sm font-semibold mb-2 flex items-center">
							<span className="bg-green-100 text-green-600 p-1 rounded-full mr-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
									/>
								</svg>
							</span>
							Professional Details
						</h4>
						<div className="grid grid-cols-2 gap-x-8 gap-y-2 ml-8 text-xs">
							<div className="flex items-center">
								<span className="font-medium text-gray-600 w-32">Working At:</span>
								<span className="text-gray-800">{doctor.working_at}</span>
							</div>
							<div className="flex items-center">
								<span className="font-medium text-gray-600 w-32">Experience:</span>
								<span className="text-gray-800">{doctor.experience} Years</span>
							</div>
							<div className="flex items-center">
								<span className="font-medium text-gray-600 w-32">BMDC Code:</span>
								<span className="text-gray-800">{doctor.bmdcCode}</span>
							</div>
							<div className="flex items-center">
								<span className="font-medium text-gray-600 w-32">Fee:</span>
								<span className="text-gray-800">৳ {doctor.fee}</span>
							</div>
							<div className="flex items-center">
								<span className="font-medium text-gray-600 w-32">Duration:</span>
								<span className="text-gray-800">{doctor.timePeriod} minutes</span>
							</div>
							<div className="flex items-center">
								<span className="font-medium text-gray-600 w-32">BMDC Expires:</span>
								<span className="text-gray-800">{new Date(doctor.bmdcExpiryDate).toLocaleDateString()}</span>
							</div>
						</div>
					</div> */}
				</div>
			</div>
		</div>
	);
};

export default SingleDoctorOverview;
