import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ROUTE_TITLES = {
  '/login': 'Đăng nhập',
  '/admin/users': 'Quản lý User',
  '/manager/dashboard': 'Trang chủ quản lý',
  '/profile': 'Hồ sơ cá nhân',
  '/settings': 'Cài đặt hệ thống',
};

const DEFAULT_TITLE = 'Hệ Thống Quản Lý';

export default function DynamicTitle() {
  const location = useLocation();

  useEffect(() => {
    const currentTitle = ROUTE_TITLES[location.pathname] || DEFAULT_TITLE;
    document.title = `${currentTitle} `;
  }, [location.pathname]);

  return null;
}