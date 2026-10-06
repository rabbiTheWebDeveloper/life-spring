import React from 'react'
import { Patient } from '../../types/Types'
import ImageWithLoader from '@/app/components/image/ImageWithLoader'

const MemberCard = ({ patient }: { patient: Patient }) => {
	return (
		<div className='md:w-[290px] h-[150px] rounded-lg'>
			<div className="flex flex-col gap-2 md:gap-6 items-center">
				<ImageWithLoader src={patient.profilePic} width={72} height={72} alt={'patient'} altImage={'/user.png'} />

				<div className='flex flex-col items-center'>
					<h2 className='font-bold text-2xl text-[#9B468A]'>
						{patient.name}
					</h2>
				</div>
			</div>
		</div>
	)
}

export default MemberCard;
