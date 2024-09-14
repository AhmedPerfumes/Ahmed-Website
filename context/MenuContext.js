import React, { createContext, useContext, useEffect, useState } from 'react';

const MenuContext = createContext();

export function MenuProvider({ children }) {
  const [categoriesSubCategories, setCategoriesSubCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getCategoriesSubCategories() {
    
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/productCategories`, {
            method: 'GET',
          })
     
          if (!response.ok) {
            throw new Error('Failed to submit the data. Please try again.');
          }
     
          // Handle response if necessary
          const data = await response.json();
          if(data.length > 0) {
            setError(null);
            setCategoriesSubCategories(data);
          } else {
            setCategoriesSubCategories(null);
            setError(data);
          }
          // console.log(data);
        } catch (error) {
          // Capture the error message to display to the user
          setError(error.message);
          setIsLoading(false);
          console.error(error);
        } finally {
            setError(null);
            setIsLoading(false);
        }
      }

      getCategoriesSubCategories();
  }, []);

  return (
    <MenuContext.Provider value={{ categoriesSubCategories, isLoading, error }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  return useContext(MenuContext);
}