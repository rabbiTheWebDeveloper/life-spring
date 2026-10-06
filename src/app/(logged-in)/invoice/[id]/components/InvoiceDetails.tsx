'use client'
import InvoiceInfo from './InvoiceInfo'
import { Invoice } from '../types/Types'
import InvoiceApptTable from './InvoiceApptTable'
import RolePermissionChecker from "@/app/components/rolepermission/HandleRolePermission";

interface Props{
	invoice: Invoice
}

const InvoiceDetails = ({invoice}:Props) => {
	return (
		<RolePermissionChecker tag="administration-invoice" name="view">
			<div className='flex flex-col gap-5 rounded-2xl shadow-login-btn p-5'>
				<InvoiceInfo invoice={invoice}/>

				<div className='grid grid-cols-12 p-5 border rounded-xl'>
					<div className="col-span-12">
						<InvoiceApptTable appts={invoice?.invoice?.appointmentDetails}/>
					</div>
				</div>
			</div>
		</RolePermissionChecker>

	)
}

export default InvoiceDetails
