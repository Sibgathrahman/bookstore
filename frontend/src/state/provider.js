import React from "react";
import { createContext, useContext, useReducer } from "react";

// Create a context for global state
export const Context = createContext(null);

// GlobalState component to provide the global state to the entire app
export const GlobalState = ({ reducer, initialState, children }) => {
    return (
        <Context.Provider value={useReducer(reducer, initialState)}>
            {children}
        </Context.Provider>
    )
}

// Custom hook to access the global state
export const useGlobalState = () => useContext(Context);
