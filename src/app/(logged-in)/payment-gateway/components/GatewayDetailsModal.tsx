import { Modal } from "antd";

export default function GatewayDetailsModal({
	showModal,
	onCancel,
	isEditing,
	onFormDataChange,
	paymentGateway,
	onFormSubmit,
	onImageChange,
}: any) {
	return (
		<>
			<Modal
				title={`${isEditing ? "Edit" : "Add"} Payment Gateway`}
				open={showModal}
				onCancel={onCancel}
				okText="Create"
				footer={null}
			>
				<div>
					<form className="grid grid-cols-1 sm:grid-cols-1 gap-4" onSubmit={(e) => onFormSubmit(e)}>
						<div className="form-group">
							<label className="block text-sm font-medium text-gray-700">
								Gateway Name <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								name="title"
								value={paymentGateway.title}
								onChange={(e) => {
									onFormDataChange(e);
								}}
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
								placeholder="Enter Gateway Name"
								required
							/>
						</div>
						<div className="form-group">
							<label className="block text-sm font-medium text-gray-700">
								Gateway Commission <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								name="gatewayCommission"
								value={paymentGateway.gatewayCommission}
								onChange={(e: any) => {
									onFormDataChange(e);
								}}
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
								placeholder="Enter Gateway Commission"
								required
							/>
						</div>
						<div className="form-group">
							<label className="block text-sm font-medium text-gray-700">
								Gateway Status <span className="text-red-500">*</span>
							</label>
							<select
								name="status"
								value={paymentGateway.status ? "true" : "false"}
								onChange={(e) => {
									const value = e.target.value === "true";
									onFormDataChange({ target: { name: e.target.name, value } });
								}}
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
							>
								<option value="true">True</option>
								<option value="false">False</option>
							</select>
						</div>
						<div className="form-group">
							<label className="block text-sm font-medium text-gray-700">
								Easy Checkout <span className="text-red-500">*</span>
							</label>
							<select
								name="enableEasyCheckout"
								value={paymentGateway.enableEasyCheckout ? "true" : "false"}
								onChange={(e) => {
									const value = e.target.value === "true";
									onFormDataChange({ target: { name: e.target.name, value } });
								}}
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
							>
								<option value="true">True</option>
								<option value="false">False</option>
							</select>
						</div>
						<div className="form-group">
							<label className="block text-sm font-medium text-gray-700">
								Order <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								name="order"
								value={paymentGateway.order}
								onChange={(e: any) => {
									onFormDataChange(e);
								}}
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
								placeholder="Sorting Order"
								required
							/>
						</div>
						<div className="form-group">
							<label className="block text-sm font-medium text-gray-700">
								Gateway Icon <span className="text-red-500">*</span>
							</label>
							<input
								type="file"
								accept="image/*"
								name="icon"
								// value={isEditing ? paymentGateway.icon : null}
								onChange={(e) => {
									console.log(e);
									onImageChange(e);
								}}
							/>
						</div>

						{/* <p style={{ color: "red" }}>{msg}</p> */}
						<button type="submit" className="bg-primary-400 px-2 py-1 text-white rounded-md">
							{isEditing ? "Update" : "Create"}
						</button>
					</form>
				</div>
			</Modal>
		</>
	);
}
