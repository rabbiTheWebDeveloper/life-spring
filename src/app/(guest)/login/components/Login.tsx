"use client";
import Image from "next/image";
import React, { useState } from "react";
import useLogin from "../useLogin";
import { FiEye, FiEyeOff } from "react-icons/fi";
// @ts-ignore
import { useFormStatus } from "react-dom";
import AuthSubmitButton from "../../../components/buttons/AuthSubmitButton";
import ErrorAlert from "@/app/components/alerts/ErrorAlert";
import Link from "next/link";

interface Props {
	actionFn: any;
}

const Login = ({ actionFn }: Props) => {
	const { form } = useLogin(actionFn);
	const { error } = form?.result || { error: "Invalid Credentials" };
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="bg-gray-50 grid grid-cols-12 min-h-screen">
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
							<span className="text-3xl md:text-4xl font-bold block mb-2">Professional and qualified</span>
							<span className="text-2xl md:text-3xl block">experts you can trust.</span>
						</h1>
						<p className="text-sm md:text-base text-white/90 mt-4 max-w-md">
						Lifespring is a compassionate and holistic mental health center dedicated to providing personalized care for individuals seeking emotional well-being and inner peace.
						</p>
					</div>
				</div>
			</div>
			<div className="md:col-span-6 bg-gray-50">
				<div className="h-screen flex justify-center items-center px-4">
					<div className="p-8 md:p-10 w-full max-w-md rounded-xl">
						<h1 className="text-2xl md:text-3xl font-bold text-center mb-2 text-primary-700">Welcome Back</h1>
						<p className="text-center text-gray-500 mb-6 text-xs">Sign in to continue to your account</p>
						<form action={form.action} className="">
							{error && <ErrorAlert error={error} />}
							<div className="flex flex-col gap-4">
								{/* Email Input */}
								<div className="relative">
									<span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
										<img src="/email.svg" alt="email icon" className="w-4 h-4" />
									</span>
									<input
										type="text"
										name="email"
										placeholder="Email"
										className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
									/>
								</div>

								{/* Password Input */}
								<div className="relative">
									<span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
										<img src="/password.svg" alt="password icon" className="w-4 h-4" />
									</span>
									<input
										type={showPassword ? "text" : "password"}
										name="password"
										placeholder="Password"
										className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
									/>
									<div
										className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
										onClick={() => setShowPassword((prev) => !prev)}
									>
										{showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
									</div>
								</div>
							</div>

							<LoginButton />
							<div className="flex gap-1 text-xs items-center justify-center mt-5">
								<h2 className="text-gray-600">Forgot password?</h2>
								<Link
									className="text-primary-700 font-medium hover:text-primary-800 underline transition-colors"
									href="/reset"
								>
									Click Here
								</Link>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;

function LoginButton() {
	const { pending } = useFormStatus();
	return <AuthSubmitButton isLoading={pending} title="Login Now" />;
}
