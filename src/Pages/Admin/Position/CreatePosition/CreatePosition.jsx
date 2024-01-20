import { Col, Form, Input, Row, notification } from "antd";
import { useFormik } from "formik";
import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { positionService } from "../../../../services/positionService";

export default function CreatePosition() {
	const [file, setFile] = useState(null);
	const [img, setImg] = useState();
	const navigate = useNavigate();

	const handleUploadAvatar = (e) => {
		setFile(e.target.files[0]);
	};

	const formik = useFormik({
		initialValues: {
			ten_vi_tri: "",
			tinh_thanh: "",
			quoc_gia: "",
			hinh_anh: "",
		},

		onSubmit: async (values) => {
			const fileHinh = new FormData();
			fileHinh.append("formFile", file);
			await positionService
				.fetchCreatePositionApi(values)
				.then(async (result) => {
					await positionService.createUploadHinhViTriApi(result.data.id, fileHinh).then((result) => {
						notification.success({
							message: "Tạo vị trí thành công!",
							placement: "bottomRight",
						});
						navigate("/admin/position");
					}).catch((err) => {
						console.log(err)
						notification.error({
							message: `${err}`,
							placement: "bottomRight",
						});
					})
				})
				.catch((err) => {
					console.log(err)
				});
		},
	});

	return (
		<Fragment>
			<h4>Thêm vị trí</h4>
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
						<Form.Item label="Tên vị trí">
							<Input
								size="large"
								name="ten_vi_tri"
								onChange={formik.handleChange}
								placeholder="Tên vị trí"
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={12}>
						<Form.Item label="Tỉnh thành">
							<Input
								size="large"
								name="tinh_thanh"
								onChange={formik.handleChange}
								placeholder="Tỉnh thành"
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={12}>
						<Form.Item label="Quốc gia">
							<Input
								size="large"
								name="quoc_gia"
								onChange={formik.handleChange}
								placeholder="Quốc gia"
							/>
						</Form.Item>
					</Col>
					<Col className="gutter-row" span={12}>
						<Form.Item label="Hình ảnh">
							<Input
								type="file"
								size="large"
								name="hinh_anh"
								onChange={handleUploadAvatar}
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
						onClick={() => navigate("/admin/position")}
					>
						Trở lại
					</button>
				</div>
			</Form>
		</Fragment>
	);
}
