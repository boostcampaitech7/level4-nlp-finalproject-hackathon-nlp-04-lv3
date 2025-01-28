import { Outlet } from 'react-router'
import { Header, Sidebar } from '../components'

const MainLayout = () => {
  return (
    <div className="flex min-h-screen min-w-[1440px] flex-col">
      <Header />
      <Sidebar />
      <Outlet />
      <footer />
    </div>
  )
}

export default MainLayout
