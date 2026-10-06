'use client'

import React, { useEffect, useState } from 'react'
import NoDataFound from '@/app/components/layout/NoDataFound'
import { Paginator } from '@/app/components/layout/Paginator'
import InvoiceTable from './InvoiceTable';
import { Invoices } from '../types/Types';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props{
	invoices: Invoices
}

const Invoice = ({invoices}:Props) => {

	const searchParams = useSearchParams();
  const urlParams = Object.fromEntries(searchParams);
  const isDisbursed = urlParams.isDisbursed || 'false';

	const url = `/invoice?size=10&isDisbursed=${isDisbursed}`;

	return (
		<div className='flex flex-col mt-2'>

			<div className='flex flex-col gap-4'>
				{invoices && invoices?.invoices?.length > 0 ? <InvoiceTable invoices={invoices} isDisbursed={isDisbursed} /> : <NoDataFound />}
				<div className='flex mr-5 justify-end bottom-5 text-right'>
					<Paginator url={url} pagination={invoices?.pagination} />
				</div>
			</div>
		</div>
	)
}

export default Invoice
