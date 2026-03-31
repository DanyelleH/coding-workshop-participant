import { useState } from 'react'
import reactLogo from '/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NavigationBar from './components/NavigationBar'
import Login from './pages/Login'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('user');

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('user');
  };

  const handleNavigation = (page) => {
    console.log('Navigating to:', page);
  };

  return (
    <>
      {isLoggedIn ? (
        <>
          <NavigationBar userRole={userRole} onLogout={handleLogout} onNavigate={handleNavigation} />
          {/* Main content goes here */}
        </>
      ) : (
        <Login />
      )}
    </>
  )
}

export default App
