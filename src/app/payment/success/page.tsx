"use client";
import { useRouter } from "next/navigation";
import { IoCheckmarkOutline } from "react-icons/io5";

export default function PaymentSuccess() {
    const router = useRouter();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="bg-white rounded-2xl shadow-md p-10 flex flex-col items-center max-w-md w-full">
                <div className="flex items-center justify-center rounded-full w-20 h-20 bg-green-500 mb-6">
                    <IoCheckmarkOutline className="text-white" size={50} />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Payment Successful!</h2>
                <p className="text-gray-500 text-center mb-8">
                    The appointment has been booked and payment received successfully.
                </p>
                <button
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition"
                    onClick={() => router.push("/appointment?size=10&page=0")}
                >
                    Go to Appointment List
                </button>
            </div>
        </div>
    );
}
