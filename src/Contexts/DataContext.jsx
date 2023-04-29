import React, { createContext, useContext } from 'react';
const Data = createContext();

export const useData = () => useContext(Data);

const DataProvider = ({ children }) => {
	const [searchTrips, setSearchTrips] = React.useState([]);
	// const [user, setUser] = React.useState(null);
	return <Data.Provider value={{
		searchTrips,
		setSearchTrips
	}}>{children}</Data.Provider>
};

export default DataProvider;
