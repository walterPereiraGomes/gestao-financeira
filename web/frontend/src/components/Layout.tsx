import { Outlet } from 'react-router-dom';
import Header from '@components/Header';


export function Layout() {
  return (
    <div className="min-h-[100vh]">
      <Header />
        <Outlet />
    </div>
  );
}

export default Layout;

