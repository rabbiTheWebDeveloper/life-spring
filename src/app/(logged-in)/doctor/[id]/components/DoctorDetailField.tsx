import React from 'react';

interface Props {
	title: string;
	value?: string | number | boolean | any;
}

const DoctorDetailField = ({ title, value }: Props) => {
	return (
		<div
			className={`flex justify-between items-center gap-7 ${value ? 'border-b border-slate-300' : ''
				}`}
		>
			<h2 className='text-sm text-primary font-bold'>{title}</h2>
			<h2 className='text-sm font-semibold'>{value}</h2>
		</div>
	);
};

export default DoctorDetailField;
