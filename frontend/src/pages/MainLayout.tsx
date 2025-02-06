import { Outlet } from 'react-router'
import { Header, Sidebar } from '../components'

const MainLayout = () => {
  return (
    <div className="relative flex min-h-screen min-w-[1440px] flex-col">
      <Header />
      <Sidebar />
      <div className="pt-[126px]">
        <Outlet />
      </div>
      <footer />
    </div>
  )
}

export default MainLayout
