import TitleBar from '@/app/components/text/TitleBar'
import React from 'react'
import InvoiceDetails from './components/InvoiceDetails'
import { get } from '@/api/ApiClient'
interface Props {
	params: { [key: string]: number };
}

const page = async ({ params }: Props) => {
	const id = params?.id;
	const invoice:any = await get<any>(`v1/transaction/invoices/${id}`)

	return (
		<div className='h-screen pl-5 flex flex-col gap-8 pt-4 pb-9'>
			<div className='flex justify-between items-center'>
				<TitleBar title='Invoice Details' />
			</div>
				<InvoiceDetails invoice={invoice?.data} />
		</div>
	)
}

export default page
