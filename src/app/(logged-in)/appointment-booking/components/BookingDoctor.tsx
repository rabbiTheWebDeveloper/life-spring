
'use client';


const BookingDoctor = ({ doctor }: any) => {
	return (
		<div className="">
			{
				doctor && <div >
					{/* Doctor Details */}
					<div className="flex items-center gap-4 mb-6">
						<img
							src={doctor?.profilePic}
							alt={doctor?.name}
							className="w-20 h-20 rounded-full border border-gray-300"
						/>
						<div>
							<h2 className="text-2xl font-semibold text-gray-800">{doctor?.name}</h2>
							<p className="text-primary-500">{doctor?.specialty?.name?.en}</p>
						</div>
					</div>

					{/* Doctor Schedules */}

				</div>
			}
		</div>
	);
};

export default BookingDoctor;
