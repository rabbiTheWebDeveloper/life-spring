import React, { BaseSyntheticEvent, useState } from 'react';

interface CommissionInputProps {
	initialValue?: number;
}


const CommissionInput = ({ initialValue }: CommissionInputProps) => {
	const [commission, setCommission] = useState(initialValue ?? '');

	const handleChange = (e: BaseSyntheticEvent) => {
		if (e.nativeEvent instanceof InputEvent) {
			setCommission(e.target.value)
		}
	}


	return (
		<div className='flex flex-col gap-1 justify-start'>
			<label className='text-gr font-medium text-sm'>Commission *</label>
			<div className='relative'>
				<input
					className='border-2 rounded-md p-2 text-gray-700 w-full pr-10 no-wheel-scroll focus:outline-none'
					name='commission'
					type='number'
					value={commission}
					onChange={handleChange}
					placeholder='Enter commission percentage'
					required
					min='0'
					max='100'
				/>
				<span className='absolute right-3 top-2.5 text-gray-500'>%</span>
			</div>
			{commission !== '' && (Number(commission) < 0 || Number(commission) > 100) && (
				<p className='text-red-500 text-xs mt-1'>Value must be between 0 and 100.</p>
			)}
		</div>
	);
};

export default CommissionInput;
