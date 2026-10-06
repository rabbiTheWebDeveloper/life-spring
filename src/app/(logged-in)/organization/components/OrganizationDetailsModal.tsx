import DropdownWithSearch from "@/app/components/formInputs/DropdownWithSearch";
import InputField from "@/app/components/formInputs/InputField";
import TextareaInputField from "@/app/components/formInputs/inputFields/TextareaInputField";
import { Modal } from "antd";
import { useState } from "react";

export default function OrganizationDetailsModal({
	showModal,
	onModalClose,
	organizationDetails,
	onFormSubmit,
	onInputChange,
	onSelectChange,
	isEditing,
	onFileChange,
}: any) {
	const [errors, setErrors] = useState<any>({});

	const validateForm = () => {
		const newErrors: any = {};
		if (!organizationDetails.name.trim()) {
			newErrors.name = true;
		}
		// if (!organizationDetails.description.trim()) {
		// 	newErrors.description = true;
		// }
		if (!organizationDetails.address.trim()) {
			newErrors.address = true;
		}
		if (!organizationDetails.email.trim()) {
			newErrors.email = true;
		}
		if (!organizationDetails.phone.trim()) {
			newErrors.phone = true;
		}

		// console.log(newErrors);
		setErrors(newErrors);

		return Object.keys(newErrors).length === 0;
	};
	return (
		<Modal
			title={`${isEditing ? "Update" : "Create"} Organization`}
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
					className="flex flex-col gap-2"
				>
					<InputField
						labelText="Organization Name"
						inputName="name"
						inputValue={organizationDetails.name}
						inputPlaceholder="Enter organization name"
						onInputChange={onInputChange}
						error={errors.name}
					/>
					<TextareaInputField
						name="description"
						value={organizationDetails.description}
						onChange={onInputChange}
						placeholder="e.g., Fever and cold"
						label="Description"
						required={false}
					/>
					<InputField
						labelText="Phone Number"
						inputName="phone"
						inputValue={organizationDetails.phone}
						inputPlaceholder="Enter phone number"
						onInputChange={onInputChange}
						error={errors.phone}
					/>
					<InputField
						labelText="Email"
						inputName="email"
						inputValue={organizationDetails.email}
						inputPlaceholder="Enter email address"
						onInputChange={onInputChange}
						error={errors.email}
					/>
					<TextareaInputField
						name="address"
						value={organizationDetails.address}
						onChange={onInputChange}
						placeholder="e.g., Fever and cold"
						label="Address"
						required={true}
						error={errors.address}
					/>

					{/* <ImageUploadFieldWithPreview
						labelText="Logo"
						InputName="logoUrl"
						onFileChange={(file: any) => onFileChange("logoUrl", file)}
						initialImage={organizationDetails.logoUrl}
						error={errors.logoUrl}
					/> */}

					{isEditing && (
						<DropdownWithSearch
							labelText="Status"
							inputPlaceholder="Select status"
							selectionValue={organizationDetails.status}
							selectionOptions={[
								{ value: true, label: "Active" },
								{ value: false, label: "Inactive" },
							]}
							onSelectChange={(value: any) => onSelectChange("status", value)}
						/>
					)}

					<div className="col-span-2 text-center mt-4">
						<button type="submit" className="bg-green-500 w-full px-2 py-1 text-white rounded-md">
							{isEditing ? "Update Organization" : "Create Organization"}
						</button>
					</div>
				</form>
			</div>
		</Modal>
	);
}
