'use client'
import InButtonLoader from '../../buttons/InButtonLoader';
// @ts-ignore
import {  useFormStatus } from 'react-dom';
import { UserCommonData } from '@/types/User';

const AccountButton = ({ user }: { user: UserCommonData }) => {


	return (
		<div className=''>



		</div>
	)
}

export default AccountButton


const LogoutButton = () => {
	const { pending } = useFormStatus();

	return (
		<InButtonLoader isLoading={pending} size="xl">
			<button className="text-base">Logout</button>
		</InButtonLoader>
	);
};
