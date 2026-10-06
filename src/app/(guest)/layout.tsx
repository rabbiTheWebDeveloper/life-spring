import React from 'react'
import GuestLayout from '@/app/components/layout/GuestLayout';
import { ChildrenProp } from '@/types/ReacetHelpers';


const layout = ({ children }: ChildrenProp) => {
	// @ts-ignore
	return <GuestLayout>{children}</GuestLayout>;
}

export default layout
