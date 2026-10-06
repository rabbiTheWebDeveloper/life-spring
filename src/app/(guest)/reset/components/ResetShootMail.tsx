"use client";
import Image from "next/image";
import React from "react";
import useReset from "../useReset";
import { ShootActionFn } from "../types/Types";
// @ts-ignore
import { useFormStatus } from "react-dom";
import AuthSubmitButton from "../../../components/buttons/AuthSubmitButton";
import ErrorAlert from "@/app/components/alerts/ErrorAlert";
import SuccessAlert from "@/app/components/alerts/SuccessAlert";

interface Props {
	actionFn: ShootActionFn;
}

const ResetShoot = ({ actionFn }: Props) => {
	const { form } = useReset(actionFn);
	const { error, success } = form.result;

	return (
		<div className="bg-white grid grid-cols-12">
			{/* Left Section */}
			<div className="md:col-span-6 relative overflow-hidden bg-gradient-to-br from-primary-800 to-primary-400">
				{/* Decorative circles */}
				<div className="absolute top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
				<div className="absolute bottom-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

				<div className="h-screen flex justify-center items-center relative z-10 px-8">
					<div className="text-center md:text-left">
						<Image
							className="text-center rounded-none mb-8 mx-auto md:mx-0"
							src="/lifeSpringLogoWhite.webp"
							width={160}
							height={88}
							alt="lifeSpring-logo"
						/>
						<h1 className="font-medium text-white leading-tight mb-4">
							<span className="text-3xl md:text-4xl font-bold block mb-2">Empowering Care</span>
							<span className="text-2xl md:text-3xl block">Anytime, Anywhere.</span>
						</h1>
						<p className="text-sm md:text-base text-white/90 mt-4 max-w-md">
							Welcome to Admin Portal, your trusted partner in healthcare management.
						</p>
					</div>
				</div>
			</div>

			{/* Right Section */}
			<div className="md:col-span-6">
				<div className="h-screen flex justify-center items-center">
					<div className="bg-white p-8 w-full max-w-md">
						<h1 className="text-3xl font-bold text-center mb-6 text-primary-700">Reset Password</h1>
						{success ? (
							<SuccessAlert
								success={`A verification email has been sent to ${success}. Please follow the instructions to reset your password.`}
							/>
						) : (
							<form action={form.action}>
								{error && <ErrorAlert error={error} />}
								<div className="flex flex-col gap-4">
									{/* Email Input */}
									<div className="relative">
										<span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
											<img src="/email.svg" alt="email icon" className="w-5 h-5" />
										</span>
										<input
											type="text"
											name="email"
											placeholder="Email"
											className="w-full pl-10 pr-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-50 transition-all"
										/>
									</div>
								</div>
								<ShootButton />
							</form>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ResetShoot;

function ShootButton() {
	const { pending } = useFormStatus();
	return <AuthSubmitButton isLoading={pending} title="Verify" />;
}
