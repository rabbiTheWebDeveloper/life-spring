import InputField from '@/app/components/layout/InputField'
import React from 'react'
const Form = ({ action }: any) => {
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		action(formData)
	}

	return (
		<div>
			<form action={action}>
					<div className='flex flex-col gap-2'>
						<InputField title='Email' type='text' name='email' logo='/email.svg' placeholder='Email' />
						<InputField title='Password' type='password' name='password' logo='/password.svg' placeholder='Password' />
					</div>
					<div className='py-[22px] text-center'>
						<button type='submit' className='w-[114px] h-[48px] rounded-[15px]  bg-gradient-to-r from-[#9B468A] to-[#33C2DF] shadow-login-btn font-bold text-xs leading-4 text-white transition duration-300 ease-out'>Login Now</button>
					</div>
				</form>
		</div>
	)
}

export default Form
