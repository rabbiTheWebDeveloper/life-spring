import { Input, message, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { getRoleList } from "../actions/GetRoleList";

export default function UserDetailsModal({
	showModal,
	onModalClose,
	userDetails,
	onFormSubmit,
	onSelectChange,
	onInputChange,
	isEditing,
}: any) {
	const [errors, setErrors] = useState<any>({});
	const [roleList, setRoleList] = useState<any[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res: any = await getRoleList();
				console.log(res);
				if (res?.success) {
					setRoleList(res.data.map((role: any) => ({ label: role.name, value: role.id })));
				} else {
					throw new Error(res?.message || "Failed to Fetch Role List");
				}
			} catch (error: any) {
				message.error("Failed to Fetch Role List");
			}
		};
		fetchData();
	}, []);

	const validateForm = () => {
		const newErrors: any = {};
		if (!userDetails.firstName.trim()) {
			newErrors.firstName = "First Name is required.";
		}
		// if (!userDetails.lastName.trim()) {
		// 	newErrors.lastName = "Last Name is required.";
		// }
		// if (!userDetails.lastName.trim()) {
		// 	newErrors.lastName = "Last Name is required.";
		// }
		if (!userDetails.email.trim()) {
			newErrors.email = "Email is required.";
		}
		if (!userDetails.mobile.trim()) {
			newErrors.mobile = "Phone Number is required.";
		}
		if (!userDetails.roleId) {
			newErrors.roleId = "Selection of role is required.";
		}

		// if (!userDetails.designation.trim()) {
		// 	newErrors.designation = "Designation is required.";
		// }
		// if (!userDetails.officeId.trim()) {
		// 	newErrors.officeId = "Office Id is required.";
		// }

		setErrors(newErrors);

		return Object.keys(newErrors).length === 0;
	};
	return (
		<>
			<Modal
				title={`${isEditing ? "Update" : "Create"} User`}
				open={showModal}
				onCancel={() => {
					onModalClose();
					setErrors({});
				}}
				okText="Create"
				footer={null}
				maskClosable={true}
			>
				<div>
					<form
						onSubmit={(e) => {
							e.preventDefault();

							if (validateForm()) {
								onFormSubmit(e);
							}
						}}
					>
						<div className="flex flex-col gap-2">
							<div className="flex flex-col gap-1">
								<label className="block text-sm font-medium text-gray-700">
									First Name <span className="text-red-500">*</span>
								</label>
								<Input
									size="large"
									name="firstName"
									value={userDetails?.firstName}
									placeholder="Enter first name"
									onChange={onInputChange}
									maxLength={75}
									status={errors.firstName && "error"}
								/>
								{errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
							</div>
							<div className="flex flex-col gap-1">
								<label className="block text-sm font-medium text-gray-700">
									Last Name
								</label>
								<Input
									size="large"
									name="lastName"
									value={userDetails?.lastName}
									placeholder="Enter last name"
									onChange={onInputChange}
									maxLength={75}
									status={errors.lastName && "error"}
								/>
								{errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
							</div>
							<div className="flex flex-col gap-1">
								<label className="block text-sm font-medium text-gray-700">
									Nick Name <span className="text-red-500">*</span>
								</label>
								<Input
									size="large"
									name="nickName"
									value={userDetails?.nickName}
									placeholder="Enter last name"
									onChange={onInputChange}
									maxLength={75}
									status={errors.nickName && "error"}
								/>
								{errors.nickName && <p className="text-red-500 text-sm">{errors.nickName}</p>}
							</div>
							<div className="flex flex-col gap-1">
								<label className="block text-sm font-medium text-gray-700">
									Email <span className="text-red-500">*</span>
								</label>
								<Input
									size="large"
									name="email"
									value={userDetails?.email}
									placeholder="Enter email address"
									onChange={onInputChange}
									maxLength={75}
									status={errors.email && "error"}
								/>
								{errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
							</div>
							<div className="flex flex-col gap-1">
								<label className="block text-sm font-medium text-gray-700">
									Phone Number <span className="text-red-500">*</span>
								</label>
								<Input
									size="large"
									name="mobile"
									value={userDetails?.mobile}
									placeholder="Enter phone number"
									onChange={onInputChange}
									maxLength={75}
									status={errors.mobile && "error"}
								/>
								{errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
							</div>
							<div className="flex flex-col gap-1">
								<label className="block text-sm font-medium text-gray-700">
									Designation
								</label>
								<Input
									size="large"
									name="designation"
									value={userDetails?.designation}
									placeholder="Enter designation"
									onChange={onInputChange}
									maxLength={75}
									status={errors.designation && "error"}
								/>
								{errors.designation && <p className="text-red-500 text-sm">{errors.designation}</p>}
							</div>
							<div className="flex flex-col gap-1">
								<label className="block text-sm font-medium text-gray-700">
									Office Id
								</label>
								<Input
									size="large"
									name="officeId"
									value={userDetails?.officeId}
									placeholder="Enter officeId"
									onChange={onInputChange}
									maxLength={75}
									status={errors.officeId && "error"}
								/>
								{errors.officeId && <p className="text-red-500 text-sm">{errors.officeId}</p>}
							</div>
							<div className="flex flex-col gap-1">
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
								/>
								{errors.roleId && <p className="text-red-500 text-sm">{errors.roleId}</p>}
							</div>
						</div>

						<div className="col-span-2 text-center mt-4">
							<button type="submit" className="bg-green-500 w-full px-2 py-1 text-white rounded-md">
								{isEditing ? "Update" : "Create"} User
							</button>
						</div>
					</form>
				</div>
			</Modal>
		</>
	);
}
