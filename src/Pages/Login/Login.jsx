import React, { createRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserInfoAction } from "../../store/actions/userAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import "../../scss/Login.scss";
import axios from 'axios';
import { LoginSocialFacebook } from 'reactjs-social-login';
import { FacebookLoginButton } from 'react-social-login-buttons';
import ReactFacebookLogin from 'react-facebook-login';

import { Form, Input } from "antd";
import { validation } from "../../validations/validation";
import { userService } from "../../services/userService";

export default function Login() {
	const emailInputRef = createRef();
	const passwordInputRef = createRef();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [state, setState] = useState({
		email: "",
		pass_word: "",
	});
	const [errMessage, setErrMessage] = useState("");

	const loginFacebookApi = async (data) => {
		return await axios.post(`http://localhost:8080/api/auth/signin-fb`, data);
	}

	const handleChange = (event) => {
		setState({
			...state,
			[event.target.name]: event.target.value,
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		let isValid = true;

		// CHECK VALIDATION ACCOUNT LOGIN
		isValid &= validation.validateRequired(
			state.email,
			emailInputRef.current,
			"Vui lòng nhập email!"
		);

		// CHECK VALIDATION PASSWORD ACCOUNT LOGIN
		isValid &= validation.validateRequired(
			state.pass_word,
			passwordInputRef.current,
			"Vui lòng nhập mật khẩu!"
		);

		if (isValid) {
			await userService.loginApi(state)
				.then((result) => {
					localStorage.setItem(
						"USER_INFO",
						JSON.stringify(result.data)
					);
					dispatch(setUserInfoAction(result.data));
					navigate("/")
				})
				.catch((err) => {
					console.log(err.response.data);
                    setErrMessage(err.response.data);
					passwordInputRef.current.innerHTML = errMessage;
				});
		}
	};

	return (
		<div>
			<div className="bgcustom">
				<main className="main">
					<div className="form">
						<div className="w-75 mx-auto py-5">
							<div style={{ textAlign: "center" }}>
								<FontAwesomeIcon
									className="icon"
									icon={faUser}
								/>
							</div>
							<h1 className="title">Đăng nhập</h1>
							<form onSubmit={handleSubmit}>
								<Form.Item style={{ marginBottom: "35px" }}>
									<Input
										placeholder="Email*"
										onChange={handleChange}
										name="email"
										type="text"
										size="large"
									/>
								</Form.Item>
								<p
									ref={emailInputRef}
									className="text-danger"
									style={{ marginTop: "-20px" }}
								></p>
								<Form.Item style={{ marginBottom: "35px" }}>
									<Input.Password
										placeholder="Mật khẩu*"
										onChange={handleChange}
										name="pass_word"
										size="large"
									/>
								</Form.Item>
								<p
									ref={passwordInputRef}
									className="text-danger"
									style={{ marginTop: "-20px" }}
								>
									{errMessage}
								</p>
								<button className="btn btn-primary btncustom">
									Đăng nhập
								</button>
								<div
									style={{
										marginTop: "15px",
										textAlign: "center",
									}}
								></div>
								<div>
									<h3 className="connectlink">
										Bạn chưa có tài khoản?
										<a href="/signup">Đăng ký ngay</a>
									</h3>
								</div>
							</form>
							{/* <LoginSocialFacebook appId="904716094514255" onResolve={(response) => {
								console.log(response.data)
								
							}} onReject={(error) => {
								console.log(error)
							}}>
								<FacebookLoginButton />
							</LoginSocialFacebook> */}
							{/* <ReactFacebookLogin
								appId="904716094514255"
								autoLoad={false}
								fields="name, email, picture"
								callback={(responseFacebook) => {
									// console.log(responseFacebook);
									let { email, name } = responseFacebook;
									let data = {
										email,
										full_name: name,
										avatar:
											responseFacebook.picture.data.url,
									};
									console.log(responseFacebook);
									loginFacebookApi(data)
										.then((result) => {
											console.log(result.data);
											localStorage.setItem(
												"USER_INFO",
												result.data.createNewUser
											);
											navigate("/");
										})
										.catch((err) => console.log(err));
								}}
							/> */}
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
