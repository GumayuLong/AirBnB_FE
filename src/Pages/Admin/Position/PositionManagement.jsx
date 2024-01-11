import React, { useContext, useEffect, useState } from "react";
import { Button, Popover, Table, notification } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import "../../../scss/styling.scss";
import { loadingContext } from "../../../contexts/LoadingContext/LoadingContext";
import { positionService } from "../../../services/positionService";

export default function PositionManagement() {
	const [positionList, setPositionList] = useState();
	const [_, setLoadingContext] = useContext(loadingContext);
	const navigate = useNavigate();

	useEffect(() => {
		fetchPositionList();
	}, []);

	const fetchPositionList = async () => {
		setLoadingContext({ isLoading: true });
		await positionService.fetchPositionApi()
			.then((result) => {
				setPositionList(result.data);
			})
			.catch((err) => console.log(err));
		setLoadingContext({ isLoading: false });
	};

	const columns = [
		{
			title: "ID",
			dataIndex: "id",
			render: (text, object) => <>{object.id}</>,
			width: 50,
		},
		{
			title: "Hình ảnh",
			dataIndex: "hinh_anh",
			render: (text, object) => <img src={object.hinh_anh} width={100} />,
		},
		{
			title: "Vị trí",
			dataIndex: "ten_vi_tri",
			sorter: (a, b) => {
				let tenViTri1 = a.ten_vi_tri.toLowerCase().trim();
				let tenViTri2 = b.ten_vi_tri.toLowerCase().trim();
				if (tenViTri1 > tenViTri2) {
					return 1;
				}
				return -1;
			},
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "Tỉnh thành",
			dataIndex: "tinh_thanh",
			sorter: (a, b) => {
				let tinhThanh1 = a.tinh_thanh.toLowerCase().trim();
				let tinhThanh2 = b.tinh_thanh.toLowerCase().trim();
				if (tinhThanh1 > tinhThanh2) {
					return 1;
				}
				return -1;
			},
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "Quốc gia",
			dataIndex: "quoc_gia",
			sorter: (a, b) => {
				let tenViTri1 = a.ten_vi_tri.toLowerCase().trim();
				let tenViTri2 = b.ten_vi_tri.toLowerCase().trim();
				if (tenViTri1 > tenViTri2) {
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
							to={`/admin/position/edit/${object.id}`}
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
							onClick={() => handleDeletePosition(object)}
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

	const handleDeletePosition = async (object) => {
		const confirm = window.confirm(
			"Bạn có chắc muốn xóa vị trí " + object.ten_vi_tri + "?"
		);

		if (!confirm) {
			return;
		} else {
			try {
				await positionService
					.fetchDeletePositionApi(object.id)
					.then((result) => {
						console.log(result.data);
						notification.success({
							message: "Xóa vị trí thành công",
							placement: "bottomRight",
						});
					})
					.catch((err) => {
						notification.error({
							message: `${err.response.data}`,
							placement: "bottomRight",
						});
					});

				await positionService.fetchPositionApi()
					.then((result) => {
						setPositionList(result.data);
					})
					.catch((err) => console.log(err));
			} catch (error) {
				notification.error({
					message: "Xóa vị trí thất bại",
					placement: "bottomRight",
				});
			}
		}
	};

	return (
		<React.Fragment>
			<div className="d-flex align-items-center justify-content-between">
				<h3>Danh sách vị trí</h3>
				<Button
					onClick={handleAdd}
					className="d-flex align-items-center justify-content-center"
				>
					<FontAwesomeIcon icon={faPlus} className="mr-2" />
					<span style={{ fontSize: 16 }}>Thêm vị trí</span>
				</Button>
			</div>

			<Table
				rowKey={"id"}
				columns={columns}
				dataSource={positionList}
				onChange={onChange}
			/>
		</React.Fragment>
	);
}
