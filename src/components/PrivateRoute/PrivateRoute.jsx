import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../Contexts/AdminContext';

const PrivateRoute = ({ children }) => {
	const { user, loading } = useAuth();
	if (loading) {
		return <h1 className='text-center py-4'> Loading... </h1>;
	}
	if (user) {
		return children;
	} else {
		// Swal.fire({
		// 	title: 'You are not authorized to view this page!',
		// 	text: ' Please login to continue.',
		// 	icon: 'error',
		// });
		return <Navigate to='/login' />;
	}
};

export default PrivateRoute;
