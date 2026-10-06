"use client";

import { UpdateProfile } from "@/app/(logged-in)/profile/update/ProfileUpdateAction";
import { message } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const ProfileUpdateForm = ({ user, setPreview }: any) => {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		nickName: "",
		email: "",
	});
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [preview, setLocalPreview] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	// Set initial form data and preview when user changes
	useEffect(() => {
		if (user) {
			setFormData({
				firstName: user.firstName || "",
				lastName: user.lastName || "",
				email: user.email || "",
				nickName: user.nickName || "",
			});
			setLocalPreview(user.profilePic || null);
		}
	}, [user]);

	// Handle input change for text fields
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// Handle file change for profile picture
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		setSelectedFile(file);
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				const imagePreview = reader.result as string;
				setLocalPreview(imagePreview);
			};
			reader.readAsDataURL(file);
		} else {
			setLocalPreview(null);
		}
	};

	// Handle form submission using FormData and API call
	const handleSubmit = async () => {
		setIsLoading(true);
		try {
			const formDataToSend = new FormData();
			formDataToSend.append("firstName", formData.firstName);
			formDataToSend.append("lastName", formData.lastName);
			formDataToSend.append("email", formData.email);
			formDataToSend.append("nickName", formData.nickName);
			if (selectedFile) {
				formDataToSend.append("profilePic", selectedFile as Blob);
			}

			// Call API
			const res: any = await UpdateProfile(user?.id, formDataToSend);

			if (res?.statusCode === 200) {
				message.success("Profile update successfully!");
				router.push("/profile");
			} else {
				message.error(res?.message);
			}
		} catch (error) {
			console.error("Error updating profile:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="bg-white px-10 py-8 w-full rounded-lg shadow-md">
			<h2 className="text-xl font-bold mb-6">Update Profile</h2>
			<div className="space-y-4">
				{/* First Name */}
				<div className="flex flex-col gap-1">
					<label className="text-sm font-medium text-gray-700">First Name</label>
					<input
						type="text"
						name="firstName"
						value={formData.firstName}
						onChange={handleInputChange}
						className="border-2 rounded-md p-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
					/>
				</div>
				{/* Last Name */}
				<div className="flex flex-col gap-1">
					<label className="text-sm font-medium text-gray-700">Last Name</label>
					<input
						type="text"
						name="lastName"
						value={formData.lastName}
						onChange={handleInputChange}
						className="border-2 rounded-md p-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<label className="text-sm font-medium text-gray-700">Nick Name</label>
					<input
						type="text"
						name="nickName"
						value={formData.nickName}
						onChange={handleInputChange}
						className="border-2 rounded-md p-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
					/>
				</div>
				{/* Email */}
				<div className="flex flex-col gap-1">
					<label className="text-sm font-medium text-gray-700">Email</label>
					<input
						type="email"
						name="email"
						value={formData.email}
						onChange={handleInputChange}
						className="border-2 rounded-md p-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
					/>
				</div>
				{/* Profile Picture */}
				<div className="flex flex-col gap-1">
					<label className="text-sm font-medium text-gray-700">Profile Picture</label>
					<div className="flex items-center gap-4">
						{preview && (
							<img src={preview} alt="Profile Preview" className="w-16 h-16 rounded-full object-cover border" />
						)}
						<input
							className="border-2 rounded-md p-2 text-gray-700 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-primary"
							type="file"
							accept="image/*"
							onChange={handleFileChange}
						/>
					</div>
				</div>
				{/* Update Button */}
				<button onClick={handleSubmit} disabled={isLoading} className="px-4 py-2 bg-primary-400 rounded-md text-white">
					{isLoading ? "Updating..." : "Update"}
				</button>
			</div>
		</div>
	);
};

export default ProfileUpdateForm;
