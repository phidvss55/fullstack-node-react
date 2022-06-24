import { Link, Outlet } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { useLogoutMutation } from '../generated/graphql';
import JWTManager from '../utils/jwt'

function Layout() {
  const { isAuthenticated, logoutClient} = useAuthContext();

  const [logoutServer, _] = useLogoutMutation();

  const logout = async () => {
    logoutClient()
    await logoutServer({ variables: { userId: JWTManager.getUserId()?.toString() as string } });
  };

  return (
    <div>
      <h1>Layout</h1>
      <nav style={{ borderBottom: '1px solid', paddingBottom: '1rem'}}>
        <Link to='.'>Home</Link> | 
        <Link to='login'> Login</Link> | 
        <Link to='register'> Register</Link> 

        { isAuthenticated &&
          <>
            <Link to='profile'> | Profile </Link> | 
            <button type="button" onClick={logout}> Logout </button>
          </> 
        }
      </nav>
      
      <Outlet />
    </div>
  )
}

export default Layout