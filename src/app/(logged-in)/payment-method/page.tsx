"use client";
import CreateTooltipButton from "@/app/components/buttons/AddToolTIpButton";
import ContentWrapper from "@/app/components/layout/wrappers/ContentWrapper";
import RolePermissionChecker from "@/app/components/rolepermission/HandleRolePermission";
import { message } from "antd";
import { useCallback, useEffect, useState } from "react";
import { createPaymentMethod, getPaymentMethods, updatePaymentMethod } from "./actions/paymentMethodActions";
import PaymentMethodModal from "./components/PaymentMethodModal";
import PaymentMethodTable from "./components/PaymentMethodTable";

const emptyPaymentMethod = {
	id: null,
	name: "",
	sortOrder: "",
	isActive: true,
};

export default function PaymentMethodPage() {
	const [paymentMethods, setPaymentMethods] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [showModal, setShowModal] = useState<boolean>(false);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [paymentMethod, setPaymentMethod] = useState<any>(emptyPaymentMethod);

	const fetchData = useCallback(async () => {
		setLoading(true);
		try {
			const res: any = await getPaymentMethods();
			if (res?.success) {
				setPaymentMethods(res.data);
			} else {
				throw new Error(res?.message || "Failed to Fetch Payment Method List");
			}
		} catch (error: any) {
			message.error(error.message || "Failed to Fetch Payment Method List");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	function handleInputChange(e: any) {
		const { name, value } = e.target;
		setPaymentMethod((prevState: any) => ({
			...prevState,
			[name]: value,
		}));
	}

	function handleActiveChange(isActive: boolean) {
		setPaymentMethod((prevState: any) => ({
			...prevState,
			isActive,
		}));
	}

	function handleEdit(data: any) {
		setIsEditing(true);
		setPaymentMethod({
			id: data?.id,
			name: data?.name,
			sortOrder: data?.sortOrder ?? "",
			isActive: data?.isActive,
		});
		setShowModal(true);
	}

	function handleModalClose() {
		setShowModal(false);
		setIsEditing(false);
		setPaymentMethod(emptyPaymentMethod);
	}

	async function handleSubmit() {
		const body: any = {
			name: paymentMethod.name.trim(),
			isActive: paymentMethod.isActive,
		};
		// Sort order is optional; an empty box means "leave it to the backend".
		if (paymentMethod.sortOrder !== "" && paymentMethod.sortOrder !== null) {
			body.sortOrder = Number(paymentMethod.sortOrder);
		}

		try {
			const res: any = isEditing
				? await updatePaymentMethod(paymentMethod.id, body)
				: await createPaymentMethod(body);
			if (res?.success) {
				message.success(`Payment Method ${isEditing ? "Updated" : "Created"} Successfully`);
				handleModalClose();
				await fetchData();
			} else {
				// A duplicate name comes back as a 409 body, so surface the API's own message.
				throw new Error(res?.message || `Failed to ${isEditing ? "update" : "create"} Payment Method`);
			}
		} catch (error: any) {
			message.error(error.message || `Failed to ${isEditing ? "update" : "create"} Payment Method`);
		}
	}

	async function handleToggleActive(record: any, isActive: boolean) {
		try {
			const res: any = await updatePaymentMethod(record.id, { isActive });
			if (res?.success) {
				message.success(`Payment Method ${isActive ? "Activated" : "Deactivated"} Successfully`);
				await fetchData();
			} else {
				throw new Error(res?.message || "Failed to update Payment Method");
			}
		} catch (error: any) {
			message.error(error.message || "Failed to update Payment Method");
		}
	}

	return (
		<>
			<ContentWrapper permissionTag="administration-payment-gateway">
				<div className="flex w-full justify-end items-end">
					<RolePermissionChecker tag="administration-payment-gateway" name="create">
						<CreateTooltipButton onClickFnc={() => setShowModal(true)} title="Add Payment Method" />
					</RolePermissionChecker>
				</div>
				<RolePermissionChecker tag="administration-payment-gateway" name="list">
					<PaymentMethodTable
						tableData={paymentMethods}
						loading={loading}
						onEdit={handleEdit}
						onToggleActive={handleToggleActive}
					/>
				</RolePermissionChecker>
			</ContentWrapper>
			<PaymentMethodModal
				showModal={showModal}
				onModalClose={handleModalClose}
				paymentMethod={paymentMethod}
				onInputChange={handleInputChange}
				onActiveChange={handleActiveChange}
				onFormSubmit={handleSubmit}
				isEditing={isEditing}
			/>
		</>
	);
}
