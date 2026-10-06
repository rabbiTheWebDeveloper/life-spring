"use client";
import CreateTooltipButton from "@/app/components/buttons/AddToolTIpButton";
import SearchFromList from "@/app/components/filters/SearchFromList";
import ContentWrapper from "@/app/components/layout/wrappers/ContentWrapper";
import RolePermissionChecker from "@/app/components/rolepermission/HandleRolePermission";
import { message } from "antd";
import { useEffect, useState } from "react";
import { createNewOrganization } from "./actions/CreateNewOrganization";
import { getOrganizationList } from "./actions/GetOrganizationList";
import { updateExistingOrganization } from "./actions/UpdateExistingOrganization";
import OrganizationDetailsModal from "./components/OrganizationDetailsModal";
import OrganizationTable from "./components/OrganizationTable";
interface Props {
	searchParams: { [key: string]: string | undefined };
}

export default function OrganizationPage({ searchParams }: Props) {
	const page = searchParams.page ?? 0;
	const search = searchParams.search ?? "";
	const [organizationList, setOrganizationList] = useState<any>(null);
	const [pagination, setPagination] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [showModal, setShowModal] = useState<boolean>(false);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [organizationDetails, setOrganizationDetails] = useState<any>({
		name: "",
		description: "",
		address: "",
		email: "",
		phone: "",
		logoUrl: "",
		status: true,
	});

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const res: any = await getOrganizationList(page, search);
				if (res?.success) {
					setOrganizationList(res.data.data);
					setPagination(res.data.pagination);
				} else {
					throw new Error(res?.message || "Failed to Fetch Organization List");
				}
			} catch (error: any) {
				console.error("Failed to Fetch Organization List");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [page, search]);

	const handleInputChange = (e: any) => {
		const { name, value } = e.target;
		setOrganizationDetails((prevState: any) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSelectChange = (name: any, value: any) => {
		setOrganizationDetails((prevState: any) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// const file = e.target.files?.[0] || null;
		// setSelectedFile(file);
		// if (file) {
		// 	const reader = new FileReader();
		// 	reader.onloadend = () => {
		// 		setPreview(reader.result as string);
		// 	};
		// 	reader.readAsDataURL(file);
		// } else {
		// 	setPreview(null);
		// }
	};
	function handleUpdate(data: any) {
		setIsEditing(true);
		setOrganizationDetails(data);
		setShowModal(true);
	}

	function handleModalClose() {
		setShowModal(false);
		setIsEditing(false);
		setOrganizationDetails({
			name: "",
			description: "",
			address: "",
			email: "",
			phone: "",
			logoUrl: "",
			status: true,
		});
	}

	async function handleSubmit() {
		if (isEditing) {
			try {
				const res = await updateExistingOrganization(organizationDetails.id, organizationDetails);

				if (res?.success) {
					message.success("Organization Updated Successfully");
					setOrganizationList((prevList: any) => prevList.map((org: any) => (org.id === res.data.id ? res.data : org)));
				} else {
					throw new Error(res?.message || "Failed to update organization");
				}

				setShowModal(false);
				handleModalClose();
			} catch (error: any) {
				message.error(error.message || `Failed to update organization`);
			}
		} else {
			try {
				const res = await createNewOrganization(organizationDetails);

				if (res?.success) {
					message.success("Organization Created Successfully");
					setOrganizationList([res.data, ...organizationList]);
				} else {
					throw new Error(res?.message || "Failed to create organization");
				}

				setShowModal(false);
				handleModalClose();
			} catch (error: any) {
				message.error(error.message || `Failed to create organization`);
			}
		}
	}

	return (
		<>
			<ContentWrapper permissionTag="organization">
				<div className="flex justify-between">
					<SearchFromList prop={"search"} url={`/organization?page=0`} placeholder="Search by name" />
					<RolePermissionChecker tag="organization" name="create">
						<CreateTooltipButton
							onClickFnc={() => {
								console.log("test");
								setShowModal(true);
							}}
							title="Create Organization"
						/>
					</RolePermissionChecker>
				</div>
				<OrganizationTable organizationList={organizationList} pagination={pagination} onUpdate={handleUpdate} loading={loading} />
			</ContentWrapper>
			<OrganizationDetailsModal
				showModal={showModal}
				onModalClose={handleModalClose}
				organizationDetails={organizationDetails}
				onInputChange={handleInputChange}
				onSelectChange={handleSelectChange}
				onFormSubmit={handleSubmit}
				isEditing={isEditing}
				onFileChange={handleFileChange}
			/>
		</>
	);
}
