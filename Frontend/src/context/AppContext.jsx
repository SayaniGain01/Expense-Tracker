import { createContext, useState ,useEffect} from "react";
import { fetchUserInfo } from "../service/profile";


export const AppContext = createContext();

export default function AppContextProvider({ children }) {
  const [loginStatus, setLoginStatus] = useState(false);
  const [user, setUser] = useState({});
  useEffect(() => {
    fetchUserInfo().then((data) => {
      setUser(data);
      console.log("from context",data)
      setLoginStatus(true)
    }).catch((err)=>{
      console.log(err)
    });
  }, [loginStatus]);
  return (
    <AppContext.Provider
      value={{
        loginStatus,
        setLoginStatus,
        user,
        setUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
