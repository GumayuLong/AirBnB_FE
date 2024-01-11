import React, { useContext, useEffect, useState } from "react";
import { Button, Popover, Table, notification } from "antd";
import Search from "antd/es/input/Search";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import "../../../scss/styling.scss";
import { loadingContext } from "../../../contexts/LoadingContext/LoadingContext";
import { userService } from "../../../services/userService";

export default function UserManagement() {
	const [userList, setUserList] = useState();
	const [_, setLoadingContext] = useContext(loadingContext);
	const navigate = useNavigate();

	useEffect(() => {
		fetchUserList();
	}, []);

	const fetchUserList = async (full_name = "") => {
		setLoadingContext({ isLoading: true });
		if (full_name.trim() !== "") {
            const result = await userService.fetchSearchUserApi(full_name)
            setUserList(result.data);
		} else {
            await userService.fetchUserListApi().then((result) => {
                setUserList(result.data);
            }).catch((err) => {console.log(err)});
		}
		setLoadingContext({ isLoading: false });
	};

	const columns = [
		{
			title: "ID",
			dataIndex: "ID",
			render: (text, object) => <>{object.id}</>,
		},
		{
			title: "Avatar",
			dataIndex: "avatar",
			render: (text, object) => <img src={object.avatar} width={60} />,
		},
		{
			title: "Họ và tên",
			dataIndex: "full_name",
			sorter: (a, b) => {
				let name1 = a.full_name.toLowerCase().trim();
				let name2 = b.full_name.toLowerCase().trim();
				if (name1 > name2) {
					return 1;
				}
				return -1;
			},
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "Email",
			dataIndex: "email",
			render: (text, object) => <>{object.email}</>,
		},
		{
			title: "Giới tính",
			dataIndex: "gender",
			render: (text, object) => <>{object.gender ? "Nam" : "Nữ"}</>,
		},
		{
			title: "Ngày sinh",
			dataIndex: "birthday",
			render: (text, object) => <>{object.birth_day}</>,
		},
		{
			title: "Nhóm quyền",
			dataIndex: "role",
			render: (text, object) => (
				<>{object.role === "ADMIN" ? "Quản trị" : "Khách hàng"}</>
			),
			sorter: (a, b) => {
				let role1 = a.role.toLowerCase().trim();
				let role2 = b.role.toLowerCase().trim();
				if (role1 > role2) {
					return 1;
				}
				return -1;
			},
			sortDirections: ["descend", "ascend"],
		},

		{
			title: "Thao tác",
			dataIndex: "id",
			width: 150,
			render: (text, object) => (
				<div className="btn-action">
					<Popover placement="bottom" content="Sửa">
						<NavLink
							key={1}
							className="mb-1"
							to={`/admin/user/edit/${object.id}`}
						>
							<button className="btn-icon text-info">
								<FontAwesomeIcon
									className="icon-size"
									icon={faPen}
								/>
							</button>
						</NavLink>
					</Popover>

					<Popover placement="bottom" content="Xóa">
						<button
							className="btn-icon text-danger"
							onClick={() => handleDeleteUser(object)}
						>
							<FontAwesomeIcon
								className="icon-size"
								icon={faTrash}
							/>
						</button>
					</Popover>
				</div>
			),
		},
	];

	const onChange = (pagination, filters, sorter, extra) => {
		console.log("params", pagination, filters, sorter, extra);
	};

	const handleAdd = () => {
		navigate("create");
	};

	const handleDeleteUser = async (object) => {
		const confirm = window.confirm(
			"Bạn có chắc muốn xóa người dùng " + object.full_name + "?"
		);

		if (!confirm) return;
		try {
            await userService.fetchDeleteUserApi(object.id).then((result) => {
                notification.success({
					message: "Xóa người dùng thành công",
					placement: "bottomRight",
				});
            }).catch((err) => console.log(err));
            await userService.fetchUserListApi().then((result) => {
                setUserList(result.data);
            }).catch((err) => console.log(err));
		} catch (error) {
			notification.error({
				message: "Xóa người dùng thất bại",
				placement: "bottomRight",
			});
		}
	};

	const onSearch = (value) => {
		fetchUserList(value);
	};

	return (
		<React.Fragment>
			<div className="d-flex align-items-center justify-content-between">
				<h3>Danh sách người dùng</h3>
				<Button
					onClick={handleAdd}
					className="d-flex align-items-center justify-content-center"
				>
					<FontAwesomeIcon icon={faPlus} className="mr-2" />
					<span style={{ fontSize: 16 }}>Thêm người dùng</span>
				</Button>
			</div>

			<Search
				placeholder="Nhập tên người dùng..."
				onSearch={onSearch}
				enterButton
				size="large"
				className="my-2"
			/>

			<Table
				rowKey={"id"}
				columns={columns}
				dataSource={userList}
				onChange={onChange}
			/>
		</React.Fragment>
	);
}
