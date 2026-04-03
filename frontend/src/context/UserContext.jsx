import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

// 1. Create the Context
export const UserContext = createContext();

// 2. Create a Provider Component
export const UserProvider = ({ children }) => {
    const { user } = useAuth();
    const [role, setRole] = useState('')
    const [userData, setUserData] = useState(null);
    const getRole = async () => {
        if (!user) return
        axios.get(`${import.meta.env.VITE_API_URL}/api/auth/role/${user?.id}`, {
            headers: {
                Authorization: `Bearer ${user?.access_token}`
            }
        }).then((res) => { setRole(res.data.data.role || 'USER') }).catch((err) => {
            console.log(err);
            setRole('USER')
        })
    }
    useEffect(() => {
        getRole()
    }, [user])

    return (
        <UserContext.Provider value={{ userData, user, role }}>
            {children}
        </UserContext.Provider>
    );
};
