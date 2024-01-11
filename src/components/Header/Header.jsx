import React, { useEffect, useState } from "react";
import "../../scss/header.scss";
import { Space, Select, Menu, DatePicker, InputNumber, Layout } from "antd";
import {
	SearchOutlined,
	UserOutlined,
	LogoutOutlined,
	LoginOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfoAction } from "../../store/actions/userAction";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faAirbnb } from "@fortawesome/free-brands-svg-icons";
import Axios from "axios";

const { RangePicker } = DatePicker;
const { Option } = Select;

const { Header } = Layout;

export default function HeaderHome() {
	const dispatch = useDispatch();
	const userState = useSelector((state) => state.userReducer.userInfo);
	const navigate = useNavigate();
	const [locateDetail, setLocateDetail] = useState([]);
	const [openKeys, setOpenKeys] = useState(["sub1"]);
	const rootSubmenuKeys = ["sub1"];

	const fetchLocateDetailApi = async () => {
		await Axios.get(`http://localhost:8080/api/vi-tri`).then((result) => {
      console.log(result.data)
      setLocateDetail(result.data);
    }).catch((err) => console.log(err));
	};

	useEffect(() => {
		fetchLocateDetailApi();
	}, []);

	const renderAdmin = () => {
		if (userState) {
			if (userState.data.role === "ADMIN") {
				return (
					<button
						className="btn-icon ml-2 admin"
						onClick={() => navigate("/admin/user")}
					>
						<FontAwesomeIcon icon={faArrowRightFromBracket} />
					</button>
				);
			}
		}
	};

	const renderContent = () => {
		if (!userState) {
			return (
				<>
					<button
						className="btn-custom-1 mr-2 in-1"
						onClick={() => navigate("/login")}
					>
						SIGN IN
					</button>

					<button
						className="btn-custom-1 in-2"
						onClick={() => navigate("/login")}
						style={{ display: "none" }}
					>
						<LoginOutlined />
					</button>

					<button
						className="btn-custom-2 in-1"
						onClick={() => navigate("/signup")}
					>
						REGISTER
					</button>
				</>
			);
		} else if (userState) {
			return (
				<div className="d-flex">
					<div className="dropdown" style={{ marginRight: "10px" }}>
						<button
							type="button"
							className="btn-custom-1 dropdown-toggle"
							data-toggle="dropdown"
							data-offset="0, 10"
							style={{ marginRight: "10px" }}
						>
							<UserOutlined />
						</button>
						<div className="dropdown-menu dropdown-menu-right">
							<button
								className="dropdown-item btn-custom-1"
								onClick={() => {
									navigate(
										`/personal-info/${userState.data.id}`
									);
								}}
							>
								<UserOutlined className="pr-2" />
								Trang cá nhân
							</button>
							<button
								onClick={handleLogout}
								className="dropdown-item btn-custom-1"
							>
								<LogoutOutlined className="pr-2" />
								Đăng xuất
							</button>
						</div>
					</div>
					{renderAdmin()}
				</div>
			);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("USER_INFO");
		dispatch(setUserInfoAction(null));
		navigate("/");
	};

	const renderLocateDetail = () => {
		return locateDetail.map((element) => {
			return (
				<Option
					key={element.id}
					value={element.id}
					label={element.tinh_thanh}
				>
					<Space>
						<span role="img"></span>
						{element.tinh_thanh}
					</Space>
				</Option>
			);
		});
	};

	function getItem(label, key, icon, children, type) {
		return {
			key,
			icon,
			children,
			label,
			type,
		};
	}

	const renderContentCenter = () => {
		const items1 = [
			getItem(
				"Địa Điểm | Thời Gian | Số Lượng Khách",
				"sub1",
				<SearchOutlined style={{ backgroundColor: "#ef4444" }} />,
				[
					getItem(
						<Select
							mode="multiple"
							style={{
								width: "100%",
							}}
							size="large"
							placeholder="Chọn địa điểm"
							onChange={handleChange}
							optionLabelProp="label"
						>
							${renderLocateDetail()}
						</Select>
					),
					getItem(
						<Space
							direction="vertical"
							size={12}
							style={{ width: "100%" }}
						>
							<RangePicker
								format={"DD-MM-YYYY"}
								size="large"
								style={{ width: "100%" }}
							/>
						</Space>
					),
					getItem(
						<InputNumber
							addonBefore={<UserOutlined />}
							placeholder="Số khách"
							min={1}
							max={10}
							onChange={onChange}
							size="large"
						/>
					),
				]
			),
		];

		return (
			<Menu
				mode="inline"
				onOpenChange={onOpenChange}
				style={{
					width: 480,
				}}
				items={items1}
			/>
		);
	};

	const onOpenChange = (keys) => {
		const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
		if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
			setOpenKeys(keys);
		} else {
			setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
		}
	};

	const handleChange = (value) => {};

	const onChange = (value) => {};

	return (
		<Layout className="layout">
			<Header style={{ height: "auto" }} className="my-3">
				<div className="d-flex align-items-center justify-content-between mx-auto">
					<div className="demo-logo">
						<a
							className="navbar-brand"
							href="/"
							style={{ color: "#ef4444" }}
						>
							<FontAwesomeIcon
								icon={faAirbnb}
								style={{ width: 28, height: 28 }}
							/>
							<span
								style={{
									fontSize: 26,
									paddingLeft: 5,
									fontWeight: "600",
								}}
							>
								airbnb
							</span>
						</a>
					</div>

					<div
						className="collapse d-flex justify-content-center navbar-collapse content-center"
						id="collapsibleNavId"
						style={{
							flexBasis: 0,
						}}
					>
						{renderContentCenter()}
					</div>

					<div className="header-rear d-flex justify-content-center">
						<Space>{renderContent()}</Space>
					</div>
				</div>
			</Header>
		</Layout>
	);
}
