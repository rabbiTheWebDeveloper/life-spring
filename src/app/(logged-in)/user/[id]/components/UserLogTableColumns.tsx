export const getUserLogTableColumns = () => [
	{
		title: "Action Time",
		dataIndex: "createdAt",
		key: "createdAt",
	},
	{
		title: "User Name",
		dataIndex: "agentName",
		key: "agentName",
	},
	{
		title: "User ID",
		dataIndex: "agentId",
		key: "agentId",
	},
	{
		title: "Action",
		dataIndex: "remarks",
		key: "remarks",
	},
];
