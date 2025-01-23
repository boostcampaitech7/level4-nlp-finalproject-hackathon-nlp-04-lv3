import { Outlet } from 'react-router'
import { Header, Sidebar } from '../components'

const MainLayout = () => {
  return (
    <div>
      <Header />
      <Sidebar />
      <main>
        <Outlet />
      </main>
      <footer />
    </div>
  )
}

export default MainLayout
