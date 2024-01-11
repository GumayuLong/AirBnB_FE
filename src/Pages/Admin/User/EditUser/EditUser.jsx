import { Col, DatePicker, Form, Input, Radio, Row, notification } from "antd";
import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { loadingContext } from "../../../../contexts/LoadingContext/LoadingContext";
import { userService } from "../../../../services/userService";

export default function EditUser() {
	const [gender, setGender] = useState("");
	const [userDetail, setUserDetail] = useState({});
	const [_, setLoadingContext] = useContext(loadingContext);
	const navigate = useNavigate();
	const params = useParams();

	useEffect(() => {
		fetchUserDetail();
	}, []);

	const fetchUserDetail = async () => {
		setLoadingContext({ isLoading: true });
		await userService.fetchUserDetailApi(params.userId)
			.then((result) => {
				console.log(result.data);
				setUserDetail(result.data);
			})
			.catch((error) => {
				console.log(error);
			});
		setLoadingContext({ isLoading: false });
	};

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			id: Number(params.userId),
			full_name: userDetail.full_name,
			email: userDetail.email,
			pass_word: userDetail.pass_word,
			phone: userDetail.phone,
			birth_day: userDetail.birth_day,
			gender: userDetail.gender,
			role: userDetail.role,
		},
		onSubmit: async (values) => {
			try {
                await userService.updateUserApi(params.userId, values).then((result) => {
                    notification.success({
						message: "Cập nhật người dùng thành công!",
						placement: "bottomRight",
					});
					navigate("/admin/user");
                }).catch((err) => console.log(err))
			} catch (error) {
				notification.error({
					message: "Cập nhật người dùng thất bại!",
					placement: "bottomRight",
				});
			}
		},
	});

	const options = [
		{
			label: "Nam",
			value: "true",
		},
		{
			label: "Nữ",
			value: "false",
		},
	];

	const onChangeRadio = ({ target: { value } }) => {
		setGender(value);
		formik.setFieldValue("gender", String(value));
	};

	const handleChangeDatePicker = (value) => {
		const birth_day = dayjs(value).format("YYYY-MM-DD");
		formik.setFieldValue("birth_day", birth_day);
	};

	const pattent = /^\d{4}-\d{2}-\d{2}$/;
	const renderDatePicker = () => {
		if (pattent.test(formik.values.birth_day)) {
			return (
				<DatePicker
					name="birth_day"
					format={"DD/MM/YYYY"}
					size="large"
					style={{ width: "100%" }}
					onChange={handleChangeDatePicker}
					value={dayjs(formik.values.birth_day, "YYYY-MM-DD")}
				/>
			);
		} else {
			return (
				<DatePicker
					size="large"
					format="DD/MM/YYYY"
					name="birth_day"
					value={dayjs(formik.values.birth_day, "DD/MM/YYYY")}
					onChange={(_, dateString) => {
						formik.setFieldValue("birth_day", dateString);
					}}
					placeholder="Ngày sinh"
					style={{ width: "100%" }}
				/>
			);
		}
	};

	return (
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
					<Form.Item label="Mã người dùng">
						<Input
							size="large"
							name="id"
							value={formik.values.id}
							disabled
							onChange={formik.handleChange}
							placeholder="Mã người dùng"
						/>
					</Form.Item>
				</Col>
				<Col className="gutter-row" span={12}>
					<Form.Item label="Họ và tên">
						<Input
							size="large"
							name="full_name"
							value={formik.values.full_name}
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
							value={formik.values.email}
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
							value={formik.values.phone}
							onChange={formik.handleChange}
							placeholder="Số điện thoại"
						/>
					</Form.Item>
				</Col>
				<Col className="gutter-row" span={12}>
					<Form.Item label="Ngày sinh">
						{renderDatePicker()}
					</Form.Item>
				</Col>
				<Col className="gutter-row" span={12}>
					<Form.Item label="Giới tính">
						<Radio.Group
							name="gender"
							value={formik.values.gender}
							options={options}
							onChange={onChangeRadio}
						/>
					</Form.Item>
				</Col>
				<Col className="gutter-row" span={12}>
					<Form.Item label="Mật khẩu">
						<Input.Password
							name="pass_word"
							size="large"
							value={formik.values.pass_word}
							onChange={formik.handleChange}
							placeholder="Mật khẩu"
						/>
					</Form.Item>
				</Col>

				<Col className="gutter-row" span={12}>
					<Form.Item label="Loại người dùng">
						<Input
							disabled
							name="role"
							size="large"
							value={formik.values.role}
						/>
					</Form.Item>
				</Col>
			</Row>
			<div className="d-flex justify-content-end">
				<button type="submit" className="btn btn-primary mr-2">
					Lưu thay đổi{" "}
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
	);
}
