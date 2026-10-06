import SidebarPermission from "../../sidebar/SidebarPermisson";

export default function ContentWrapper({ children, permissionTag = "" }: any) {
	return (
		<>
			{permissionTag === "" ? (
				<div className="w-full mb-4 p-3 lg:p-8 rounded-lg border bg-white flex flex-col gap-6 mt-2">{children}</div>
			) : (
				<SidebarPermission tag={permissionTag}>
					<div className="w-full mb-4 p-3 lg:p-8 rounded-lg border bg-white flex flex-col gap-6 mt-1">{children}</div>
				</SidebarPermission>
			)}
		</>
	);
}
