import React from 'react'
import ResetShootMail from './components/ResetShootMail'
import shootReset from './actions/ShootResetAction'

const page = () => {
	return (
		<ResetShootMail actionFn={shootReset} />
	)
}

export default page
