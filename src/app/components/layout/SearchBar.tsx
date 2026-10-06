import Image from 'next/image'
import React from 'react'

const SearchBar = () => {
	return (
		<div className='w-[530px] h-[52px] pl-5 gap-5 flex items-center bg-[#F5F6FA] border border-[#D4D4D4] rounded-full'>
			<Image src='/search.svg' width={20} height={20} alt='search' />
			<input type="text" placeholder='Search' className='bg-[#F5F6FA] rounded-full pl-2 w-full h-[48px]'/>
		</div>
	)
}

export default SearchBar
