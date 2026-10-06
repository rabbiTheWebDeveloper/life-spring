import { message } from "antd";
import { useEffect, useState } from "react";
import { getPermissionList } from "../actions/GetPermissionList";

function capitalizeString(word: string): string {
	const lower = word.toLowerCase();
	return lower.charAt(0).toUpperCase() + lower.slice(1);
}

const GroupedTable = ({ type, selected, setSelected }: any) => {
	const [permissionList, setPermissionList] = useState<any[]>([]);
	const [searchTerm, setSearchTerm] = useState(""); // state for local search

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res: any = await getPermissionList(type);
				if (res?.success) {
					setPermissionList(res.data);
				} else {
					throw new Error(res?.message || "Failed to Fetch Permission List");
				}
			} catch (error: any) {
				message.error("Failed to Fetch Permission List");
			}
		};
		fetchData();
	}, [type]);

	const groupedData = permissionList?.reduce((acc: any, item: any) => {
		if (!acc[item.tag]) acc[item.tag] = [];
		acc[item.tag].push(item);
		return acc;
	}, {});

	// filter by tags
	const filteredTags = Object.keys(groupedData).filter((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

	const handleCheckboxChange = (id: any) => {
		setSelected((prev: any) => (prev.includes(id) ? prev.filter((item: any) => item !== id) : [...prev, id]));
	};

	const handleTagCheckboxChange = (tag: any) => {
		const tagItemIds = groupedData[tag].map((item: any) => item.id);
		const allSelected = tagItemIds.every((id: any) => selected.includes(id));

		setSelected((prev: any) =>
			allSelected ? prev.filter((id: any) => !tagItemIds.includes(id)) : [...prev, ...tagItemIds]
		);
	};

	return (
		<div className="rounded-md overflow-hidden overflow-x-auto">
			{/* Search Input */}
			<div className="mb-4 w-[300px]">
				<input
					type="text"
					placeholder="Search by Tag..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="px-4 py-2 border border-gray-300 rounded-md w-full"
				/>
			</div>

			<table className="min-w-full border-collapse border border-gray-300">
				<thead>
					<tr className="bg-zinc-100">
						<th className="border border-gray-300 px-4 py-3">Tag</th>
						<th colSpan={12} className="border border-gray-300 border-r-0  px-4 py-2">
							Permissions
						</th>
					</tr>
				</thead>
				<tbody>
					{filteredTags.length > 0 ? (
						filteredTags.map((tag: any) => (
							<tr key={tag} className="border border-gray-300">
								<td className="border border-gray-300 px-4 py-3 font-semibold">
									<label className="inline-flex items-center">
										<input
											type="checkbox"
											checked={groupedData[tag].every((item: any) => selected.includes(item.id))}
											onChange={() => handleTagCheckboxChange(tag)}
											className="mr-2"
										/>
										{capitalizeString(tag)}
									</label>
								</td>
								<td className="border border-gray-300 px-4 py-3">
									<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
										{groupedData[tag].map((item: any) => (
											<label key={item.id} className="inline-flex items-center text-[12px]">
												<input
													type="checkbox"
													value={item.id}
													checked={selected.includes(item.id)}
													onChange={() => handleCheckboxChange(item.id)}
													className="mr-2"
												/>
												{capitalizeString(item.name)}
											</label>
										))}
									</div>
								</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan={8} className="text-center p-4 text-gray-500">
								No results found
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
};

export default GroupedTable;
