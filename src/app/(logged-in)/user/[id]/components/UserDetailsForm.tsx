"use client";
import InputField from "@/app/components/formInputs/InputField";
import ContentWrapper from "@/app/components/layout/wrappers/ContentWrapper";
import { Select } from "antd";
import { useState } from "react";

export default function UserDetailsForm({
	userDetails,
	onInputChange,
	onSelectChange,
	onFormSubmit,
	roleList,
	isReadOnly,
}: any) {
	const [errors, setErrors] = useState<any>({});
	const validateForm = () => {
		const newErrors: any = {};
		if (!userDetails.firstName.trim()) {
			newErrors.firstName = "First Name is required.";
		}
		if (!userDetails.lastName.trim()) {
			newErrors.lastName = "Last Name is required.";
		}
		if (!userDetails.lastName.trim()) {
			newErrors.lastName = "Last Name is required.";
		}
		if (!userDetails.email.trim()) {
			newErrors.email = "Email is required.";
		}
		if (!userDetails.mobile.trim()) {
			newErrors.mobile = "Phone Number is required.";
		}
		if (!userDetails.roleId) {
			newErrors.roleId = "Selection of role is required.";
		}
		if (!userDetails.designation.trim()) {
			newErrors.designation = "Designation is required.";
		}
		if (!userDetails.officeId.trim()) {
			newErrors.officeId = "Office Id is required.";
		}

		setErrors(newErrors);

		return Object.keys(newErrors).length === 0;
	};

	return (
		<ContentWrapper tag="user-role-permission-user">
			{/* <RolePermissionChecker tag="user-role-permission-user" name="view"> */}
			<h4 className="text-xl font-bold text-primary">User Details</h4>
			<form
				onSubmit={(e) => {
					e.preventDefault();

					if (validateForm()) {
						onFormSubmit();
					}
				}}
				className="flex flex-col gap-2"
			>
				<div className="flex gap-4">
					<InputField
						labelText="First Name"
						inputName="firstName"
						inputValue={userDetails?.firstName}
						inputPlaceholder="Enter first name"
						onInputChange={onInputChange}
						error={errors.firstName}
						isReadOnly={isReadOnly}
					/>
					<InputField
						labelText="Last Name"
						inputName="lastName"
						inputValue={userDetails?.lastName}
						inputPlaceholder="Enter last name"
						onInputChange={onInputChange}
						error={errors.lastName}
						isReadOnly={isReadOnly}
					/>
					<InputField
						labelText="Nick Name"
						inputName="nickName"
						inputValue={userDetails?.nickName}
						inputPlaceholder="Enter Nick Name"
						onInputChange={onInputChange}
						error={errors.nickName}
						isReadOnly={isReadOnly}
					/>
				</div>
				<div className="flex gap-4">
					<InputField
						labelText="Email Address"
						inputName="email"
						inputValue={userDetails?.email}
						inputPlaceholder="Enter email address"
						onInputChange={onInputChange}
						error={errors.email}
						isReadOnly={isReadOnly}
					/>
					<InputField
						labelText="Phone Number"
						inputName="mobile"
						inputValue={userDetails?.mobile}
						inputPlaceholder="Enter phone number"
						onInputChange={onInputChange}
						error={errors.mobile}
						isReadOnly={isReadOnly}
					/>
				</div>
				<div className="flex gap-4">
					<InputField
						labelText="Designation"
						inputName="designation"
						inputValue={userDetails?.designation}
						inputPlaceholder="Enter designation"
						onInputChange={onInputChange}
						error={errors.designation}
						isReadOnly={isReadOnly}
					/>
					<InputField
						labelText="Office Id"
						inputName="officeId"
						inputValue={userDetails?.officeId}
						inputPlaceholder="Enter office id"
						onInputChange={onInputChange}
						error={errors.officeId}
						isReadOnly={isReadOnly}
					/>
				</div>
				<div className="flex gap-4">
					<div className="flex flex-col w-full gap-1">
						<label className="block text-sm font-medium text-gray-700">
							Select Role <span className="text-red-500">*</span>
						</label>
						<Select
							size="large"
							value={userDetails?.roleId}
							placeholder="Select role type"
							className="w-full"
							options={roleList}
							onChange={(value) => onSelectChange("roleId", value)}
							status={errors.roleId && "error"}
							showSearch
							optionFilterProp="label"
							disabled={isReadOnly}
						/>
						{errors.roleId && <p className="text-red-500 text-sm">{errors.roleId}</p>}
					</div>
					<div className="flex flex-col w-full gap-1">
						<label className="block text-sm font-medium text-gray-700">
							Active Status <span className="text-red-500">*</span>
						</label>
						<Select
							size="large"
							value={userDetails?.isActive}
							placeholder="Select role type"
							className="w-full"
							options={[
								{ label: "Active", value: true },
								{ label: "Inactive", value: false },
							]}
							onChange={(value) => onSelectChange("isActive", value)}
							status={errors.isActive && "error"}
							showSearch
							optionFilterProp="label"
							disabled={isReadOnly}
						/>
						{errors.isActive && <p className="text-red-500 text-sm">{errors.isActive}</p>}
					</div>
				</div>
				{/* <RolePermissionChecker tag="user-role-permission-user" name="update"> */}
				{!isReadOnly && (
					<div className="col-span-2 text-center mt-4">
						<button type="submit" className="bg-green-500 w-[18%] px-2 py-1 text-white rounded-md">
							Update User
						</button>
					</div>
				)}
				{/* </RolePermissionChecker> */}
			</form>
			{/* </RolePermissionChecker> */}
		</ContentWrapper>
	);
}
