import React, { useState } from "react";
import {
	DesktopOutlined,
	FileOutlined,
	PieChartOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";

import "../../scss/styling.scss";
import { setUserInfoAction } from "../../store/actions/userAction";

const { Header, Content, Footer, Sider } = Layout;

export default function AdminLayout() {
	const userState = useSelector((state) => state.userReducer.userInfo);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem("USER_INFO");
		dispatch(setUserInfoAction(null));
		navigate("/");
	};

	const renderContent = () => {
		if (userState) {
			return (
				<div
					className="d-flex align-items-center justify-content-end"
					style={{ borderBottom: "1px solid #343a40", height: 50 }}
				>
					<span className="text-dark">
						Hello {userState.data.full_name}
					</span>
					<button
						onClick={handleLogout}
						className="ml-3 btn btn-warning"
					>
						LOGOUT
					</button>
					<button onClick={() => navigate("/")} className="mx-3 btn ">
						<FontAwesomeIcon
							icon={faRightToBracket}
							className="text-dark"
						/>
					</button>
				</div>
			);
		}
	};

	const [collapsed, setCollapsed] = useState(false);
	const {
		token: { colorBgContainer },
	} = theme.useToken();

	return (
		<Layout
			style={{
				minHeight: "100vh",
				overflow: "hidden",
			}}
		>
			<Sider
				collapsible
				collapsed={collapsed}
				onCollapse={(value) => setCollapsed(value)}
			>
				<div className="demo-logo-vertical" />
				<Menu
					className="nav-admin"
					theme="dark"
					defaultSelectedKeys={["1"]}
					mode="inline"
				>
					<Menu.Item key="1" icon={<UserOutlined />}>
						<Link to="/admin/user">Người dùng</Link>
					</Menu.Item>
					<Menu.Item key="2" icon={<PieChartOutlined />}>
						<Link to="/admin/position">Thông tin vị trí</Link>
					</Menu.Item>
					<Menu.Item key="3" icon={<DesktopOutlined />}>
						<Link to="/admin/department">Thông tin phòng</Link>
					</Menu.Item>
					<Menu.Item key="4" icon={<FileOutlined />}>
						<Link to="/admin/booked">Quản lý đặt phòng</Link>
					</Menu.Item>
				</Menu>
			</Sider>
			<Layout style={{ height: "100vh" }}>
				<Header
					style={{
						padding: 0,
						background: colorBgContainer,
					}}
				>
					{renderContent()}
				</Header>
				<Content style={{ margin: "0px 16px", overflowY: "scroll" }}>
					<div
						style={{
							padding: 24,
							minHeight: 360,
							background: colorBgContainer,
						}}
					>
						<Outlet />
					</div>
				</Content>
				<Footer
					style={{
						textAlign: "center",
					}}
				>
					Ant Design ©2023 Created by Ant UED
				</Footer>
			</Layout>
		</Layout>
	);
}
