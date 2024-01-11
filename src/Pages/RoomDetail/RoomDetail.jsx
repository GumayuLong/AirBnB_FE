import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faAward,
	faCalendarAlt,
	faCar,
	faChevronRight,
	faHeart,
	faKitchenSet,
	faLanguage,
	faLocationDot,
	faMedal,
	faShare,
	faSoap,
	faStar,
	faSwimmingPool,
	faTemperatureArrowDown,
	faTemperatureArrowUp,
	faTv,
	faWifi,
} from "@fortawesome/free-solid-svg-icons";
import { UserOutlined } from "@ant-design/icons";
import { notification } from "antd";
import dayjs from "dayjs";
import { faCommentDots } from "@fortawesome/free-regular-svg-icons";
import "../../scss/roomDetail.scss";
import { useSelector } from "react-redux";
import { departmentService } from "../../services/departmentService";
import { commentService } from "../../services/commentService";
import { positionService } from "../../services/positionService";
import { bookRoomService } from "../../services/bookRoomService";

export default function RoomDetail() {
	const params = useParams();
	const [detail, setDetail] = useState({});
	const [locate, setLocate] = useState({});
	const [listDepartment, setListDepartment] = useState([]);
	const [listComments, setListComments] = useState([]);
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [numberOfDays, setNumberOfDays] = useState(null);
	const [serviceCost, setServiceCost] = useState(10);

	const userState = useSelector((state) => {
		if (state.userReducer.userInfo) {
			return state.userReducer.userInfo.data.id;
		}
		return state.userReducer.userInfo;
	});

	// FORMAT CURRENT DAY
	const currentDate = new Date();
	const year = currentDate.getFullYear();
	const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
	const day = currentDate.getDate().toString().padStart(2, "0");
	const formattedDate = `${year}-${month}-${day}`;

	const [comment, setComment] = useState({
		ma_phong: Number(params.id),
		ma_nguoi_binh_luan: userState,
		ngay_binh_luan: new Date().toISOString(),
		noi_dung: "",
		sao_binh_luan: Number(),
	});

	const [bookRoom, setBookRoom] = useState({
		ma_phong: Number(params.id),
		ngay_den: new Date().toISOString(),
		ngay_di: new Date().toISOString(),
		so_luong_khach: Number(),
		ma_nguoi_dat: userState,
	});

	useEffect(() => {
		locateDetail();
		listBookedDepartment();
		fetchCommentList();
	}, []);

	// LẤY THÔNG TIN CHI TIẾT CỦA PHÒNG THEO ID PHÒNG
	// LẤY THÔNG TIN CHI TIẾT CỦA PHÒNG THEO ID VỊ TRÍ
	const locateDetail = async () => {
		await departmentService
			.fetchDepartmentDetailApi(params.id)
			.then(async (result) => {
				await positionService.positionDetailApi(result.data.ma_vi_tri)
					.then((result) => {
						setLocate(result.data);
					})
					.catch((err) => console.log(err));
				setDetail(result.data);
			});
	};

	// LẤY TẤT CẢ THÔNG TIN BOOK CỦA TẤT CẢ CÁC PHÒNG
	const listBookedDepartment = async () => {
		await bookRoomService.fetchBookRoomApi()
			.then((result) => {
				setListDepartment(result.data);
			})
			.catch((err) => console.log(err));
	};

	// LẤY TẤT CẢ CÁC BÌNH LUẬN THEO ID PHÒNG
	const fetchCommentList = async () => {
		await commentService.fetchCommentListApi(params.id)
			.then((result) => {
				setListComments(result.data);
			})
			.catch((err) => console.log(err));
	};

	// HANDLE ONCHANGE INPUT COMMENT
	const handleComment = (event) => {
		setComment({
			...comment,
			[event.target.name]: event.target.value,
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		comment.sao_binh_luan = Number(comment.sao_binh_luan);
		await commentService
			.createCommentApi(comment)
			.then((result) => {
				notification.success({
					message: "Thêm bình luận thành công",
					placement: "topRight",
				});
			})
			.catch((err) => {
				console.log(err);
				notification.error({
					message: "Thêm bình luận thất bại!",
					placement: "topRight",
				});
			});
	};

	const handleStartDateChange = (e) => {
		const newStartDate = new Date(e.target.value).toISOString();
		setStartDate(newStartDate);
		setBookRoom({
			...bookRoom,
			[e.target.name]: newStartDate,
		});
		calculateNumberOfDays(newStartDate, endDate);
	};

	const handleEndDateChange = (e) => {
		const newEndDate = new Date(e.target.value).toISOString();
		setEndDate(newEndDate);
		setBookRoom({
			...bookRoom,
			[e.target.name]: newEndDate,
		});
		calculateNumberOfDays(startDate, newEndDate);
	};

	const calculateNumberOfDays = (start, end) => {
		if (start && end) {
			const startMoment = dayjs(start);
			const endMoment = dayjs(end);
			const diffInDays = endMoment.diff(startMoment, "days");
			setNumberOfDays(diffInDays);
		}
	};

	const handleChangeBookRoom = (event) => {
		setBookRoom({
			...bookRoom,
			[event.target.name]: event.target.value,
		});
	};

	const handleBookRoom = async (event) => {
		event.preventDefault();
		const data = [...listDepartment];
		const listBookedRoom = data.filter(
			(element) => element.ma_phong === detail.id
		);
		const checkBookedRoom = listBookedRoom.every((element) => {
			if (
				(element.ngay_den > startDate ||
					element.ngay_di <= startDate) &&
				(element.ngay_di < endDate ||
					element.ngay_den >= endDate)
			) {
				return true;
			}
		});
		if (checkBookedRoom) {
			bookRoom.so_luong_khach = Number(bookRoom.so_luong_khach);
			bookRoom.ngay_den = new Date(bookRoom.ngay_den).toISOString();
			bookRoom.ngay_di = new Date(bookRoom.ngay_di).toISOString();
			await bookRoomService.bookRoomApi(bookRoom)
				.then((result) => {
					console.log(result.data)
					notification.success({
						message: "Đặt phòng thành công",
						placement: "topRight",
					});
				})
				.catch((err) => {
					console.log(err)
					notification.error({
						message: `${err.message}`,
						placement: "topRight",
					});
				});
		} else {
			notification.error({
				message: "Phòng đã có người đặt",
				placement: "topRight",
			});
		}
	};

	const renderComment = () => {
		const limitedListComments = listComments.slice(0, 6);
		return limitedListComments.map((element) => {
			return (
				<>
					<div className="col-6 mb-5">
						<div className="d-flex align-items-start">
							{/* {element.avatar ? (
								<img
									src={element.avatar}
									className="comment__img"
								/>
							) : (
								<img
									scr="https://st3.depositphotos.com/1767687/16607/v/450/depositphotos_166074422-stock-illustration-default-avatar-profile-icon-grey.jpg"
									className="comment__img"
								/>
							)} */}
							<div className="ml-3">
								<h6 className="font-semibold text-base tracking-wide text-gray-900">
									{element.ma_nguoi_binh_luan} -{" "}
									<span className="font-normal text-sm text-gray-500">
										{dayjs(element.ngay_binh_luan).format(
											"DD/MM/YYYY"
										)}
									</span>
								</h6>
								<div className="text-gray-800 tracking-wider">
									<p>{element.noi_dung}</p>
								</div>
							</div>
						</div>
					</div>
				</>
			);
		});
	};

	return (
		<React.Fragment>
			<section className="container my-4">
				<div>
					<h3>{detail.ten_phong}</h3>
					<div className="room-detail d-flex justify-content-between align-items-center my-3">
						<div>
							<span className="text-sm">
								<FontAwesomeIcon icon={faStar} /> 4 -
							</span>
							<span className="text-sm mx-1">64 đánh giá -</span>
							<span className="text-sm mx-1">
								<FontAwesomeIcon
									icon={faAward}
									className="pr-2"
								/>
								Chủ nhà siêu cấp -
							</span>
							<span className="underline text-sm mx-1">
								{locate.ten_vi_tri}
							</span>
						</div>
						<div className="d-flex justify-content-between align-items-center">
							<button className="btn-custom-3 px-2 py-1 d-flex justify-content-between align-items-center">
								<FontAwesomeIcon icon={faShare} />
								<span className="ml-2">Chia sẻ</span>
							</button>
							<button className="btn-custom-3 px-2 py-1 ml-2 d-flex justify-content-between align-items-center">
								<FontAwesomeIcon icon={faHeart} />
								<span className="ml-2">Lưu</span>
							</button>
						</div>
					</div>
					<img className="img-fluid" src={detail.hinh_anh} alt="" />
				</div>
			</section>
			<section className="container">
				<div className="row">
					<div className="col-12 col-sm-12 col-md-6 col-xl-8">
						<div className="d-flex justify-content-between align-items-center my-3 border-b">
							<div>
								<h3 className="font-semibold text-lg sm:text-2xl text-gray-800">
									Toàn bộ căn hộ
								</h3>
								<span className="text-sm font-normal  tracking-widest text-gray-700">
									<span>
										{detail.khach} khách -{" "}
										{detail.phong_ngu} phòng ngủ -{" "}
										{detail.phong_tam} phòng tắm
									</span>
								</span>
							</div>
						</div>
						<hr />
						<div className="my-3 border-b">
							<div className="d-flex align-items-start">
								<div className="pt-2">
									<FontAwesomeIcon
										icon={faMedal}
										style={{ width: 25, height: 25 }}
									/>
								</div>
								<div className="ml-4">
									<h3 className="font-semibold text-gray-800 sm:text-lg ">
										Sungwon là Chủ nhà siêu cấp
									</h3>
									<p className="tracking-wider text-gray-500">
										Chủ nhà siêu cấp là những chủ nhà có
										kinh nghiệm, được đánh giá cao và là
										những người cam kết mang lại quãng thời
										gian ở tuyệt vời cho khách.
									</p>
								</div>
							</div>
							<div className="d-flex align-items-start mt-5">
								<div className="pt-2">
									<span>
										<FontAwesomeIcon
											icon={faLocationDot}
											style={{ width: 25, height: 25 }}
										/>
									</span>
								</div>
								<div className="ml-4">
									<h3 className="font-semibold text-gray-800 sm:text-lg ">
										Địa điểm tuyệt vời
									</h3>
									<p className="tracking-wider text-gray-500">
										90% khách gần đây đã xếp hạng 5 sao cho
										vị trí này.
									</p>
								</div>
							</div>
							<div className="d-flex align-items-start mt-5">
								<div className="pt-2">
									<span>
										<FontAwesomeIcon
											icon={faCalendarAlt}
											style={{ width: 25, height: 25 }}
										/>
									</span>
								</div>
								<h3 className="ml-4 font-semibold text-gray-800  sm:text-lg">
									Miễn phí hủy trong 48 giờ.
								</h3>
							</div>
						</div>
						<div className="mt-5 border-b">
							<img
								src="https://a0.muscache.com/im/pictures/54e427bb-9cb7-4a81-94cf-78f19156faad.jpg"
								width={120}
								className="h-7 mb-4"
							/>
							<div>
								<p className="text-justify tracking-wider text-gray-800 mb-2">
									Mọi đặt phòng đều được bảo vệ miễn phí trong
									trường hợp Chủ nhà hủy, thông tin nhà/phòng
									cho thuê không chính xác và những vấn đề
									khác như sự cố trong quá trình nhận phòng.
								</p>
								<a href="#" className="small-link">
									Tìm hiểu thêm
									<span className="ml-1">
										<FontAwesomeIcon
											icon={faChevronRight}
											style={{ width: 15, height: 15 }}
										/>
									</span>
								</a>
							</div>
						</div>
						<hr />
						<div className="my-3 border-b">
							<div className="d-flex align-items-center justify-content-between">
								<div className="mr-2 d-flex align-items-center justify-content-between">
									<FontAwesomeIcon
										icon={faLanguage}
										style={{ width: 25, height: 25 }}
									/>
									<span className="text-base tracking-wider text-gray-800 ml-2">
										Một số thông tin đã được dịch tự động.
									</span>
								</div>
								<a href="#" className="small-link">
									Hiển thị ngôn ngữ gốc
									<span className="ml-1">
										<FontAwesomeIcon
											icon={faChevronRight}
											style={{ width: 15, height: 15 }}
										/>
									</span>
								</a>
							</div>
						</div>
						<hr />
						<div className="my-3 border-b">
							<p className="text-justify tracking-wider text-gray-800 mb-4">
								Nhà nghỉ thôn dã hình lưỡi liềm trong một ngôi
								làng nghệ thuật gốm hai nghìn năm. Một ngôi nhà
								nguyên khối lớn với sân thượng ba tầng của Bảo
								tàng Văn hóa Guitar Serra, nổi tiếng với mặt
								tiền đặc sắc trong một ngôi làng nghệ thuật gốm
								hai nghìn năm pha trộn rất tốt với thiên nhiên.
							</p>
							<p className="text-justify tracking-wider text-gray-800 mb-4">
								Tận hưởng kỳ nghỉ dưỡng sức cảm xúc thư giãn
								trong một căn phòng ấm cúng, chào...
							</p>
							<a href="#" className="small-link">
								Hiển thị thêm
								<span className="ml-1">
									<FontAwesomeIcon
										icon={faChevronRight}
										style={{ width: 15, height: 15 }}
									/>
								</span>
							</a>
						</div>
						<hr />
						<div className="mt-3 pb-5">
							<div>
								<h4 className="font-semibold text-gray-800 text-xl pb-4">
									Nơi này có những gì cho bạn
								</h4>
							</div>

							<div className="row">
								{detail.mayGiat ? (
									<div className="col-4 my-3 d-flex align-item-center">
										<FontAwesomeIcon
											icon={faSoap}
											style={{ width: 30, height: 30 }}
										/>
										<span className="ml-2">Máy giặt</span>
									</div>
								) : (
									<></>
								)}
								{detail.banLa ? (
									<div className="col-4 my-3 d-flex align-item-center">
										<FontAwesomeIcon
											icon={faTemperatureArrowUp}
											style={{ width: 30, height: 30 }}
										/>
										<span className="ml-2">Bàn là</span>
									</div>
								) : (
									<></>
								)}
								{detail.tivi ? (
									<div className="col-4 my-3 d-flex align-item-center">
										<FontAwesomeIcon
											icon={faTv}
											style={{ width: 30, height: 30 }}
										/>
										<span className="ml-2">Tivi</span>
									</div>
								) : (
									<></>
								)}
								{detail.dieu_hoa ? (
									<div className="col-4 my-3 d-flex align-item-center">
										<FontAwesomeIcon
											icon={faTemperatureArrowDown}
											style={{ width: 30, height: 30 }}
										/>
										<span className="ml-2">Điều hòa</span>
									</div>
								) : (
									<></>
								)}
								{detail.wifi ? (
									<div className="col-4 my-3 d-flex align-item-center">
										<FontAwesomeIcon
											icon={faWifi}
											style={{ width: 30, height: 30 }}
										/>
										<span className="ml-2">Wifi</span>
									</div>
								) : (
									<></>
								)}
								{detail.bep ? (
									<div className="col-4 my-3 d-flex align-item-center">
										<FontAwesomeIcon
											icon={faKitchenSet}
											style={{ width: 30, height: 30 }}
										/>
										<span className="ml-2">Bếp</span>
									</div>
								) : (
									<></>
								)}
								{detail.do_xe ? (
									<div className="col-4 my-3 d-flex align-item-center">
										<FontAwesomeIcon
											icon={faCar}
											style={{ width: 30, height: 30 }}
										/>
										<span className="ml-2">Đỗ xe</span>
									</div>
								) : (
									<></>
								)}
								{detail.ho_boi ? (
									<div className="col-4 my-3 d-flex align-item-center">
										<FontAwesomeIcon
											icon={faSwimmingPool}
											style={{ width: 30, height: 30 }}
										/>
										<span className="ml-2">Hồ bơi</span>
									</div>
								) : (
									<></>
								)}
								{detail.bep ? (
									<div className="col-4 my-3 d-flex align-item-center">
										<FontAwesomeIcon
											icon={faTemperatureArrowUp}
											style={{ width: 30, height: 30 }}
										/>
										<span className="ml-2">Bàn ủi</span>
									</div>
								) : (
									<></>
								)}
							</div>
							<div className="mt-2">
								<a href="#" className="small-link">
									Hiển thị tất cả tiện nghi
									<span className="ml-1">
										<FontAwesomeIcon
											icon={faChevronRight}
											style={{ width: 15, height: 15 }}
										/>
									</span>
								</a>
							</div>
						</div>
					</div>

					<div className="col-12 col-sm-12 col-md-6 col-xl-4">
						<div style={{ position: "sticky", top: "1rem" }}>
							<div
								className="bg-white shadow-xl border"
								style={{
									borderRadius: 20,
									boxShadow:
										"0 20px 25px -5px rgba(0,0,0,.1),0 8px 10px -6px rgba(0,0,0,.1)",
								}}
							>
								<div style={{ width: "100%" }}>
									<div className="d-flex justify-content-between align-items-center m-3">
										<div>
											<span>$ </span>
											<span
												style={{
													fontWeight: "500",
													fontSize: 18,
												}}
											>
												{detail.gia_tien}
											</span>
											<span className="text-base">
												{" "}
												/ đêm
											</span>
										</div>
										<div>
											<span className="text-sm font-normal">
												<FontAwesomeIcon
													icon={faStar}
												/>{" "}
												4 -
											</span>
											<span className="underline text-sm font-normal tracking-widest">
												80 đánh giá
											</span>
										</div>
									</div>
									<hr />
									<div className="d-flex justify-content-between align-items-center mb-2 mx-3">
										<div className="col-6 px-0">
											<div className="sub-title">
												Nhận phòng
											</div>
											<input
												type="date"
												className="mt-2 form-control"
												onChange={handleStartDateChange}
												size="large"
												name="ngay_den"
												min={formattedDate}
												style={{ width: "100%" }}
												id="ngayDen"
											/>
										</div>
										<div className="col-6 px-0">
											<div className="sub-title">
												Trả phòng
											</div>
											<input
												type="date"
												className="mt-2 form-control"
												onChange={handleEndDateChange}
												size="large"
												name="ngay_di"
												id="ngayDi"
												min={bookRoom.ngay_den}
												style={{ width: "100%" }}
											/>
										</div>
									</div>
									<div className="mx-3">
										<div className="sub-title">Khách</div>
										<input
											type="number"
											className="mt-2 form-control"
											addonBefore={<UserOutlined />}
											placeholder="Số khách"
											min={1}
											max={10}
											size="large"
											name="so_luong_khach"
											onChange={handleChangeBookRoom}
										/>
									</div>
									<div
										className="px-3 pt-3 pb-2"
										style={{ width: "100%" }}
									>
										<button
											onClick={handleBookRoom}
											type="submit"
											className="btn-custom-2"
											style={{ width: "100%" }}
										>
											Đặt phòng
										</button>
									</div>
								</div>

								<div className="text-center font-normal text-gray-400">
									<span>Bạn vẫn chưa bị trừ tiền</span>
								</div>
								<div className="border-b pt-2 mx-3">
									<div className="d-flex justify-content-between py-1">
										<div className="underline text-gray-600 sub-title">
											$ {detail.gia_tien} x {numberOfDays}{" "}
											đêm
										</div>
										<div>
											<span>
												{detail.gia_tien * numberOfDays}
											</span>{" "}
											$
										</div>
									</div>
									<div className="d-flex justify-content-between py-1">
										<div className="underline text-gray-600 sub-title">
											Phí dịch vụ
										</div>
										<div>
											<span>{serviceCost}</span> $
										</div>
									</div>
								</div>
								<hr />
								<div className="d-flex justify-content-between items-center text-lg font-semibold mb-3 mx-3">
									<div className="sub-title">
										Tổng trước thuế
									</div>
									<div>
										{detail.gia_tien * numberOfDays +
											serviceCost}{" "}
										$
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="container">
				<hr />
				<h5 className="font-semibold text-gray-800 text-xl pb-4 flex items-center">
					<FontAwesomeIcon icon={faStar} />
					<span className="text-sm ml-2">5 - 64 đánh giá</span>
				</h5>
				<div className="row">
					<div className="col-6 mb-3">
						<div className="d-flex justify-content-between align-items-center">
							<h6 className="mb-0">Mức độ sạch sẽ</h6>
							<div className="d-flex justify-content-between align-items-center text-warning">
								<FontAwesomeIcon icon={faStar} />
								<FontAwesomeIcon icon={faStar} />
								<FontAwesomeIcon icon={faStar} />
								<FontAwesomeIcon icon={faStar} />
								<FontAwesomeIcon icon={faStar} />
								<p className="ml-4 mb-0 text-dark">5.0</p>
							</div>
						</div>
					</div>
					<div className="col-6 mb-3">
						<div className="d-flex justify-content-between align-items-center">
							<h6 className="mb-0">Độ chính xác</h6>
							<div className="d-flex justify-content-between align-items-center text-warning">
								<FontAwesomeIcon icon={faStar} />
								<FontAwesomeIcon icon={faStar} />
								<FontAwesomeIcon icon={faStar} />
								<FontAwesomeIcon icon={faStar} />
								<FontAwesomeIcon icon={faStar} />
								<p className="ml-4 mb-0 text-dark">5.0</p>
							</div>
						</div>
					</div>
					<div className="col-6 mb-3">
						<div className="d-flex justify-content-between align-items-center">
							<h6 className="mb-0">Giao tiếp</h6>
							<div className="d-flex justify-content-between align-items-center text-warning">
								<FontAwesomeIcon icon={faStar} />
								<FontAwesomeIcon icon={faStar} />
								<FontAwesomeIcon icon={faStar} />
								<FontAwesomeIcon icon={faStar} />
								<FontAwesomeIcon icon={faStar} />
								<p className="ml-4 mb-0 text-dark">5.0</p>
							</div>
						</div>
					</div>
					<div className="col-6 mb-3">
						<div className="d-flex justify-content-between align-items-center">
							<h6 className="mb-0">Vị trí</h6>
							<div className="d-flex justify-content-between align-items-center text-warning">
								<FontAwesomeIcon icon={faStar} />
								<FontAwesomeIcon icon={faStar} />
								<FontAwesomeIcon icon={faStar} />
								<FontAwesomeIcon icon={faStar} />
								<FontAwesomeIcon icon={faStar} />
								<p className="ml-4 mb-0 text-dark">5.0</p>
							</div>
						</div>
					</div>
					<div className="col-6 mb-3">
						<div className="d-flex justify-content-between align-items-center">
							<h6 className="mb-0">Nhận phòng</h6>
							<div className="d-flex justify-content-between align-items-center text-warning">
								<FontAwesomeIcon icon={faStar} />
								<FontAwesomeIcon icon={faStar} />
								<FontAwesomeIcon icon={faStar} />
								<FontAwesomeIcon icon={faStar} />
								<FontAwesomeIcon icon={faStar} />
								<p className="ml-4 mb-0 text-dark">5.0</p>
							</div>
						</div>
					</div>
					<div className="col-6 mb-3">
						<div className="d-flex justify-content-between align-items-center">
							<h6 className="mb-0">Giá trị</h6>
							<div className="d-flex justify-content-between align-items-center text-warning">
								<FontAwesomeIcon icon={faStar} />
								<FontAwesomeIcon icon={faStar} />
								<FontAwesomeIcon icon={faStar} />
								<FontAwesomeIcon icon={faStar} />
								<FontAwesomeIcon icon={faStar} />
								<p className="ml-4 mb-0 text-dark">5.0</p>
							</div>
						</div>
					</div>
				</div>
				<h5 className="py-3">
					<FontAwesomeIcon icon={faCommentDots} />
					<span className="text-sm ml-2">Bình luận</span>
				</h5>
				<div className="row">
					{renderComment()}
					<div className="col-12">
						<a href="#" className="small-link">
							Hiển thị tất cả đánh giá
							<span className="ml-1">
								<FontAwesomeIcon
									icon={faChevronRight}
									style={{ width: 15, height: 15 }}
								/>
							</span>
						</a>
					</div>
				</div>
			</section>

			<section className="container mb-5">
				<hr />
				<form onSubmit={handleSubmit}>
					<div className="row">
						<div className="col-6">
							<label className="mb-0">Rate</label>
							<input
								name="sao_binh_luan"
								type="number"
								min={1}
								max={5}
								className="form-control my-2"
								onChange={handleComment}
							/>
						</div>
						<div className="col-6">
							<label className="mb-0">Comment</label>
							<input
								name="noi_dung"
								type="text"
								className="form-control my-2"
								onChange={handleComment}
							/>
						</div>

						<div className="col-12 d-flex justify-content-end">
							<button className="btn btn-success mt-3">
								Add comment
							</button>
						</div>
					</div>
				</form>
			</section>
		</React.Fragment>
	);
}

