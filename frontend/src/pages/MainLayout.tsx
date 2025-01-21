import { Outlet } from 'react-router'
import { Header } from '../components'

const MainLayout = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <footer />
    </div>
  )
}

export default MainLayout
