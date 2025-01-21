import { Outlet } from 'react-router'
import { Header } from '../components'
import { ReactNode } from 'react'

interface MainLayoutProps {
  children?: ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div>
      <Header />
      <main>{children || <Outlet />}</main>
      <footer />
    </div>
  )
}

export default MainLayout
