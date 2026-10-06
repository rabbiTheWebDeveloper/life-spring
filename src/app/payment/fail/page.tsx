"use client";
import { useRouter } from "next/navigation";
import { TbCancel } from "react-icons/tb";

export default function PaymentFail() {
    const router = useRouter();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="bg-white rounded-2xl shadow-md p-10 flex flex-col items-center max-w-md w-full">
                <div className="flex items-center justify-center rounded-full w-20 h-20 bg-red-500 mb-6">
                    <TbCancel className="text-white" size={50} />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Payment Failed</h2>
                <p className="text-gray-500 text-center mb-8">
                    The payment could not be processed. Please try again or use a different payment method.
                </p>
                <button
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition"
                    onClick={() => router.push("/appointment-booking")}
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}
