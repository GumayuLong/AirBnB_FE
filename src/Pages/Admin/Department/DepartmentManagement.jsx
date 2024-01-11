import React, { Fragment, useContext, useEffect, useState } from "react";
import { Button, Popover, Table, notification } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { departmentService } from "../../../services/departmentService";
import "../../../scss/styling.scss";
import { loadingContext } from "../../../contexts/LoadingContext/LoadingContext";

export default function DepartmentManagement() {
	const [departmentList, setDepartmentList] = useState();
	const [_, setLoadingContext] = useContext(loadingContext);
	const navigate = useNavigate();

	useEffect(() => {
		fetchDepartmentList();
	}, []);

	const fetchDepartmentList = async () => {
		setLoadingContext({ isLoading: true });
        await departmentService.fetchDepartmentApi().then((result) => {
            setDepartmentList(result.data);
        }).catch((err) => console.log(err))
		setLoadingContext({ isLoading: false });
	};

	const columns = [
		{
			title: "ID",
			dataIndex: "id",
			render: (text, object) => <>{object.id}</>,
		},
		{
			title: "Hình ảnh",
			dataIndex: "hinh_anh",
			render: (text, object) => <img src={object.hinh_anh} height={120} />,
		},
		{
			title: "Tên phòng",
			dataIndex: "ten_phong",
			sorter: (a, b) => {
				let tenPhong1 = a.ten_phong.toLowerCase().trim();
				let tenPhong2 = b.ten_phong.toLowerCase().trim();
				if (tenPhong1 > tenPhong2) {
					return 1;
				}
				return -1;
			},
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "Mô tả",
			dataIndex: "mo_ta",
			render: (text, object) => (
				<Fragment>
					{object.mo_ta.length > 200
						? object.mo_ta.substr(0, 200) + "..."
						: object.mo_ta}
				</Fragment>
			),
			width: "30%",
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
							to={`/admin/department/edit/${object.id}`}
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
			"Bạn có chắc muốn xóa phòng thuê " + object.ten_phong + "?"
		);

		if (!confirm) return;
		try {
			await departmentService.fetchDeleteDepartmentApi(object.id);
			notification.success({
				message: "Xóa phòng thuê thành công",
				placement: "bottomRight",
			});

			await departmentService.fetchDepartmentApi().then((result) => {
                setDepartmentList(result.data);
            }).catch((err) => console.log(err));
		} catch (error) {
			notification.error({
				message: "Xóa phòng thuê thất bại",
				placement: "bottomRight",
			});
		}
	};

	return (
		<React.Fragment>
			<div className="d-flex align-items-center justify-content-between">
				<h3>Danh sách phòng thuê</h3>
				<Button
					onClick={handleAdd}
					className="d-flex align-items-center justify-content-center"
				>
					<FontAwesomeIcon icon={faPlus} className="mr-2" />
					<span style={{ fontSize: 16 }}>Thêm phòng thuê</span>
				</Button>
			</div>

			<Table
				rowKey={"id"}
				columns={columns}
				dataSource={departmentList}
				onChange={onChange}
			/>
		</React.Fragment>
	);
}
