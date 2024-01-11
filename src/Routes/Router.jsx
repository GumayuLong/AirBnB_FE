import React from 'react'
import { useRoutes } from 'react-router-dom';
import HomeLayout from '../Layouts/HomeLayout/HomeLayout';
import Login from '../Pages/Login/Login';
import Signup from '../Pages/Signup/Signup';
import PersonalInfo from '../Pages/Personalinfo/PersonalInfo';
import Home from '../Pages/Home/Home';
import RoomDetail from '../Pages/RoomDetail/RoomDetail';
import AdminLayout from '../Layouts/AdminLayout/AdminLayout';
import UserManagement from '../Pages/Admin/User/UserManagement';
import CreateUser from '../Pages/Admin/User/CreateUser/CreateUser';
import EditUser from '../Pages/Admin/User/EditUser/EditUser';
import PositionManagement from '../Pages/Admin/Position/PositionManagement';
import CreatePosition from '../Pages/Admin/Position/CreatePosition/CreatePosition';
import EditPosition from '../Pages/Admin/Position/EditPosition/EditPosition';
import DepartmentManagement from '../Pages/Admin/Department/DepartmentManagement';
import CreateDepartment from '../Pages/Admin/Department/CreateDepartment.jsx/CreateDepartment';
import EditDepartment from '../Pages/Admin/Department/EditDepartment/EditDepartment';
import BookedManagement from '../Pages/Admin/BookRoom/BookedManagement';
import BookedDetail from '../Pages/Admin/BookRoom/BookedDetail/BookedDetail';

export default function Router() {
  const routing = useRoutes([
		{
			path: "/",
			element: <HomeLayout />,
			children: [
				{
					path: "/",
					element: <Home />,
				},
				{
					path: "/detail/:id",
					element: <RoomDetail />,
				},
				{
					path: "/login",
					element: <Login />,
				},
				{
					path: "/signup",
					element: <Signup />,
				},
				{
					path: "/personal-info/:id",
					element: <PersonalInfo />,
				},
			],
		},

		{
			path: "/admin",
			element: <AdminLayout />,
			children: [
				{
					path: "/admin/user",
					element: <UserManagement />,
				},
				{
					path: "/admin/user/create",
					element: <CreateUser />,
				},
				{
					path: "/admin/user/edit/:userId",
					element: <EditUser />,
				},
				{
					path: "/admin/position",
					element: <PositionManagement />,
				},
				{
					path: "/admin/position/create",
					element: <CreatePosition />,
				},
				{
					path: "/admin/position/edit/:positionId",
					element: <EditPosition />,
				},
				{
					path: "/admin/department",
					element: <DepartmentManagement />,
				},
				{
					path: "/admin/department/create",
					element: <CreateDepartment />,
				},
				{
					path: "/admin/department/edit/:departmentId",
					element: <EditDepartment />,
				},
				{
					path: "/admin/booked",
					element: <BookedManagement />,
				},
				{
					path: "/admin/booked/detail/:id",
					element: <BookedDetail />,
				},
			],
		},
  ]);
  return routing;
}
