'use client'
import Image from 'next/image'
import React, {useState} from 'react'
import useResetPassword from '../useResetPassword';
import { ResetActionFn } from '../types/Types';
// @ts-ignore
import { useFormStatus } from 'react-dom';
import ErrorAlert from '@/app/components/alerts/ErrorAlert';
import AuthSubmitButton from '@/app/components/buttons/AuthSubmitButton';
import { FiEye, FiEyeOff } from "react-icons/fi";
import Link from "next/link";
interface Props {
	actionFn: ResetActionFn;
}

const ResetPassword = ({ actionFn }: Props) => {
	const { form }:any = useResetPassword(actionFn);
	const { error } = form.result;
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	return (
		<div className="bg-white grid grid-cols-12">
			{/* Left Section */}
			<div className="md:col-span-6 bg-primary-50">
				<div className="h-screen flex justify-center items-center">
					<div>
						<Image
							className="text-center rounded-none mb-8"
							src="/lifeSpringLogo.png"
							width={180}
							height={100}
							alt="lifeSpring-logo"
						/>
						<h1 className="font-medium text-primary-700 leading-10">
							<span className="text-4xl font-bold">Empowering Care</span>
							<br/>
							<span className="text-3xl">Anytime, Anywhere.</span>
						</h1>
						<p className="text-sm text-zinc-500 mt-2">
							Welcome to Admin Portal, your trusted partner in healthcare.
						</p>
					</div>
				</div>
			</div>

			{/* Right Section */}
			<div className="md:col-span-6">
				<div className="h-screen flex justify-center items-center">
					<div className="bg-white p-8 w-full max-w-md">
						<h1 className="text-3xl font-bold text-center mb-6 text-primary-700">
							Reset Password
						</h1>
						<form action={form.action}>
							{error && <ErrorAlert error={error}/>}
							<div className="flex flex-col gap-4">
								{/* New Password Input */}
								<div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <img
											src="/password.svg"
											alt="password icon"
											className="w-5 h-5"
										/>
                  </span>
									<input
										type={showPassword ? "text" : "password"}
										name="password"
										placeholder="New Password"
										className="w-full pl-10 pr-10 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-50 transition-all"
									/>
									<div
										className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
										onClick={() => setShowPassword((prev) => !prev)}
									>
										{showPassword ? <FiEyeOff size={20}/> : <FiEye size={20}/>}
									</div>
								</div>

								{/* Confirm Password Input */}
								<div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <img
											src="/password.svg"
											alt="password icon"
											className="w-5 h-5"
										/>
                  </span>
									<input
										type={showConfirmPassword ? "text" : "password"}
										name="confirm"
										placeholder="Confirm Password"
										className="w-full pl-10 pr-10 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-50 transition-all"
									/>
									<div
										className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
										onClick={() => setShowConfirmPassword((prev) => !prev)}
									>
										{showConfirmPassword ? (
											<FiEyeOff size={20}/>
										) : (
											<FiEye size={20}/>
										)}
									</div>
								</div>
							</div>

							<SetButton/>
							<div className="flex gap-1 text-sm items-center justify-center">
								<h2 className="">Remembered your password?</h2>
								<Link
									className="text-primary-700 font-medium underline"
									href="/login"
								>
									Login Here
								</Link>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ResetPassword


function SetButton() {
	const {pending} = useFormStatus();
	return <AuthSubmitButton isLoading={pending} title="Reset"/>;
}
