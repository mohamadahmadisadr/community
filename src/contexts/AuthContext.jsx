import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const AUTHDATA = "authData";

export const AuthProvider = ({children}) => {

        const [authData, setAuthData] = useState(()=> {
            const storedData = localStorage.getItem(AUTHDATA);

            try{
                return storedData ? JSON.parse(storedData) : null;
            }catch(e){
                localStorage.removeItem(AUTHDATA);
                return null
            }
        });

        useEffect(()=>{

                if (authData){
                        localStorage.setItem(AUTHDATA, JSON.stringify(authData));
                }else{
                    localStorage.removeItem(AUTHDATA);

                }

        },[authData]);


        const login = (data) => {
                setAuthData(data)
        }


        const logOut = () => {
            setAuthData(null)
        }


        const value = {
            authData,
            login,
            logOut,
            isAuthenticated: !!authData
        }


        return <AuthContext.Provider value={value}> {children}</AuthContext.Provider>
}


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined || context === null){
     throw new Error('useAuth must be used within an AuthProvider');   
    }
    return context;
}