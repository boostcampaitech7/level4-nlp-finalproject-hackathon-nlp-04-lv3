import { useState } from 'react'

const useIsAuthenticated = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  return { isAuthenticated, setIsAuthenticated }
}

export default useIsAuthenticated
