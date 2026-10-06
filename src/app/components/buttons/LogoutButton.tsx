'use client';

import Image from 'next/image'
import React from 'react'

// @ts-ignore
import { useFormState, useFormStatus } from 'react-dom'
import { DefaultActionResult, defaultActionResult } from '../types/Form'
import logout from '../layout/logged-in/LogoutAction'
import InButtonLoader from './InButtonLoader';

const LogoutButton = () => {
	const [{ error }, action] = useFormState<DefaultActionResult, FormData>(logout, defaultActionResult);

	return (
		<form className={''} action={action}>
			<button type='submit' className={'w-[100%] text-start'} >
				{/*className='flex w-full rounded-md px-1.5 items-center gap-2 mb-4 md:mb-0 py-2 bg-primary text-white font-semibold'*/}
				{/*<Image src='/logout.svg' height={35} width={35} alt='loutout' className='p-1.5'/>*/}
				{/* <SubmitButton /> */}
				Logout
			</button>
		</form>
	)
}

export default LogoutButton

const SubmitButton = () => {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			className="py-4 w-full text-start text-white size-xs font-semibold"
			disabled={pending}
		>
			<InButtonLoader isLoading={pending}>Logout</InButtonLoader>
		</button>
	);
};
