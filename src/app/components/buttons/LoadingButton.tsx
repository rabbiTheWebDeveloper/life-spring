import { ChildrenProp } from '@/types/ReacetHelpers';
import React from 'react'
import InButtonLoader from './InButtonLoader';

interface Props {
	isLoading: boolean;
	cls?: string;
}

const LoadingButton = ({ isLoading, cls = 'bg-primary-400 text-white font-semibold px-3 py-2 text-center rounded-md w-[150px]', children }: Props & ChildrenProp) => {
	return (
		<button type='submit' className={cls}>
			<InButtonLoader isLoading={isLoading}>{children}</InButtonLoader>
		</button>
	)
}

export default LoadingButton
