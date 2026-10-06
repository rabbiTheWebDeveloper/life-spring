import React, { useState } from "react";
import createDisbursement from "../[id]/actions/DisburseAction";
import useCreateDisbursement from "../hooks/useCreateDisbursement";

interface Props {
    setShowModal: (value: boolean) => void;
    invoiceId: number;
    paymentMethod: string;
    refNo: string
		amount: number;
}

const DisburseModal = ({ setShowModal, invoiceId, amount }: Props) => {
  	const { form } = useCreateDisbursement(createDisbursement);
		const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [referenceNumber, setReferenceNumber] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
			setShowModal(false);
    }

		const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0] || null;
			setSelectedFile(file);
		};

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                    &#8203;
                </span>
                <div
                    className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-headline"
                >
                    <form onSubmit={handleSubmit} action={form.action}>
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                    <h3 className="text-2xl leading-6 font-semibold text-gr" id="modal-headline">
                                        Disbursement Details
                                    </h3>
                                    <div className="mt-4 text-gr flex flex-col gap-3">
																		<div className="flex gap-2 items-center font-medium">
                                            <p>
                                                Amount :
                                            </p>
                                            <p>{amount}</p>
                                        </div>
                                        <div className="flex gap-2 justify-between items-center text-sm">
                                            <p>
                                                Payment Method
                                            </p>
                                            <select
                                                className="border p-2 bg-white rounded-md w-[300px]"
                                                id="paymentMethod"
                                                name="paymentMethod"
                                                value={selectedPaymentMethod}
                                                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                                required
                                            >
                                                <option value="">Select a method</option>
                                                <option value="bank">Bank</option>
                                                <option value="mfs">MFS</option>
                                                <option value="cash">Cash</option>
                                                {/* <option value="bank">Bank</option> */}
                                            </select>
                                        </div>
                                        <div className="flex gap-2 justify-between items-center text-sm">
                                            <p>
                                                Reference No.
                                            </p>
                                            <input
                                                className="border p-2 rounded-md w-[330px]"
                                                id="refNo"
                                                name="refNo"
                                                type="text"
                                                placeholder="Reference No."
                                                value={referenceNumber}
                                                onChange={(e) => setReferenceNumber(e.target.value)}
                                                required
                                            />
                                        </div>
																				<div className="flex gap-2 justify-between items-center text-sm">
                                            <p>
                                                Attachment
                                            </p>
                                            <input
                                                className="border p-2 rounded-md"
                                                id="attachment"
                                                name="attachment"
                                                type="file"
                                                placeholder="attachment"
																								onChange={handleFileChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
												<input name="invoiceId" value={invoiceId} type="hidden"  required />
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="submit"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-400 text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Confirm
                            </button>
                            <button
                                type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DisburseModal;
