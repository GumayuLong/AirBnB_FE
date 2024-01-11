import { Col, Form, Input, Row, notification } from "antd";
import { useFormik } from "formik";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { positionService } from "../../../../services/positionService";
import { loadingContext } from "../../../../contexts/LoadingContext/LoadingContext";

export default function EditPosition() {
	const [img, setImg] = useState();
	const [positionDetail, setPositionDetail] = useState({});
	const [_, setLoadingContext] = useContext(loadingContext);
	const navigate = useNavigate();
	const params = useParams();

	useEffect(() => {
		fetchPositionDetail();
	}, []);

	const fetchPositionDetail = async () => {
		setLoadingContext({ isLoading: true });
        await positionService
			.fetchPositionDetailApi(params.positionId)
			.then((result) => {
				setPositionDetail(result.data);
			})
			.catch((err) => console.log(err));
		setLoadingContext({ isLoading: false });
	};

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			id: params.positionId,
			ten_vi_tri: positionDetail.ten_vi_tri,
			tinh_thanh: positionDetail.tinh_thanh,
			quoc_gia: positionDetail.quoc_gia,
		},

		onSubmit: async (values) => {
			try {
				await positionService.fetchUpdatePositionApi(
					params.positionId,
					values
				).then((result) => {
                    notification.success({
						message: "Cập nhật vị trí thành công!",
						placement: "bottomRight",
					});
					navigate("/admin/position");
                }).catch((err) => console.log(err))
			} catch (error) {
				notification.error({
					message: `${error.response.data}`,
					placement: "bottomRight",
				});
			}
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
								value={formik.values.ten_vi_tri}
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
								value={formik.values.tinh_thanh}
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
								value={formik.values.quoc_gia}
								onChange={formik.handleChange}
								placeholder="Quốc gia"
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
						onClick={() => navigate("/admin/position")}
					>
						Trở lại
					</button>
				</div>
			</Form>
		</Fragment>
	);
}
