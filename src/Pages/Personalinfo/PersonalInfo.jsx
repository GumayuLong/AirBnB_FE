import React, { createRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { notification } from "antd";
import { validation } from "../../validations/validation";
import dayjs from "dayjs";
import { userService } from "../../services/userService";
import { bookRoomService } from "../../services/bookRoomService";

export default function PersonalInfo() {
	const params = useParams();
	const [userInfo, setUserInfo] = useState([]);
	const [bookingInfo, setBookingInfo] = useState([]);
	const [avatar, setAvatar] = useState(
		"http://dergipark.org.tr/assets/app/images/buddy_sample.png"
	);
	const [file, setFile] = useState(null);

	const fullNameInputRef = createRef();
	const fullPasswordInputRef = createRef();
	const phoneNumberInputRef = createRef();
	const birthdayInputRef = createRef();

	useEffect(() => {
		fetchPersonalInfo();
		fetchBookedRoomFromUser();
	}, []);

	const fetchPersonalInfo = async () => {
        await userService.fetchUserDetailApi(params.id).then((result) => {  
            setUserInfo(result.data);
            if (result.data.avatar !== null) {
                setAvatar(result.data.avatar);
            };
        })
	};

	const fetchBookedRoomFromUser = async () => {
		await bookRoomService.fetchBookRoomFromUser(params.id)
			.then((result) => {
				setBookingInfo(result.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleChange = (event) => {
		setUserInfo({
			...userInfo,
			[event.target.name]: event.target.value,
		});
	};

	const handleSubmitUpdate = async (event) => {
		event.preventDefault();
		let isValid = true;

		// CHECK VALIDATION NAME
		isValid &=
			validation.validateRequired(
				userInfo.full_name,
				fullNameInputRef.current,
				"Vui lòng nhập tên!"
			) &&
			validation.validateFullName(
				userInfo.full_name,
				fullNameInputRef.current,
				"Vui lòng nhập tên là ký tự chữ!"
			);

		// CHECK VALIDATION PHONE NUMBER
		isValid &=
			validation.validateRequired(
				userInfo.phone,
				phoneNumberInputRef.current,
				"Vui lòng nhập số điện thoại!"
			) &&
			validation.validateWithRegex(
				userInfo.phone,
				phoneNumberInputRef.current,
				"Vui lòng nhập số điện thoại là ký tự chữ số!",
				/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/
			);

		// CHECK VALIDATION BIRTHDAY
		isValid &=
			validation.validateRequired(
				userInfo.birth_day,
				birthdayInputRef.current,
				"Vui lòng nhập ngày sinh!"
			) &&
			validation.validateWithRegex(
				userInfo.birth_day,
				birthdayInputRef.current,
				"Vui lòng nhập ngày sinh!",
				/^\d{4}-\d{2}-\d{2}$/
			);

		if (isValid) {
            await userService.updateUserApi(params.id, userInfo)
            .then((result) => {
				setUserInfo(result.data);
					notification.success({
						message: "Cập nhật thông tin thành công",
						placement: "topRight",
					});
				document.getElementById("btnDong").click();
			})
            .catch((error) => {
                notification.danger({
					message: error.response.data,
					placement: "topRight",
				});
            });
		}
	};

	const handleUploadAvatar = (e) => {
		setFile(e.target.files[0]);
	};

	// const uploadAvatar = async () => {
	// 	const data = new FormData();
	// 	data.append("formFile", file);
	// 	if (data && file !== "") {
	// 		await userService
	// 			.postAvatarApi(data)
	// 			.then((result) => {
	// 				notification.success({
	// 					message: "Cập nhật avatar thành công",
	// 					placement: "topRight",
	// 				});
	// 				setAvatar(result.data.content.avatar);
	// 			})
	// 			.catch((err) => {
	// 				notification.warning({
	// 					message: err.response.data.content,
	// 					placement: "topRight",
	// 				});
	// 			});
	// 	} else {
	// 	}
	// };

	const renderBookingInfo = () => {
		return bookingInfo.map((element) => {
            return (
				<tr key={element.id}>
					<td>{element.ma_phong}</td>
					<td>{dayjs(element.ngay_den).format("DD/MM/YYYY")}</td>
					<td>{dayjs(element.ngay_di).format("DD/MM/YYYY")}</td>
					<td>{element.so_luong_khach}</td>
				</tr>
			);
        })	
	};

	const renderUserInfo = () => {
		let id = new Date();
		return (
			<div className="form" key={id}>
				<form>
					<div className="registerlayout">
						<div style={{ marginRight: "10px" }}>
							<div className="form-group">
								<div className="d-flex justify-content-between">
									<label className="labelRegister" htmlFor="">
										Họ và tên
									</label>
								</div>
								<input
									value={userInfo.full_name}
									disabled={true}
									name="name"
									type="text"
									className="form-control"
									id={userInfo.full_name}
								/>
							</div>
							<div className="form-group">
								<div className="d-flex justify-content-between">
									<label className="labelRegister" htmlFor="">
										Giới tính
									</label>
								</div>
								<select
									disabled={true}
									value={userInfo.gender}
									className="form-control"
									name="gender"
								>
									<option value={true}>Nam</option>
									<option value={false}>Nữ</option>
								</select>
							</div>
							<div className="form-group">
								<div className="d-flex justify-content-between">
									<label className="labelRegister" htmlFor="">
										Ngày sinh
									</label>
								</div>
								<input
									value={userInfo.birth_day}
									disabled={true}
									id="inputBirthday"
									type="date"
									className="form-control"
									name="confirmPassword"
								/>
							</div>
							<div className="form-group">
								<div className="d-flex justify-content-between">
									<label className="labelRegister" htmlFor="">
										Địa chỉ email
									</label>
								</div>
								<input
									value={userInfo.email}
									disabled={true}
									name="email"
									type="text"
									className="form-control"
									id="inputEmail"
								/>
							</div>
							<div className="form-group">
								<div className="d-flex justify-content-between">
									<label className="labelRegister" htmlFor="">
										Số điện thoại
									</label>
								</div>
								<input
									value={userInfo.phone}
									disabled={true}
									name="phone"
									type="text"
									className="form-control"
									id="inputPhone"
								/>
							</div>
							<button
								type="button"
								className="btn btn-warning"
								data-toggle="modal"
								data-target="#myModal"
							>
								Chỉnh sửa thông tin
							</button>
						</div>
					</div>
				</form>
			</div>
		);
	};

	return (
		<div className="container p-5" style={{ minHeight: "95vh" }}>
			<h4>Personal infomation</h4>
			<div className="tab-content mt-3" id="nav-tabContent">
				<div
					className="tab-pane fade show active w-90 py-3 "
					id="nav-home"
					role="tabpanel"
					aria-labelledby="nav-home-tab"
					tabIndex={0}
				>
					<div className="row">
						<div className="col-12 col-sm-6 col-md-4 col-xl-3 mb-5">
							<div className="p-0 m-0 d-flex flex-column align-items-center">
								<img
									className="img-thumbnail img-fluid"
									style={{
										borderRadius: "50%",
										objectFit: "cover",
										objectPosition: "center",
										width: 150,
										height: 150,
									}}
									src={avatar}
								/>
								<input
									onChange={handleUploadAvatar}
									className="my-3 form-control"
									type="file"
								/>
								<button
									type="button"
									className="btn btn-info"
									// onClick={uploadAvatar}
									style={{ width: "100%" }}
								>
									Upload Avatar
								</button>
							</div>
						</div>
						<div className="col-12 col-sm-6 col-md-8 col-xl-9">
							{renderUserInfo()}
						</div>
						<div className="modal" id="myModal">
							<div className="modal-dialog">
								<div className="modal-content">
									<div className="modal-header">
										<h4 className="modal-title">
											Cập nhật thông tin cá nhân
										</h4>
										<button
											type="button"
											className="close"
											data-dismiss="modal"
										>
											×
										</button>
									</div>
									<div className="modal-body">
										{/* Modal body.. */}
										<form>
											<div className="form-group">
												<label
													className="labelRegister"
													htmlFor=""
												>
													Họ và tên
												</label>
												<input
													value={userInfo.full_name}
													onChange={handleChange}
													type="text"
													className="form-control"
													name="full_name"
												/>
												<p
													ref={fullNameInputRef}
													className="text-danger"
												></p>
											</div>
											<div className="form-group">
												<label
													className="labelRegister"
													htmlFor=""
												>
													Giới tính
												</label>
												<select
													value={userInfo.gender}
													onChange={handleChange}
													className="form-control"
													name="gender"
												>
													<option value="true">
														Nam
													</option>
													<option value="false">
														Nữ
													</option>
												</select>
											</div>
											<div className="form-group">
												<label
													className="labelRegister"
													htmlFor=""
												>
													Ngày sinh
												</label>
												<input
													value={userInfo.birth_day}
													onChange={handleChange}
													type="date"
													className="form-control"
													name="birthday"
												/>
												<p
													ref={birthdayInputRef}
													className="text-danger"
												></p>
											</div>
											<div className="form-group">
												<label
													className="labelRegister"
													htmlFor=""
												>
													Địa chỉ email
												</label>
												<input
													value={userInfo.email}
													disabled={true}
													type="text"
													className="form-control"
													name="email"
												/>
											</div>
											<div className="form-group">
												<label
													className="labelRegister"
													htmlFor=""
												>
													Số điện thoại
												</label>
												<input
													value={userInfo.phone}
													onChange={handleChange}
													type="text"
													className="form-control"
													name="phone"
												/>
												<p
													ref={phoneNumberInputRef}
													className="text-danger"
												></p>
											</div>
										</form>
									</div>
									<div className="modal-footer">
										<button
											type="button"
											className="btn btn-warning"
											onClick={handleSubmitUpdate}
										>
											Cập nhật
										</button>
										<button
											type="button"
											className="btn btn-danger"
											data-dismiss="modal"
											id="btnDong"
										>
											Đóng
										</button>
									</div>
								</div>
							</div>
						</div>
						<div className="col-12 text-left">
							<div className="col-12 my-5 p-0">
								<h4>Lịch sử đặt phòng</h4>
								<table
									className="table table-bordered table-striped"
									style={{
										textAlign: "center",
									}}
								>
									<thead>
										<tr>
											<th
												style={{
													verticalAlign: "middle",
												}}
											>
												Mã phòng
											</th>
											<th
												style={{
													verticalAlign: "middle",
												}}
											>
												Ngày đến
											</th>
											<th
												style={{
													verticalAlign: "middle",
												}}
											>
												Ngày đi
											</th>
											<th
												style={{
													verticalAlign: "middle",
												}}
											>
												Số khách
											</th>
										</tr>
									</thead>
									<tbody>{renderBookingInfo()}</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
