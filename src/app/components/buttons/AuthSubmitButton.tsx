import LoadingButton from '@/app/components/buttons/LoadingButton';
import React from 'react'

interface Props{
	title: string;
	isLoading: boolean;
}

const AuthSubmitButton = ({isLoading, title}: Props) => {
	return (
		<div className='py-[22px] text-center'>
			<LoadingButton isLoading={isLoading} cls='w-[114px] h-[35px] rounded-md  bg-gradient-to-r from-primary-800 to-primary-400 shadow-login-btn font-bold text-xs leading-4 text-white transition duration-300 ease-out'>
				{title}
			</LoadingButton>
		</div>
	)
}

export default AuthSubmitButton
