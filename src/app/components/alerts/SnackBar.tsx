"use client";

import { convertDurationToMillisecond } from "@/helper/DateHelper";
import { useToast } from "@/services/toast/Client";
import React, { useEffect, useState } from "react";

const SnackBar = () => {
	const toast = useToast();

	const [isVisible, setIsVisible] = useState(true);

	const handleClose = () => {
		setIsVisible(false);
	};

	useEffect(() => {
		if (!toast || !toast.autoHide || !toast.duration) return;

		const intervalId = setInterval(() => {
			setIsVisible(false);
		}, convertDurationToMillisecond(toast.duration));

		return () => clearInterval(intervalId);
	}, [toast]);

	if (!toast) return null;

	return (
		<>
			{isVisible && (
				<div
					id="toast-success"
					className="fixed top-24 right-4 flex min-w-[343px] min-h-[48px] max-w-sm px-4 py-3.5 mb-4 rounded font-semibold bg-primary-400 text-white shadow-login-btn "
					role="alert"
				>
					<div className="ml-3 text-center font-semibold text-primary-10">{toast.text}</div>
					{toast.hidable && (
						<button
							type="button"
							className="ml-auto -mx-1.5 -my-1.5  rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-slate-100 inline-flex items-center justify-center h-8 w-8"
							data-dismiss-target="#toast-success"
							aria-label="Close"
							onClick={handleClose}
						>
							<span className="sr-only">X</span>
							<svg
								className="w-3 h-3 text-white "
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 14 14"
							>
								<path
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
								/>
							</svg>
						</button>
					)}
				</div>
			)}
		</>
	);
};

export default SnackBar;
