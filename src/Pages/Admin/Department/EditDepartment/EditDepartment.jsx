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
import React, { Fragment, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { positionService } from "../../../../services/positionService";
import { departmentService } from "../../../../services/departmentService";
import { loadingContext } from "../../../../contexts/LoadingContext/LoadingContext";

export default function EditDepartment() {
	const [state, setState] = useState({
		position: [],
	});
	const [department, setDepartment] = useState({});
	const [_, setLoadingContext] = useContext(loadingContext);
	const navigate = useNavigate();
	const params = useParams();

	useEffect(() => {
		fetchDepartmentDetail();
		fetchPositionList();
	}, []);

	const fetchDepartmentDetail = async () => {
		setLoadingContext({ isLoading: true });
        await departmentService
			.fetchDepartmentDetailApi(params.departmentId)
			.then((result) => {
				setDepartment(result.data);
			})
			.catch((err) => console.log(err));
		setLoadingContext({ isLoading: false });
	};

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			id: params.departmentId,
			ten_phong: department.ten_phong,
			khach: department.khach,
			phong_ngu: department.phong_ngu,
			giuong: department.giuong,
			phong_tam: department.phong_tam,
			mo_ta: department.mo_ta,
			gia_tien: department.gia_tien,
			may_giat: department.may_giat,
			ban_la: department.ban_la,
			tivi: department.tivi,
			dieu_hoa: department.dieu_hoa,
			wifi: department.wifi,
			bep: department.bep,
			do_xe: department.do_xe,
			ho_boi: department.ho_boi,
			ban_ui: department.ban_ui,
			ma_vi_tri: department.ma_vi_tri,
			hinh_anh: "",
		},

		onSubmit: async (values) => {
			try {
				await departmentService.fetchUpdateDepartmentApi(
					params.departmentId,
					values
				).then((result) => {
                    notification.success({
						message: "Cập nhật phòng thuê thành công!",
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
			<h4>Cập nhật phòng thuê</h4>
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
								value={formik.values.ten_phong}
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
								value={formik.values.ma_vi_tri}
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={12}>
						<Form.Item label="Số khách">
							<InputNumber
								style={{ width: "100%" }}
								size="large"
								name="khach"
								min={1}
								onChange={handleChangeValue("khach")}
								value={formik.values.khach}
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
								min={1}
								onChange={handleChangeValue("phong_ngu")}
								value={formik.values.phong_ngu}
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
								min={1}
								onChange={handleChangeValue("giuong")}
								value={formik.values.giuong}
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
								min={1}
								onChange={handleChangeValue("phong_tam")}
								value={formik.values.phong_tam}
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
								value={formik.values.gia_tien}
								placeholder="Giá tiền"
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={12}>
						<Form.Item label="Mô tả">
							<TextArea
								rows={6}
								size="large"
								name="mo_ta"
								onChange={formik.handleChange}
								value={formik.values.mo_ta}
								placeholder="Mô tả"
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={8}>
						<Form.Item label="Máy giặt" valuePropName="checked">
							<Switch
								name="may_giat"
								onChange={handleChangeValue("may_giat")}
								checked={formik.values.may_giat}
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={8}>
						<Form.Item label="Bàn là" valuePropName="checked">
							<Switch
								name="ban_la"
								onChange={handleChangeValue("ban_la")}
								checked={formik.values.ban_la}
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={8}>
						<Form.Item label="Tivi" valuePropName="checked">
							<Switch
								name="tivi"
								onChange={handleChangeValue("tivi")}
								checked={formik.values.tivi}
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={8}>
						<Form.Item label="Điều hòa" valuePropName="checked">
							<Switch
								name="dieu_hoa"
								onChange={handleChangeValue("dieu_hoa")}
								checked={formik.values.dieu_hoa}
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={8}>
						<Form.Item label="Wifi" valuePropName="checked">
							<Switch
								name="wifi"
								onChange={handleChangeValue("wifi")}
								checked={formik.values.wifi}
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={8}>
						<Form.Item label="Phòng bếp" valuePropName="checked">
							<Switch
								name="bep"
								onChange={handleChangeValue("bep")}
								checked={formik.values.bep}
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={8}>
						<Form.Item label="Nơi đỗ xe" valuePropName="checked">
							<Switch
								name="do_xe"
								onChange={handleChangeValue("do_xe")}
								checked={formik.values.do_xe}
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={8}>
						<Form.Item label="Hồ bơi" valuePropName="checked">
							<Switch
								name="ho_boi"
								onChange={handleChangeValue("ho_boi")}
								checked={formik.values.ho_boi}
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={8}>
						<Form.Item label="Bàn ủi" valuePropName="checked">
							<Switch
								name="ban_ui"
								onChange={handleChangeValue("ban_ui")}
								checked={formik.values.ban_ui}
							/>
						</Form.Item>
					</Col>
				</Row>
				<div className="d-flex justify-content-end">
					<button type="submit" className="btn btn-primary mr-2">
						Lưu thay đổi
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
