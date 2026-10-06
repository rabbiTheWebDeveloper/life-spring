'use client'
import Link from 'next/link'
import React from 'react'

const ProfileCard = ({ user }: any) => {
	return (
		<div className="p-8 bg-white shadow-md rounded-md ">
			<div className="grid grid-cols-1 md:grid-cols-3">
				<div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0">
					<div>
						<p className="font-bold text-gray-700 text-xl">{user?.officeId}</p>
						<p className="text-gray-400">Office Id</p>
					</div>
					<div>
						<p className="font-bold text-gray-700 text-xl">{user?.mobile}</p>
						<p className="text-gray-400">Mobile</p>
					</div>

				</div>
				<div className="relative">
					<div
						className="w-48 h-48 bg-primary-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center ">
						<img src={user?.profilePic || '/user.svg'} alt='user' className="w-48 h-48 rounded-full"/>
					</div>
				</div>

				<div className="flex items-center justify-end">
					<Link href='profile/update' className='text-white py-2 px-4  rounded-md bg-primary-400 shadow'>Update</Link>

				</div>
			</div>

			<div className="mt-20 text-center border-b pb-12">
				<h1 className="text-4xl font-medium text-gray-700">{user?.firstName} {user?.lastName}, <span
					className="font-light text-gray-500 capitalize">{user?.role}</span></h1>
				<p className="font-light text-gray-600 mt-3">Main Branch House # 55/2, Union Heights, Level # 6 West Panthapath,
					Dhaka-1205, Bangladesh</p>

				<p className="mt-8 text-gray-500">{user?.designation} - LifeSpring</p>
				<p className="mt-2 text-gray-500">{user?.email}</p>

			</div>

			<div className="mt-12 flex flex-col justify-center">
				<p className="text-gray-600 text-center font-light lg:px-16">LifeSpring strives to serve health care services locally and globally. Its goal is to be easily accessible to everyone who needs health support, be it mental or physical. Moreover, it really wants to educate people about mental health, cure mental disorders, and achieve victory over mental illness.</p>

			</div>

		</div>
	)
}

export default ProfileCard
