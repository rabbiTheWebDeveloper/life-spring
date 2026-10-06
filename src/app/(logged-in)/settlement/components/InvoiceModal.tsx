import React from 'react'
import useCreateInvoice from '../hooks/useCreateInvoice';
import createInvoice from '../actions/CreateInvoiceAction';
import { useSearchParams } from 'next/navigation';
import SubmitButton from '@/app/components/buttons/SubmitButton';

interface Props {
	totalAppointments: number;
	totalPaymentAmount: number;
	setShowModal: (value: boolean) => void;
	selectedIds: number[];
}

const InvoiceModal = ({ totalAppointments, totalPaymentAmount, setShowModal, selectedIds}: Props) => {
  const { form } = useCreateInvoice(createInvoice);
    const searchParams = useSearchParams();
    const urlParams = Object.fromEntries(searchParams);
    const doctorId = urlParams.id;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
			setShowModal(false);
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      formData.set('appointmentIds', JSON.stringify(selectedIds));
      form.action(formData);
    }
	return (
		<div className="fixed z-10 inset-0 overflow-y-auto">
					<div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
						<div className="fixed inset-0 transition-opacity" aria-hidden="true">
							<div className="absolute inset-0 bg-gray-500 opacity-75"></div>
						</div>
						<span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
						<div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
							<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
								<div className="sm:flex sm:items-start">
									<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
										<h3 className="text-lg leading-6 font-semibold text-gray-900" id="modal-headline">
											Invoice Summary
										</h3>
										<div className="mt-2 text-gr">
											<p>
												Total Appointments: {totalAppointments}
											</p>
											<p>
												Total Payment Amount: {totalPaymentAmount}
											</p>
										</div>
									</div>
								</div>
							</div>
							<div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
								<form onSubmit={handleSubmit}>
									<input name='doctorId' value={doctorId}  type='hidden' required />
									<SubmitButton text='Create' cls='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-400 text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm' />
									{/* <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm">
										Create
									</button> */}
								</form>
								<button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => setShowModal(false)}>
									Cancel
								</button>
							</div>
						</div>
					</div>
				</div>
	)
}

export default InvoiceModal
