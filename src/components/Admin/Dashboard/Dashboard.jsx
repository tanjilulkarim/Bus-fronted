import React, { useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../../Contexts/AdminContext';

const Dashboard = () => {
	const { logout, user } = useAuth();
	const navigate = useNavigate();
	useEffect(() => {
		if (user.type !== 'admin') {
			Swal.fire({
				title: 'Oops...',
				text: 'You are not authorized to view this page!',
				icon: 'error',
				confirmButtonText: 'okay',
			})
			navigate('/');
		}
	}, [user, navigate]);
	return (
		<div className='dashboard-bg'>
			<div className='container-fluid'>
				<div className='row'>
					<nav
						id='sidebarMenu'
						className='col-md-3 col-lg-2 d-none d-lg-block sidebar collapse '>
						<div className='position-sticky pt-3'>
							<ul className='nav flex-column vh-100 '>
								<li className='nav-item'>
									<Link
										to='/'
										className='nav-link text-success bg-light shadow mb-5'>
										<i className='fas fa-home mr-2'></i> Home
									</Link>
								</li>
								<li className='nav-item'>
									<Link to='manage-trips' className='nav-link'>
										<i className='fa-solid fa-globe mr-2'></i> Manage Trips
									</Link>
								</li>
								<li className='nav-item'>
									<Link to='manage-bookings' className='nav-link'>
										<i className='fas fa-home mr-2'></i> Manage Bookings
									</Link>
								</li>
							</ul>
						</div>
					</nav>

					<main className='col-md-12 ms-sm-auto col-lg-10 px-md-4'>
						<div className='d-flex flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom'>
							<h1 className='h2'>Dashboard</h1>
							<ul className='nav ms-2 d-flex d-lg-none'>
								<li className='nav-item'>
									<Link to='manage-trips' className='nav-link'>
										<i className='fa-solid fa-globe mr-2'></i> Manage Trips
									</Link>
								</li>
								<li className='nav-item'>
									<Link to='manage-bookings' className='nav-link'>
										<i className='fas fa-home mr-2'></i> Manage Bookings
									</Link>
								</li>
							</ul>
							<div className='btn-toolbar mb-2 mb-md-0  ms-auto'>
								<button
									type='button'
									onClick={logout}
									className='btn btn-danger'>
									Logout
								</button>
							</div>
						</div>
						<Outlet />
					</main>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
