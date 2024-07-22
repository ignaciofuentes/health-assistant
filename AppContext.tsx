// AppContext.js
import React, { createContext, useContext } from "react";

// Create a Context with an initial value
const AppContext = createContext({
  handleFunction: () => {}, // Default to an empty function
});

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children, value }) => {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
