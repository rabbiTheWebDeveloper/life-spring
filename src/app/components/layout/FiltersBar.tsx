import Image from 'next/image'
import React from 'react'

const FiltersBar = () => {
	return (
		<div className='w-[630px] h-[54px] border rounded-lg bg-[#F9F9FB]'>
			<div className="flex justify-between items-center h-full">
				<div className='py-4  px-6 border-r'>
					<Image src='/filter.svg' height={22} width={20} alt='filter' />
				</div>
				<div className='py-4  px-6 border-r flex justify-between items-center'>
					<h2 className='font-bold text-sm text-[#202224]'>Filter By</h2>
				</div>
				<div className='py-4  px-6 border-r flex justify-between items-center gap-5'>
					<h2 className='font-bold text-sm text-[#202224]'>Location</h2>

					<Image src='/down-arrow.svg' height={24} width={24} alt='filter' />
				</div>
				<div className='py-4  px-6 border-r flex justify-between items-center gap-5'>
				<h2 className='font-bold text-sm text-[#202224]'>Status</h2>

					<Image src='/down-arrow.svg' height={24} width={24} alt='filter' />
				</div>

				<div className='py-4  px-6 border-r flex justify-between items-center gap-5'>
					<Image src='/refresh.svg' height={15} width={15} alt='filter' />
					<h2 className='font-bold text-sm text-[#EA0234]'>Reset Filter</h2>
				</div>
			</div>
		</div>
	)
}

export default FiltersBar
