import { Input, message, Modal } from "antd";
import { useState } from "react";
import { AddSingularPermission } from "../actions/AddSingularPermission";

export default function AddSinglePermissionModal({ showModal, onModalClose, permissionDetails }: any) {
	const [errors, setErrors] = useState<any>({});
	const [name, setName] = useState<any>("");

	const validateForm = () => {
		const newErrors: any = {};
		if (!name.trim()) {
			newErrors.name = "Permission Name is required.";
		}
		setErrors(newErrors);

		return Object.keys(newErrors).length === 0;
	};

	async function handleFormSubmit() {
		try {
			const payload = { type: permissionDetails.type, tag: permissionDetails.name, name };
			const res = await AddSingularPermission(payload);

			if (res?.success) {
				message.success("Permission Added Successfully");
				onModalClose();
				setName("");
				window.location.reload();
			} else {
				throw new Error(res?.message || "Failed to add permission");
			}
		} catch (error: any) {
			message.error(error.message || `Failed to add permission`);
		}
	}
	return (
		<Modal
			title={`Add Singular Permission`}
			open={showModal}
			onCancel={() => {
				onModalClose();
				setName("");
			}}
			okText="Create"
			footer={null}
			maskClosable={true}
		>
			<div>
				<form
					onSubmit={(e: any) => {
						e.preventDefault();
						if (validateForm()) {
							handleFormSubmit();
						}
					}}
				>
					<div className="flex flex-col gap-2">
						<div className="flex flex-col gap-1">
							<label className="block text-sm font-medium text-gray-700">
								Module Name <span className="text-red-500">*</span>
							</label>
							<Input
								size="large"
								name="name"
								value={permissionDetails?.name}
								placeholder="Enter module name"
								maxLength={75}
								readOnly={true}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<label className="block text-sm font-medium text-gray-700">
								Role Type <span className="text-red-500">*</span>
							</label>

							<Input
								size="large"
								name="name"
								value={permissionDetails?.type}
								placeholder="Enter module name"
								maxLength={75}
								readOnly={true}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<label className="block text-sm font-medium text-gray-700">
								Permission Name <span className="text-red-500">*</span>
							</label>
							<Input
								size="large"
								name="name"
								value={name}
								onChange={(e) => setName(e.target.value)} // Corrected onChange handler
								placeholder="Enter permission name"
								maxLength={75}
							/>
							{errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
						</div>
					</div>

					<div className="col-span-2 text-center mt-4">
						<button type="submit" className="bg-green-500 w-full px-2 py-1 text-white rounded-md">
							Add Permission
						</button>
					</div>
				</form>
			</div>
		</Modal>
	);
}
