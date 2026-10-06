import React from 'react'

interface Props{
	title: string;
	value: any;
}
const ApptDetailField = ({title, value}: Props) => {
	return (
		<div className="flex items-center gap-2">
			<h2 className='font-medium'>{title}: </h2>
			<h2 className="text-primary font-bold">{value || '-'}</h2>
		</div>
	)
}

export default ApptDetailField
