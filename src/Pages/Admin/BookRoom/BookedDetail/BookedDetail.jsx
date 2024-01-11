import { Col, Form, Input, Row } from "antd";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { loadingContext } from "../../../../contexts/LoadingContext/LoadingContext";
import { bookRoomService } from "../../../../services/bookRoomService";
import { departmentService } from "../../../../services/departmentService";
import { userService } from "../../../../services/userService";

export default function BookedDetail() {
	const navigate = useNavigate();
	const [detail, setDetail] = useState({});
	const [room, setRoom] = useState({});
	const [user, setUser] = useState({});
	const [_, setLoadingContext] = useContext(loadingContext);
	const params = useParams();

	useEffect(() => {
		fetchBookedDetail();
	}, []);

	const fetchBookedDetail = async () => {
		setLoadingContext({ isLoading: true });
        await bookRoomService.bookRoomDetailApi(params.id).then((result) => {
            setDetail(result.data);
        }).catch((err) => {
            console.log(err)
        })
		setLoadingContext({ isLoading: false });
	};

	useEffect(() => {
		if (detail.ma_phong) {
			fetchDepartmentDetail(detail.ma_phong);
		}
	}, [detail.ma_phong]);

	//Lấy tên phòng theo mã phòng
	const fetchDepartmentDetail = async (ma_phong) => {
        await departmentService.departmentDetailApi(ma_phong).then((result) => {
            setRoom(result.data);
        }).catch((err) => console.log(err))
	};

	useEffect(() => {
		if (detail.ma_nguoi_dat) {
			fetchUserDetail(detail.ma_nguoi_dat);
		}
	}, [detail.ma_nguoi_dat]);

	//Lấy tên người dùng theo mã người dùng
	const fetchUserDetail = async (ma_nguoi_dat) => {
        await userService.fetchUserDetailApi(ma_nguoi_dat).then((result) => {
            setUser(result.data);
        })
	};

	return (
		<Fragment>
			<h4>Chi tiết đặt phòng</h4>
			<Form
				labelCol={{
					span: 10,
				}}
				wrapperCol={{
					span: 100,
				}}
				layout="vertical"
				style={{
					maxWidth: 1000,
				}}
			>
				<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
					<Col className="gutter-row" span={12}>
						<Form.Item label="Tên phòng">
							<Input
								size="large"
								name="ma_phong"
								value={room.ten_phong}
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={12}>
						<Form.Item label="Ngày đến">
							<Input
								size="large"
								name="ngay_den"
								value={dayjs(detail.ngay_den).format(
									"DD/MM/YYYY"
								)}
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={12}>
						<Form.Item label="Ngày đi">
							<Input
								size="large"
								name="ngay_di"
								value={dayjs(detail.ngay_di).format(
									"DD/MM/YYYY"
								)}
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={12}>
						<Form.Item label="Khách đặt">
							<Input
								size="large"
								name="ma_nguoi_dat"
								value={user.full_name}
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={12}>
						<Form.Item label="Số lượng khách">
							<Input
								size="large"
								name="so_luong_khach"
								value={detail.so_luong_khach}
							/>
						</Form.Item>
					</Col>
				</Row>
				<div className="d-flex justify-content-end">
					<button
						type="submit"
						className="btn btn-outline-primary"
						onClick={() => navigate("/admin/booked")}
					>
						Trở lại
					</button>
				</div>
			</Form>
		</Fragment>
	);
}
