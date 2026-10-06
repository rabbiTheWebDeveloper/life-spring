import React from 'react'
import Login from './components/Login'
import loginAdmin from './actions/LoginAction'

const page = () => {
	return (

		<Login actionFn={loginAdmin}/>
	)
}

export default page
