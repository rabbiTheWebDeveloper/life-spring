import React from 'react'

interface Props {
	title: string;
}

const TitleBar = ({ title }: Props) => {
	return (
		<div className='font-nunito-sans whitespace-nowrap text-primary-400 font-semibold text-2xl  '>{title}</div>
	)
}

export default TitleBar
