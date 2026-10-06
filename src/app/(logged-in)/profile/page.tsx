'use client'
import ProfileCard from './components/ProfileCard'
import {useAuth} from "@/app/(logged-in)/AuthContext";

const page = async () => {
	const { user } = useAuth();

	return (
		<div className='mt-16 px-4 '>
			<ProfileCard user={user}/>
		</div>
	)
}

export default page
