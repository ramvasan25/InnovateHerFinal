'use client'
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type Role = 'artist' | 'community' | null

interface RoleContextType {
  role: Role
  setRole: (role: Role) => void
  clearRole: () => void
}

const RoleContext = createContext<RoleContextType>({
  role: null,
  setRole: () => {},
  clearRole: () => {},
})

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('backstage_role') as Role
    if (saved === 'artist' || saved === 'community') {
      setRoleState(saved)
    }
    setLoaded(true)
  }, [])

  function setRole(r: Role) {
    setRoleState(r)
    if (r) localStorage.setItem('backstage_role', r)
  }

  function clearRole() {
    setRoleState(null)
    localStorage.removeItem('backstage_role')
  }

  return (
    <RoleContext.Provider value={{ role: loaded ? role : null, setRole, clearRole }}>
      {loaded ? children : (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-lg text-gray-400">Loading...</div>
        </div>
      )}
    </RoleContext.Provider>
  )
}

export function useRole() {
  return useContext(RoleContext)
}
