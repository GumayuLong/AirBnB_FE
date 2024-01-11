import React, { useContext, useEffect, useState } from "react";
import { Popover, Table } from "antd";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import "../../../scss/styling.scss";
import { faFileLines } from "@fortawesome/free-regular-svg-icons";
import { loadingContext } from "../../../contexts/LoadingContext/LoadingContext";
import { bookRoomService } from "../../../services/bookRoomService";

export default function BookedManagement() {
	const [bookedList, setBookedList] = useState();
	const [_, setLoadingContext] = useContext(loadingContext);

	useEffect(() => {
		fetchBookedRoomList();
	}, []);

	//LIST ĐẶT PHÒNG
	const fetchBookedRoomList = async () => {
		setLoadingContext({ isLoading: true });
        await bookRoomService.fetchBookRoomApi().then((result) => {
            setBookedList(result.data);
        }).catch((err) => console.log(err));
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
			title: "Mã phòng",
			dataIndex: "ma_phong",
			sorter: (a, b) => {
				let maPhong1 = a.ma_phong.toLowerCase().trim();
				let maPhong2 = b.ma_phong.toLowerCase().trim();
				if (maPhong1 > maPhong2) {
					return 1;
				}
				return -1;
			},
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "Số lượng khách",
			dataIndex: "so_luong_khach",
			render: (text, object) => <>{object.so_luong_khach}</>,
		},
		{
			title: "Người dùng",
			dataIndex: "ma_nguoi_dat",
			render: (text, object) => <>{object.ma_nguoi_dat}</>,
		},
		{
			title: "Ngày đến",
			dataIndex: "ngay_den",
			render: (text, object) => (
				<>{dayjs(object.ngay_den).format("DD/MM/YYYY")}</>
			),
		},
		{
			title: "Ngày đi",
			dataIndex: "ngay_di",
			render: (text, object) => (
				<>{dayjs(object.ngay_di).format("DD/MM/YYYY")}</>
			),
		},
		{
			title: "Thao tác",
			dataIndex: "id",
			width: 150,
			render: (text, object) => (
				<div className="btn-action">
					<Popover placement="bottom" content="Xem chi tiết">
						<NavLink
							key={1}
							className="mb-1"
							to={`/admin/booked/detail/${object.id}`}
						>
							<button className="btn-icon text-primary">
								<FontAwesomeIcon
									className="icon-size"
									icon={faFileLines}
								/>
							</button>
						</NavLink>
					</Popover>
				</div>
			),
		},
	];

	const onChange = (pagination, filters, sorter, extra) => {
		console.log("params", pagination, filters, sorter, extra);
	};

	return (
		<React.Fragment>
			<div className="d-flex align-items-center justify-content-between">
				<h3>Danh sách đặt phòng</h3>
				{/* <Button
          onClick={handleAdd}
          className="d-flex align-items-center justify-content-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          <span style={{ fontSize: 16 }}>Thêm vị trí</span>
        </Button> */}
			</div>

			<Table
				rowKey={"id"}
				columns={columns}
				dataSource={bookedList}
				onChange={onChange}
			/>
		</React.Fragment>
	);
}
