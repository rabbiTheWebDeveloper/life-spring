import Image from 'next/image'
import React from 'react'

interface Props {
		title: string;
		logo: string;
		placeholder:string;
		name: string;
		type: string;
}

const InputField = ({title, logo, placeholder, name, type}: Props) => {
	return (
		<div className='flex w-[336px] h-[48px]  bg-input rounded-[14px]'>
			<div className='flex items-center'>
			<Image className='w-[22px] h-[22px] ml-3 mr-1' src={logo} width={22} height={22} alt={title} />
			<input name={name}  type={type} required className='text-[#1C1C1C] pl-1 text-xs bg-input h-[44px] w-[310px] rounded-[14px] outline-none' placeholder={placeholder} />
			</div>
		</div>
	)
}

export default InputField
