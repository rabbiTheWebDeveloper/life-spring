"use client";
import RolePermissionChecker from "@/app/components/rolepermission/HandleRolePermission";
import SidebarPermission from "@/app/components/sidebar/SidebarPermisson";
import { message } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
	addPaymentGateway,
	deletePaymentGateway,
	getPaymentGatewayList,
	updatePaymentGateway,
} from "./action/paymentGatewaysAction";
import GatewayDeleteModal from "./components/GatewayDeleteModal";
import GatewayDetailsModal from "./components/GatewayDetailsModal";
import PaymentGatewayTable from "./components/PaymentGatewayTable";
import CreateTooltipButton from "@/app/components/buttons/AddToolTIpButton";

function PaymentGatewayPage() {
	const router = useRouter();
	const [gateways, setGateways] = useState<any>(null);
	const [showModal, setShowModal] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [paymentGateway, setPaymentGateway] = useState<any>({
		id: null,
		title: "",
		gatewayCommission: "",
		status: true,
		enableEasyCheckout: false,
		icon: "",
	});
	useEffect(() => {
		const fetchData = async () => {
			try {
				const res: any = await getPaymentGatewayList();
				setLoading(true);
				if (res?.success) {
					setGateways(res.data.gatewayList);
					setLoading(false);
				} else {
					throw new Error(res?.message || "Failed to Fetch Payment Gateway List");
				}
			} catch (error: any) {
				message.error(`Error Fetching Data`);
			}
		};
		fetchData();
	}, []);


	function handleFormDataChange(e: any) {
		// console.log(e);
		console.log(e);
		setPaymentGateway({
			...paymentGateway,
			[e.target.name]: e.target.value,
		});
	}
	function handleImageChange(e: any) {
		const file = e.target.files[0];
		setPaymentGateway({
			...paymentGateway,
			icon: file,
		});
	}
	function handleCancel() {
		setIsEditing(false);
		setShowModal(false);
		setShowDeleteModal(false);
		setPaymentGateway({
			id: null,
			title: "",
			gatewayCommission: "",
			icon: "",
			order: "",
			enableEasyCheckout: false,
			status: true,
		});
	}
	async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		try {
			const formData = new FormData();

			formData.append("title", paymentGateway.title);
			formData.append("gatewayCommission", paymentGateway.gatewayCommission);
			formData.append("status", paymentGateway.status);
			formData.append("order", paymentGateway.order);
			formData.append("enableEasyCheckout", paymentGateway.enableEasyCheckout);

			if (isEditing) {
				if (paymentGateway.icon instanceof File) {
					formData.append("icon", paymentGateway.icon);
				}

				const res = await updatePaymentGateway(formData, paymentGateway.id);
				if (res?.success) {
					setGateways((prevGateways: any) =>
						prevGateways.map((gateway: any) => (gateway.id === paymentGateway.id ? res.data : gateway))
					);
					message.success("Gateway Edited successfully", res.data);
					handleCancel();
				} else {
					message.error("Error during form submission", res?.message || "Unknown error");
				}
			} else {
				// Only append the icon if it's a file
				if (paymentGateway.icon instanceof File) {
					formData.append("icon", paymentGateway.icon); // Add file to FormData
				} else {
					console.error("Invalid icon value while adding: Expected a File.");
				}

				const res = await addPaymentGateway(formData);

				if (res?.success) {
					setGateways([...gateways, res.data]);
					message.success("Gateway Created successfully", res.data);
					handleCancel();
				} else {
					message.error("Error during form submission", res?.message || "Unknown error");
				}
			}
		} catch (error: any) {
			console.error("Error submitting form:", error);
		}
	}

	function handleEdit(gatewayId: any, gateway: any) {
		setShowModal(true);
		setIsEditing(true);
		setPaymentGateway({
			id: gateway.id,
			status: gateway.status,
			enableEasyCheckout: gateway.enableEasyCheckout,
			title: gateway.title,
			gatewayCommission: gateway.gatewayCommission,
			icon: gateway.icon,
			order: gateway.order,
		});
	}
	function handleDelete(selectedGateway: any) {
		setShowDeleteModal(true);
		setPaymentGateway(selectedGateway);
	}
	async function confirmDeletation(gatewayId: any) {
		try {
			const res = await deletePaymentGateway(gatewayId);

			if (res?.statusCode === 200) {
				message.success("Gateway Deleted Successfully");
			} else {
				throw new Error(res?.message || "Failed to delete Gateway");
			}

			setPaymentGateway({
				id: null,
				title: "",
				gatewayCommission: "",
				icon: "",
				order: "",
				enableEasyCheckout: false,
			});
			setShowDeleteModal(false);
			router.push("/payment-gateway");
		} catch (error: any) {
			message.error(`Error deleting Gateway: ${error.message}`);
		}
	}

	return (
		<>
			<div className="mb-4 p-8 rounded-lg border bg-white flex flex-col gap-10 mt-2">
				<SidebarPermission tag="administration-payment-gateway">
					<div className="flex w-full justify-end items-end mb-4">
						<div className="flex   items-center gap-3">
							<RolePermissionChecker tag="administration-payment-gateway" name="create">
								<CreateTooltipButton
									onClickFnc={() => setShowModal(true)}
									title="Add Payment Gateway"
								/>
							</RolePermissionChecker>
						</div>
					</div>
				</SidebarPermission>
				<RolePermissionChecker tag="administration-payment-gateway" name="list">
					<PaymentGatewayTable
						tableData={gateways}
						loading={loading}
						onEdit={handleEdit}
						onDelete={handleDelete}
					/>
				</RolePermissionChecker>
				<GatewayDetailsModal
					showModal={showModal}
					onCancel={handleCancel}
					onFormDataChange={handleFormDataChange}
					paymentGateway={paymentGateway}
					onFormSubmit={handleFormSubmit}
					isEditing={isEditing}
					onImageChange={handleImageChange}
				/>
				<GatewayDeleteModal
					showModal={showDeleteModal}
					gateway={paymentGateway}
					confirmDeletation={confirmDeletation}
					onCancel={handleCancel}
				/>
			</div>

			{/*<div className="mb-4 p-8 rounded-lg border bg-white flex flex-col gap-10 mt-2">*/}
			{/*	<div className="flex w-full justify-end items-end mb-4">*/}
			{/*		<div className="flex   items-center gap-3">*/}
			{/*			<CreateTooltipButton*/}
			{/*				onClickFnc={() => setShowModal(true)}*/}
			{/*				title="Add Payment Gateway"*/}
			{/*			/>*/}
			{/*		</div>*/}
			{/*	</div>*/}
			{/*	<PaymentGatewayTable*/}
			{/*		tableData={gateways}*/}
			{/*		loading={loading}*/}
			{/*		onEdit={handleEdit}*/}
			{/*		onDelete={handleDelete}*/}
			{/*	/>*/}
			{/*	<GatewayDetailsModal*/}
			{/*		showModal={showModal}*/}
			{/*		onCancel={handleCancel}*/}
			{/*		onFormDataChange={handleFormDataChange}*/}
			{/*		paymentGateway={paymentGateway}*/}
			{/*		onFormSubmit={handleFormSubmit}*/}
			{/*		isEditing={isEditing}*/}
			{/*		onImageChange={handleImageChange}*/}
			{/*	/>*/}
			{/*	<GatewayDeleteModal*/}
			{/*		showModal={showDeleteModal}*/}
			{/*		gateway={paymentGateway}*/}
			{/*		confirmDeletation={confirmDeletation}*/}
			{/*		onCancel={handleCancel}*/}
			{/*	/>*/}
			{/*</div>*/}
		</>
	);
}

export default PaymentGatewayPage;
