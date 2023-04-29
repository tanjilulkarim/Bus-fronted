import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../Contexts/AdminContext';
import styles from './style.module.css';

const UserRegister = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	useEffect(() => {
		if (user.type !== 'admin') {
			Swal.fire({
				title: 'Oops...',
				text: 'You are not authorized to view this page!',
				icon: 'error',
				confirmButtonText: 'okay',
			});
			navigate('/');
		}
	}, [user, navigate]);

	const handleLogin = e => {
		e.preventDefault();
		fetch(
      "https://bus-counter-backend-production.up.railway.app/users/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: e.target.email.value,
          password: e.target.password.value,
          type: e.target.role.value,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        Swal.fire({
          title: "Registration Successful!",
          text: "User successfully registered! Now you can login to continue.",
          icon: "success",
        });
      });
	};
	return (
		<div className={styles.container}>
			<div>
				<Link to='/'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-5 w-5'
						viewBox='0 0 20 20'
						fill='currentColor'>
						<path
							fillRule='evenodd'
							d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
							clipRule='evenodd'
						/>
					</svg>
					Back Home
				</Link>
				<h3
					style={{
						textAlign: 'center',
						margin: '20px 0',
						textTransform: 'uppercase',
					}}>
					Register an User
				</h3>
				<form className={styles.form} onSubmit={handleLogin}>
					<div>
						<label htmlFor='email'>Email *</label>
						<input
							type='email'
							placeholder='Enter Your Email'
							name='email'
							required
						/>
					</div>
					<div>
						<label htmlFor='password'>Password *</label>
						<input
							type='password'
							placeholder='Enter Your Password'
							name='password'
							required
						/>
					</div>
					<div>
						<label htmlFor='role'>Role *</label>
						<select name='role' className='form-control' required>
							<option value='user'>User</option>
							<option value='admin'>Admin</option>
						</select>
					</div>
					<input type='submit' value='Login' />
				</form>
			</div>
		</div>
	);
};

export default UserRegister;
