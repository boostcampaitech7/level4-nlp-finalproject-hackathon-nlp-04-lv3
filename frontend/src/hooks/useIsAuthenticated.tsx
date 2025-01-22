import { useState } from 'react'

const useIsAuthenticated = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  return { isAuthenticated, setIsAuthenticated }
}

export default useIsAuthenticated
