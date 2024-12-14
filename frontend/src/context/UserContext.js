    import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user data from API or localStorage
    const fetchedUser = fetchUserDataFromAPI(); // Implement this function
    setUser(fetchedUser);
  }, []);

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
}
