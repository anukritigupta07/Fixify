import React, { createContext, useState } from 'react'
import { useEffect } from 'react';
import axios from 'axios';
export const UserDataContext = createContext()


const UserContext = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [address, setAddress] = useState("");
    const [locationType, setLocationType] = useState("live");
   
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/users/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setUser({
                    _id: response.data._id,
                    email: response.data.email || "",
                    fullname: {
                        firstname: response.data.fullname.firstname || "",
                        lastname: response.data.fullname.lastname || "",
                    },
                    phone: response.data.phone || "",
                });
            } catch (err) {
                console.error("Error fetching user:", err);
                localStorage.removeItem("token");
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []);



    return (
        <div>
            <UserDataContext.Provider value={{ user, setUser, isLoading, address, setAddress, locationType, setLocationType }}>
                {children}
            </UserDataContext.Provider>
        </div>
    )
}

export default UserContext