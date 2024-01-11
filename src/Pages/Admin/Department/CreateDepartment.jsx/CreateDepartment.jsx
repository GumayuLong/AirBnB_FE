import {
	Col,
	Form,
	Input,
	InputNumber,
	Row,
	Select,
	Switch,
	notification,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useFormik } from "formik";
import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { positionService } from "../../../../services/positionService";
import { departmentService } from "../../../../services/departmentService";

export default function CreateDepartment() {
	const [state, setState] = useState({
		position: [],
	});
	const navigate = useNavigate();

	const formik = useFormik({
		initialValues: {
			ten_phong: "",
			khach: 0,
			phong_ngu: 0,
			giuong: 0,
			phong_tam: 0,
			mo_ta: "",
			gia_tien: 0,
			may_giat: false,
			ban_la: false,
			tivi: false,
			dieu_hoa: false,
			wifi: false,
			bep: false,
			do_xe: false,
			ho_boi: false,
			ban_ui: false,
			ma_vi_tri: 0,
			hinh_anh: "",
		},

		onSubmit: async (values) => {
			try {
				await departmentService.fetchCreateDepartmentApi(values).then((result) => {
                    notification.success({
						message: "Thêm phòng thuê thành công!",
						placement: "bottomRight",
					});
					navigate("/admin/department");
                }).catch((err) => console.log(err));
			} catch (error) {
				notification.error({
					message: `${error.response.data}`,
					placement: "bottomRight",
				});
			}
		},
	});

	useEffect(() => {
		fetchPositionList();
	}, []);

	const fetchPositionList = async () => {
		try {
			await positionService.fetchPositionApi().then((result) => {
                setState({ ...state, position: result.data });
            }).catch((err) => console.log(err))
		} catch (error) {
            console.log(error)
        }
	};

	const selectPosition = () => {
		return state.position?.map((element) => {
			return {
				label: element.ten_vi_tri,
				value: element.id,
			};
		});
	};

	const handleChangePosition = (value) => {
		formik.setFieldValue("ma_vi_tri", value);
	};

	const handleChangeValue = (name) => {
		return (value) => {
			formik.setFieldValue(name, value);
		};
	};

	return (
		<Fragment>
			<h4>Thêm phòng thuê</h4>
			<Form
				onSubmitCapture={formik.handleSubmit}
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
								name="ten_phong"
								onChange={formik.handleChange}
								placeholder="Tên phòng"
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={12}>
						<Form.Item label="Vị trí">
							<Select
								options={selectPosition()}
								size="large"
								placeholder="Chọn vị trí"
								onChange={handleChangePosition}
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={12}>
						<Form.Item label="Số khách">
							<InputNumber
								style={{ width: "100%" }}
								size="large"
								name="khach"
								onChange={handleChangeValue("khach")}
								placeholder="Số khách"
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={12}>
						<Form.Item label="Số phòng ngủ">
							<InputNumber
								style={{ width: "100%" }}
								size="large"
								name="phong_ngu"
								onChange={handleChangeValue("phong_ngu")}
								placeholder="Số phòng ngủ"
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={12}>
						<Form.Item label="Số giường">
							<InputNumber
								style={{ width: "100%" }}
								size="large"
								name="giuong"
								onChange={handleChangeValue("giuong")}
								placeholder="Số giường"
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={12}>
						<Form.Item label="Số phòng tắm">
							<InputNumber
								style={{ width: "100%" }}
								size="large"
								name="phong_tam"
								onChange={handleChangeValue("phong_tam")}
								placeholder="Số phòng tắm"
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={12}>
						<Form.Item label="Giá tiền">
							<InputNumber
								style={{ width: "100%" }}
								size="large"
								name="gia_tien"
								min={0}
								onChange={handleChangeValue("gia_tien")}
								placeholder="Giá tiền"
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={12}>
						<Form.Item label="Mô tả">
							<TextArea
								rows={3}
								size="large"
								name="mo_ta"
								onChange={formik.handleChange}
								placeholder="Mô tả"
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={8}>
						<Form.Item label="Máy giặt" valuePropName="checked">
							<Switch
								name="may_giat"
								onChange={handleChangeValue("may_giat")}
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={8}>
						<Form.Item label="Bàn là" valuePropName="checked">
							<Switch
								name="ban_la"
								onChange={handleChangeValue("ban_la")}
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={8}>
						<Form.Item label="Tivi" valuePropName="checked">
							<Switch
								name="tivi"
								onChange={handleChangeValue("tivi")}
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={8}>
						<Form.Item label="Điều hòa" valuePropName="checked">
							<Switch
								name="dieu_hoa"
								onChange={handleChangeValue("dieu_hoa")}
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={8}>
						<Form.Item label="Wifi" valuePropName="checked">
							<Switch
								name="wifi"
								onChange={handleChangeValue("wifi")}
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={8}>
						<Form.Item label="Phòng bếp" valuePropName="checked">
							<Switch
								name="bep"
								onChange={handleChangeValue("bep")}
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={8}>
						<Form.Item label="Nơi đỗ xe" valuePropName="checked">
							<Switch
								name="do_xe"
								onChange={handleChangeValue("do_xe")}
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={8}>
						<Form.Item label="Hồ bơi" valuePropName="checked">
							<Switch
								name="ho_boi"
								onChange={handleChangeValue("ho_boi")}
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={8}>
						<Form.Item label="Bàn ủi" valuePropName="checked">
							<Switch
								name="ban_ui"
								onChange={handleChangeValue("ban_ui")}
							/>
						</Form.Item>
					</Col>
				</Row>
				<div className="d-flex justify-content-end">
					<button type="submit" className="btn btn-primary mr-2">
						Thêm mới
					</button>
					<button
						type="submit"
						className="btn btn-outline-primary"
						onClick={() => navigate("/admin/department")}
					>
						Trở lại
					</button>
				</div>
			</Form>
		</Fragment>
	);
}
