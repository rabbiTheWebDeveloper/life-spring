import SidebarPermission from "../sidebar/SidebarPermisson";

export default function ContentContainer({ children, permissionTag = "" }: any) {
	return (
		<>
			{permissionTag === "" ? (
				<div className="mb-4 p-3 lg:p-8 rounded-lg border bg-white flex flex-col gap-10 mt-2">{children}</div>
			) : (
				<SidebarPermission tag={permissionTag}>
					<div className="mb-4 p-3 lg:p-8 rounded-lg border bg-white flex flex-col gap-10 mt-2">{children}</div>
				</SidebarPermission>
			)}
		</>
	);
}
