import React from 'react'
import ResetPassword from './components/ResetPassword'
import resetPassword from './actions/ResetPasswordAction'

const page = () => {
	return (
		<ResetPassword actionFn={resetPassword} />
	)
}

export default page
