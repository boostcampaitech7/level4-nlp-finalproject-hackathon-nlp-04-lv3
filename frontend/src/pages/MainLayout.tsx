import { Outlet } from 'react-router'
import { Header, Sidebar } from '../components'
import Footer from 'components/Footer'

const MainLayout = () => {
  return (
    <div className="relative flex min-h-screen min-w-[1440px] flex-col">
      <Header />
      <Sidebar />
      <div className="h-fit pt-[126px]">
        <Outlet />
        <Footer />
      </div>
    </div>
  )
}

export default MainLayout
