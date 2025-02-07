// Component Imports
import Login from '@views/Login'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import Navbar from '@/@layouts/components/vertical/Navbar'


const LoginPage = () => {
  // Vars
  const mode = getServerMode()

  return(
    <Login mode={mode} />
  ) 
}

export default LoginPage
