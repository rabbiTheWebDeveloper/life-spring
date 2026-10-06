"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	const { push } = useRouter();
	const handleClicked = () => {
		push("/");
	};

	return (
		<div>
			<main className="grid min-h-full place-items-center bg-primary-default px-4 sm:px-6 py-16 sm:py-24 lg:px-8">
				<div className="text-center shadow-login-btn px-8 sm:px-10 md:px-20 py-12 sm:py-16 md:py-28 rounded-lg">
					<h1 className="mt-4 text-2xl sm:text-3xl md:text-5xl font-bold text-gr tracking-tight text-primary-500">
						Something went wrong
					</h1>
					<p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl leading-6 text-gray-600">
						Please try again later.
					</p>
					<div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
						<button
							className="relative overflow-visible rounded-full border-gr border hover:-translate-y-1 px-8 py-4 sm:px-10 sm:py-5 md:px-12 md:py-5 shadow-login-btn bg-primary text-white font-semibold after:content-[''] after:absolute after:rounded-full after:inset-0 after:bg-primary-200 after:z-[-1] after:transition after:!duration-500 hover:after:scale-150 hover:after:opacity-0"
							onClick={handleClicked}
						>
							Go back home
						</button>
						<a
							href="tel:+8809638505505"
							className="font-semibold bg-white hover:-translate-y-1 rounded-full border py-4 sm:py-5 px-8 sm:px-10 md:px-12 text-primary"
						>
							Hotline: +88 09638505505
						</a>
					</div>
				</div>
			</main>
		</div>
	);
}
