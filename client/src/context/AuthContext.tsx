import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react"
import JWTManager from '../utils/jwt'

interface IAuthContext {
  isAuthenticated: boolean
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>
  checkAuth: () => Promise<void> // get inside jwt -> check authen
  logoutClient: () => void
}

const defaultIsAuthenticated = false;

export const AuthContext = createContext<IAuthContext>({
  isAuthenticated: defaultIsAuthenticated,
  setIsAuthenticated: () => {},
  checkAuth: () => Promise.resolve(), // return a new promise void
  logoutClient: () => {}
})

export const useAuthContext = () => {
  return useContext(AuthContext)
}

// previous state
const AuthContextProvider = (props: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(defaultIsAuthenticated)

  const checkAuth = async () => { 
    const token = JWTManager.getToken()

    if (token) {
      setIsAuthenticated(true);
    } else {
      const success = await JWTManager.getRefreshToken()
      if (success) {
        setIsAuthenticated(true)
      }
    }
  }

  const logoutClient = () => {
    JWTManager.clearToken();
    setIsAuthenticated(false);
  }

  const authContextData = {
    isAuthenticated, 
    setIsAuthenticated,
    checkAuth, 
    logoutClient
  }

  return <AuthContext.Provider value={authContextData}>
    { props.children }
  </AuthContext.Provider>
}

export default AuthContextProvider;