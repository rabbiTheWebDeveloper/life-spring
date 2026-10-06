import { Input, Modal, Select } from "antd";
import { useState } from "react";

export default function RoleDetailsModal({
	showModal,
	onModalClose,
	roleDetails,
	onFormSubmit,
	onSelectChange,
	onInputChange,
}: any) {
	const [errors, setErrors] = useState<any>({});

	const validateForm = () => {
		const newErrors: any = {};
		if (!roleDetails.name.trim()) {
			newErrors.name = "Role Name is required.";
		}
		if (!roleDetails.type.trim()) {
			newErrors.type = "Selection of role type is required.";
		}

		setErrors(newErrors);

		return Object.keys(newErrors).length === 0;
	};
	return (
		<Modal
			title={`Create Role`}
			open={showModal}
			onCancel={() => {
				onModalClose();
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
								Role Name <span className="text-red-500">*</span>
							</label>
							<Input
								size="large"
								name="name"
								value={roleDetails?.name}
								placeholder="Enter role name"
								onChange={onInputChange}
								maxLength={75}
								status={errors.name && "error"}
							/>
							{errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
						</div>
					</div>

					<div className="col-span-2 text-center mt-4">
						<button type="submit" className="bg-green-500 w-full px-2 py-1 text-white rounded-md">
							Create Role
						</button>
					</div>
				</form>
			</div>
		</Modal>
	);
}
