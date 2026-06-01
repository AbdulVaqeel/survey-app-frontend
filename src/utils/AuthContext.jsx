// import { createContext, useContext, useState, useCallback } from 'react'
// import api from '../utils/api'

// const AuthContext = createContext(null)

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(() => {
//     const stored = localStorage.getItem('user')
//     return stored ? JSON.parse(stored) : null
//   })

//   const login = useCallback(async (username, password) => {
//     const { data } = await api.post('http://localhost:8000/auth/login', { username, password })
//     localStorage.setItem('token', data.access_token)
//     localStorage.setItem('user', JSON.stringify(data.user))
//     setUser(data.user)
//     return data.user
//   }, [])

//   const logout = useCallback(() => {
//     localStorage.removeItem('token')
//     localStorage.removeItem('user')
//     setUser(null)
//   }, [])

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuth = () => useContext(AuthContext)


import { createContext, useState, useCallback } from 'react'
import api from './api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  const login = useCallback(async (username, password) => {
    const { data } = await api.post('/auth/login', { username, password })
    localStorage.setItem('token', data.access_token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}