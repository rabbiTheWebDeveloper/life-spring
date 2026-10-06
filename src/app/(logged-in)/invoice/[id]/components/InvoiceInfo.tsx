'use client'

import React, { useState } from 'react'
import DisburseModal from '../../components/DisburseModal';
import { Invoice } from '../types/Types';
import FormattedDateTime from '@/app/components/layout/FormattedDateTime';
import { buildDoctorId } from '@/app/(logged-in)/doctor/types/Type';
import Link from 'next/link';
import { PaymentOptions } from '../types/Models';
import ImageWithLoader from '@/app/components/image/ImageWithLoader';
import AttachmentWithLoader from '@/app/components/image/AttachmentWithLoader';
import { getFileType } from '@/helper/StringHelper';
import FormattedTime from '@/app/components/layout/FormattedTime';
import FormattedDate from '@/app/components/layout/FormattedDate';
import RolePermissionChecker from "@/app/components/rolepermission/HandleRolePermission";

interface Props{
	invoice: Invoice
}

const InvoiceInfo = ({invoice} : Props) => {
	const [showModal, setShowModal] = useState<boolean>(false);
	const [invoiceId, setInvoiceId] = useState<number | null>(null);
	const [refNo, setRefNo] = useState<string>('');
	const [paymentMethod, setPaymentMethod] = useState<string>('');


	const handleDisbursement = (id: number) => {
		setInvoiceId(id);
		setRefNo(refNo);
		setPaymentMethod(paymentMethod);
		setShowModal(true);
	};
	const inv = invoice?.invoice;
	return (
		<div className='flex flex-col gap-5'>
			<div className="flex justify-between items-center">
				<div className='font-semibold text-xl text-gr'>
					INV - {invoice?.invoice?.id}
				</div>

				<div className="flex gap-3 justify-between items-center px-10">
					<RolePermissionChecker tag="administration-invoice" name="update">
						{!invoice?.invoice?.disbursedAt && <button onClick={() => handleDisbursement(inv.id)}
																											 className='py-2 px-3 bg-primary-400 min-w-[80px] rounded-md text-white font-semibold'>Disburse</button>}
					</RolePermissionChecker>
					<RolePermissionChecker tag="administration-invoice" name="export">
						{
							invoice?.link &&
							<Link
								href={invoice?.link}
								className='py-2 px-3 bg-primary-400 min-w-[80px] rounded-md text-white text-center font-semibold'
								target="_blank"
								rel="noopener noreferrer"
							>
								Print
							</Link>}
					</RolePermissionChecker>


				</div>

			</div>
			<div className="flex justify-between items-start text-sm">
				<div className='flex flex-col gap-5'>
					<div className="flex items-center gap-10">
						<div className='flex flex-col gap-3 text-gr'>
							<div className="flex items-center gap-3">
								<p>Requested At : </p>
								<div>
									<FormattedTime isoString={inv?.requestedAt}/>, <FormattedDate isoString={inv?.requestedAt}/>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<p>Disbursed At : </p>
								{
									!inv?.disbursedAt ?
										'-' :
										<div><FormattedTime isoString={inv?.disbursedAt} />, <FormattedDate isoString={inv?.disbursedAt} /></div>
								}
							</div>
							<div className="flex items-center gap-3"><p>Amount : </p>  <p>{inv?.amount}</p></div>
							<div className="flex items-center gap-3"><p>Reference No. : </p>  <p>{inv?.refNo || '-'}</p></div>
							<div className="flex items-center gap-3"><p>Disburse Method : </p>  <p>{inv?.paymentMethod || '-'}</p></div>
						</div>
					</div>
					<div className="flex justify-evenly gap-10 border items-center rounded-xl p-5 text-gr max-w-[600px]">
						<div className='flex flex-col gap-3'>
							<div className="flex gap-2 items-center"><p>Doctor ID:</p> <p>{buildDoctorId(inv?.doctor?.id)}</p></div>
							<div className="flex gap-2 items-center"><p>Doctor Name:</p> <p>{inv?.doctor?.name}</p></div>
							<div className="flex gap-2 items-center"><p>Account Type:</p> <p>{inv?.doctor?.bankDetails?.accountType}</p></div>
							{PaymentOptions?.isMFS(inv?.doctor?.bankDetails?.accountType) &&	<div className="flex gap-2 items-center"><p>MFS Name:</p> <p>{inv?.doctor?.bankDetails?.mfsType}</p></div>}
							<div className="flex gap-2 items-center"><p>Account No.:</p> <p>{inv?.doctor?.bankDetails?.accountNo}</p></div>
							{PaymentOptions.isBank(inv?.doctor?.bankDetails?.accountType) &&	<div className="flex gap-2 items-center"><p>Account Name:</p> <p>{inv?.doctor?.bankDetails?.accountName}</p></div>}
							{PaymentOptions.isBank(inv?.doctor?.bankDetails?.accountType) &&	<div className="flex gap-2 items-center"><p>Bank Name:</p> <p>{inv?.doctor?.bankDetails?.bankName}</p></div>}
							{PaymentOptions.isBank(inv?.doctor?.bankDetails?.accountType) &&	<div className="flex gap-2 items-center"><p>Branch Name:</p> <p>{inv?.doctor?.bankDetails?.branchName}</p></div>}
						</div>
						<div className='h-full border-l text-primary border-2'></div>
						<div className="flex flex-col gap-3">
							<div className="flex">Total Payable: {inv?.amount} Tk</div>
							<div className="flex">Total Appointments: {inv?.appointmentDetails?.length}</div>
						</div>
					</div>
				</div>
				{invoice?.invoice?.disbursedAt &&
					<div className="flex flex-col gap-2 justify-between border-2 p-2 rounded-lg items-center text-gr ">
							<AttachmentWithLoader
									src={inv?.attachment}
									width={300}
									height={300}
									alt={'attachment'}
									altImage={'/pdf.svg'}
									cls='h-[300px] w-[300px]'
									fileType={getFileType(inv?.attachment)}
							/>
							<h2 className='font-semibold'>Attachment</h2>
					</div>
				}
			</div>


			{showModal && invoiceId !== null && <DisburseModal setShowModal={setShowModal} invoiceId={invoiceId} amount={inv?.amount} refNo={refNo} paymentMethod={paymentMethod} />}
		</div>
	)
}

export default InvoiceInfo
