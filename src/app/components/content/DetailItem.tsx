export default function DetailItem({label, value}: any) {
	return (
		<div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
			<span className="text-[12px] text-gray-500">{label}</span>
			<span className="text-[12px] font-medium text-gray-800 ">
        {value}
      </span>
		</div>
	);
}
