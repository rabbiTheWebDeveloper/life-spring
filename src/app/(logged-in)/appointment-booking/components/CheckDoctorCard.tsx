
'use client'
import React from 'react'
import { Modal, Button, Divider } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { CiCircleCheck } from "react-icons/ci"
import { BsAward } from "react-icons/bs"
import Image from 'next/image'
import ImageWithLoader from '@/app/components/image/ImageWithLoader'

const CheckDoctorCard = ({ doctor, setSelectedDoctorId, selectedDoctorId }:any) => {
	const [isModalOpen, setIsModalOpen] = React.useState(false)

	const handleCardClick = () => {
		setSelectedDoctorId(doctor?.id)
	}


	const handleCancel = () => {
		setIsModalOpen(false)
	}

	return (
		<>
			<div
				className={`w-full max-w-xs h-[150px] rounded bg-white overflow-hidden shadow hover:shadow transition-all duration-300 ${
					selectedDoctorId === doctor?.id ? 'ring-1 ring-primary-500' : ''
				} cursor-pointer p-4`}

				onClick={handleCardClick}
			>
				{/* Top section: Doctor image and info */}
				<div className="flex items-center gap-4">
					<div className="relative">
						<div className="w-14 h-14 rounded-full overflow-hidden border shadow-sm">
							<ImageWithLoader
								src={doctor.profilePic}
								width={56}
								height={56}
								alt={doctor.name}
								altImage="/user.png"
								cls="object-cover w-full h-full"
							/>
						</div>
						{doctor.isActive && (
							<div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-0.5 border-2 border-white">
								<CiCircleCheck className="text-white" size={12}/>
							</div>
						)}
					</div>
					<div className="flex-1 overflow-hidden">
						<h2 className="text-sm font-semibold text-gray-800 truncate">{doctor.name}</h2>
						<p className="text-xs text-primary-600 truncate">{doctor.specialty?.name.en}</p>
						<p className="text-xs text-gray-500 mt-0.5">
							<BsAward className="inline-block mr-1" size={12}/>
							{doctor.experience} yrs experience
						</p>
					</div>
				</div>

				{/* Bottom section: Fee and View Details */}
				<div className="flex items-center justify-between mt-2">
					<p className="text-[11px] text-gray-500">Consultation Fee</p>
					<p className="text-base font-bold text-gray-800">৳ {doctor.fee}</p>

				</div>
				<div className="flex flex-col mt-2">
					<button
						className="text-primary-400 text-sm font-semibold  transition-opacity duration-200"
						onClick={(e) => {
							e.stopPropagation();
							setIsModalOpen(true);
						}}
					>
						View Details
					</button>
				</div>

			</div>

			<Modal
				title={
					<div className="flex items-center gap-3">
						<div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary-100">
							<ImageWithLoader
								src={doctor.profilePic}
								width={48}
								height={48}
								alt={doctor.name}
								altImage="/user.png"
								cls="object-cover w-full h-full"
							/>
						</div>
						<div>
							<div className="flex items-center gap-1">
								<span className="text-lg font-bold">{doctor.name}</span>
								{doctor.isActive && <CiCircleCheck className="bg-green-500 text-white rounded-full" size={16}/>}
							</div>
							<span className="text-sm text-primary-500">{doctor.specialty?.name.en}</span>
						</div>
					</div>
				}
				open={isModalOpen}
				onCancel={handleCancel}
				footer={null}
				width={700}
				bodyStyle={{paddingTop: '20px'}}
			>
				{/* Doctor Badges */}
				<div className="grid grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
					<div className="flex flex-col items-center">
						<div className="bg-blue-50 p-2 rounded-full mb-2">
							<Image src="/badge1.svg" width={30} height={30} alt="Patients"/>
						</div>
						<p className="text-sm font-bold">{doctor.patientChecked ?? 0}</p>
						<p className="text-xs text-gray-500">Patients</p>
					</div>

					<div className="flex flex-col items-center">
						<div className="bg-green-50 p-2 rounded-full mb-2">
							<Image src="/badge2.svg" width={30} height={30} alt="Experience" />
						</div>
						<p className="text-sm font-bold">{doctor.experience} Y</p>
						<p className="text-xs text-gray-500">Experience</p>
					</div>

					<div className="flex flex-col items-center">
						<div className="bg-amber-50 p-2 rounded-full mb-2">
							<Image src="/badge3.svg" width={30} height={30} alt="Rating" />
						</div>
						<p className="text-sm font-bold">{(doctor.rating?.rating ?? 0).toFixed(1)}</p>
						<p className="text-xs text-gray-500">Rating</p>
					</div>
				</div>

				{/* Scrollable Doctor Details with fixed height */}
				<div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar">
					{/* Qualification Section */}
					<div className="mb-5">
						<h4 className="text-base font-semibold mb-2 flex items-center">
              <span className="bg-primary-100 text-primary-600 p-1 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.7 2.7 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                </svg>
              </span>
							Qualifications
						</h4>
						<p className="text-gray-700 ml-8">{doctor.degrees}</p>
					</div>

					{/* Biography Section */}
					<div className="mb-5">
						<h4 className="text-base font-semibold mb-2 flex items-center">
              <span className="bg-blue-100 text-blue-600 p-1 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
							About
						</h4>
						<p className="text-gray-700 ml-8">{doctor.biography}</p>
					</div>

					{/* Professional Details Section */}
					<div>
						<h4 className="text-base font-semibold mb-2 flex items-center">
              <span className="bg-green-100 text-green-600 p-1 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </span>
							Professional Details
						</h4>
						<div className="grid grid-cols-2 gap-x-8 gap-y-2 ml-8">
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
								<span className="text-gray-800">
                  {new Date(doctor.bmdcExpiryDate).toLocaleDateString()}
                </span>
							</div>
						</div>
					</div>
				</div>

				{/* Adding some styling for custom scrollbar */}
				<style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #ccc;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #aaa;
          }
        `}</style>
			</Modal>
		</>
	)
}

export default CheckDoctorCard
