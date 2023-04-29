import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Admin from './components/Admin/Admin';
import Dashboard from './components/Admin/Dashboard/Dashboard';
import ManageBookings from './components/Admin/Dashboard/ManageBookings';
import ManageTrips from './components/Admin/Dashboard/ManageTrips';
import Home from './components/Home/Home';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Search from './components/Search/Search';
import UserRegister from './components/UserLogin/UserRegister';
// import 'sweetalert2/src/sweetalert2.scss'

function App() {
	return (
		<div>
			<Routes>
				<Route
					path='/'
					element={
						<PrivateRoute>
							<Home />
						</PrivateRoute>
					}
				/>
				<Route path='*' element={<div>Not Found</div>} />
				<Route path='login' element={<Admin />} />
				<Route
					path='register'
					element={
						<PrivateRoute>
							<UserRegister />
						</PrivateRoute>
					}
				/>
				<Route
					path='admin-dashboard/*'
					element={
						<PrivateRoute>
							<Dashboard />
						</PrivateRoute>
					}>
					<Route path='*' element={<Navigate to='manage-trips' />} />
					<Route
						path='manage-trips'
						element={
							<PrivateRoute>
								<ManageTrips />
							</PrivateRoute>
						}
					/>
					<Route
						path='manage-bookings'
						element={
							<PrivateRoute>
								<ManageBookings />
							</PrivateRoute>
						}
					/>
				</Route>
				<Route path='search' element={<Search />} />
			</Routes>
		</div>
	);
}

export default App;
