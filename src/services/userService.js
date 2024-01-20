import { request } from "../configs/api";

class UserService {
	// LOGIN AND LOGOUT API
	loginApi(data) {
		return request({
			url: `/auth/signin`,
			method: "POST",
			data,
		});
	}

	registerApi(data) {
		return request({
			url: `/auth/signup`,
			method: "POST",
			data,
		});
	}

	// USER API

	fetchUserListApi() {
		return request({
			url: "/nguoi-dung",
			method: "GET",
		});
	}

	fetchSearchUserApi(name) {
		return request({
			url: `nguoi-dung/search/${name}`,
			method: "GET",
		});
	}

	createUserApi(data) {
		return request({
			url: "/nguoi-dung",
			method: "POST",
			data,
		});
	}

	fetchDeleteUserApi(id) {
		return request({
			url: `/nguoi-dung/${id}`,
			method: "DELETE",
		});
	}

	updateUserApi(id, data) {
		return request({
			url: `/nguoi-dung/${id}`,
			method: "PUT",
			data,
		});
	}

	fetchUserDetailApi(id) {
		return request({
			url: `/nguoi-dung/${id}`,
			method: "GET",
		});
	}

	userInfoApi(userId) {
		return request({
			url: `/users/${userId}`,
			method: "GET",
		});
	}

	updateUserInfoApi(userId, data) {
		return request({
			url: `/users/${userId}`,
			method: "PUT",
			data,
		});
	}

	postAvatarApi(data, id) {
		return request({
			url: `/nguoi-dung/upload-avatar?id=${id}`,
			method: "POST",
			data,
		});
	}
}

export const userService = new UserService();
