import { Link, Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div>
      <h1>Layout</h1>
      <nav style={{ borderBottom: '1px solid', paddingBottom: '1rem'}}>
        <Link to='.'>Home</Link> | 
        <Link to='login'> Login</Link> | 
        <Link to='register'> Register</Link> | 
        <Link to='profile'> Profile</Link>
      </nav>
      
      <Outlet />
    </div>
  )
}

export default Layout