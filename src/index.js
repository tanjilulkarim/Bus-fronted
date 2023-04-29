import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './Contexts/AdminContext';
import DataProvider from './Contexts/DataContext';

ReactDOM.render(
	<React.StrictMode>
		<AuthProvider>
			<DataProvider>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</DataProvider>
		</AuthProvider>
	</React.StrictMode>,
	document.getElementById('root')
);
