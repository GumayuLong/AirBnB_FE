import { Col, DatePicker, Form, Input, Radio, Row, notification } from "antd";
import dayjs from "dayjs";
import { useFormik } from "formik";
import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../../../../services/userService";

export default function CreateUser() {
	const [gender, setGender] = useState("");
	const [avatar, setAvatar] = useState("");
	const navigate = useNavigate();

	const formik = useFormik({
		initialValues: {
			full_name: "",
			email: "",
			pass_word: "",
			phone: "",
			birth_day: "",
			gender: true,
			role: "ADMIN",
		},
		onSubmit: async (values) => {
			console.log({ values });
			await userService.createUserApi(values)
				.then((result) => {
					notification.success({
						message: "Thêm mới người dùng thành công!",
						placement: "bottomRight",
					});
					navigate("/admin/user");
				})
				.catch((err) => {
					notification.error({
						message: `${err.response.data.message}`,
						placement: "bottomRight",
					});
				});
		},
	});

	const options = [
		{
			label: "Nam",
			value: true,
		},
		{
			label: "Nữ",
			value: false,
		},
	];

	const onChangeRadio = ({ target: { value } }) => {
		setGender(value);
		formik.setFieldValue("gender", String(value));
	};

	const handleChangeDatePicker = (value) => {
		const birthday = dayjs(value).format("YYYY-MM-DD");
		formik.setFieldValue("birth_day", birthday);
	};

	const handleUploadFile = (event) => {
		let file = event.target.files[0];

		if (
			file.type === "image/jpeg" ||
			file.type === "image/jpg" ||
			file.type === "image/png" ||
			file.type === "image/gif"
		) {
			let reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = (e) => {
				setAvatar(e.target.result);
			};

			formik.setFieldValue("avatar", file);
		}
	};

	return (
		<Fragment>
			<h4>Thêm quản trị viên</h4>
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
						<Form.Item label="Họ và tên">
							<Input
								size="large"
								name="full_name"
								onChange={formik.handleChange}
								placeholder="Họ và tên"
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={12}>
						<Form.Item label="Email">
							<Input
								size="large"
								name="email"
								onChange={formik.handleChange}
								placeholder="Email"
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={12}>
						<Form.Item label="Số điện thoại">
							<Input
								size="large"
								name="phone"
								onChange={formik.handleChange}
								placeholder="Số điện thoại"
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={12}>
						<Form.Item label="Ngày sinh">
							<DatePicker
								size="large"
								format={"DD/MM/YYYY"}
								name="birth_day"
								onChange={handleChangeDatePicker}
								placeholder="Ngày sinh"
								style={{ width: "100%" }}
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={12}>
						<Form.Item label="Giới tính">
							<Radio.Group
								options={options}
								onChange={onChangeRadio}
								value={gender}
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={12}>
						<Form.Item label="Mật khẩu">
							<Input.Password
								size="large"
								name="pass_word"
								onChange={formik.handleChange}
								placeholder="Mật khẩu"
							/>
						</Form.Item>
					</Col>

					<Col className="gutter-row" span={12}>
						<Form.Item label="Loại người dùng">
							<Input
								size="large"
								disabled
								value={"ADMIN"}
								name="role"
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
						onClick={() => navigate("/admin/user")}
					>
						Trở lại
					</button>
				</div>
			</Form>
		</Fragment>
	);
}
