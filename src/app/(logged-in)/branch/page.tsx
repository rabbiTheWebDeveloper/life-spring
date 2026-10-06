"use client";
import CreateTooltipButton from "@/app/components/buttons/AddToolTIpButton";
import SearchFromList from "@/app/components/filters/SearchFromList";
import ContentWrapper from "@/app/components/layout/wrappers/ContentWrapper";
import RolePermissionChecker from "@/app/components/rolepermission/HandleRolePermission";
import { message } from "antd";
import { useEffect, useState } from "react";
import { createNewBranch } from "./actions/CreateNewBranch";
import { getBranchList } from "./actions/GetBranchList";
import { updateExistingBranch } from "./actions/UpdateExistingOrganization";
import BranchDetailsModal from "./components/BranchDetailsModal";
import BranchTable from "./components/BranchTable";
interface Props {
	searchParams: { [key: string]: string | undefined };
}

export default function BranchPage({ searchParams }: Props) {
	const page = searchParams.page ?? 0;
	const search = searchParams.search ?? "";
	const [branchList, setBranchList] = useState<any>(null);
	const [pagination, setPagination] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [showModal, setShowModal] = useState<boolean>(false);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [branchDetails, setBranchDetails] = useState<any>({
		name: "",
		location: "",
		organizationId: "",
	});

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const res: any = await getBranchList(page, search);
				// console.log(res);
				if (res?.success) {
					setBranchList(res.data.data);
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
		setBranchDetails((prevState: any) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSelectChange = (name: any, value: any) => {
		setBranchDetails((prevState: any) => ({
			...prevState,
			[name]: value,
		}));
	};

	function handleUpdate(data: any) {
		setIsEditing(true);
		setBranchDetails({
			id: data?.id,
			name: data?.name,
			location: data?.location,
			organizationId: data?.organization?.id,
		});
		setShowModal(true);
	}

	function handleModalClose() {
		setShowModal(false);
		setIsEditing(false);
		setBranchDetails({
			name: "",
			location: "",
			organizationId: "",
		});
	}

	async function handleSubmit() {
		if (isEditing) {
			try {
				const res = await updateExistingBranch(branchDetails.id, branchDetails);
				if (res?.success) {
					message.success("Branch Updated Successfully");
					setBranchList((prevList: any) =>
						prevList.map((branch: any) => (branch.id === res.data.id ? res.data : branch))
					);
				} else {
					throw new Error(res?.message || "Failed to update branch");
				}
				setShowModal(false);
				handleModalClose();
			} catch (error: any) {
				message.error(error.message || `Failed to update branch`);
			}
		} else {
			try {
				const res = await createNewBranch(branchDetails);
				if (res?.success) {
					message.success("Branch Created Successfully");
					setBranchList([res.data, ...branchList]);
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
			<ContentWrapper permissionTag="branch">
				<div className="flex justify-between">
					<SearchFromList prop={"search"} url={`/branch?page=0`} placeholder="Search by name" />
					<RolePermissionChecker tag="organization" name="create">
						<CreateTooltipButton
							onClickFnc={() => {
								setShowModal(true);
							}}
							title="Create Branch"
						/>
					</RolePermissionChecker>
				</div>
				<BranchTable branchList={branchList} pagination={pagination} onUpdate={handleUpdate} loading={loading} />
			</ContentWrapper>
			<BranchDetailsModal
				showModal={showModal}
				onModalClose={handleModalClose}
				branchDetails={branchDetails}
				onInputChange={handleInputChange}
				onSelectChange={handleSelectChange}
				onFormSubmit={handleSubmit}
				isEditing={isEditing}
			/>
		</>
	);
}
