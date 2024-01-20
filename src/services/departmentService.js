/** @format */

import { request } from "../configs/api";

class DepartmentService {
	fetchDepartmentApi() {
		return request({
			url: `/phong`,
			method: 'GET',
		})
	}
	fetchDepartmentDetailApi(id) {
		return request({
			url: `/phong/${id}`,
			method: "GET",
		});
	}

	departmentDetailApi(ma_phong) {
		return request({
			url: `/phong/${ma_phong}`,
			method: "GET",
		})
	}

	fetchDeleteDepartmentApi(id) {
		return request({
			url: `/phong/${id}`,
			method: "DELETE",
		});
	}

	uploadAvatarDepartment(id, data) {
		return request({
			url: `/phong/upload-hinh-phong?maPhong=${id}`,
			method: "POST",
			data,
		});
	}

	fetchCreateDepartmentApi(data) {
		return request({
			url: `/phong`,
			method: "POST",
			data,
		});
	}

	updateAvaPhongApi(id, data) {
		return request({
			url: `/phong/upload-hinh-phong?maPhong=${id}`,
			method: "PUT",
			data,
		});
	}

	fetchUpdateDepartmentApi(id, data) {
		return request({
			url: `/phong/${id}`,
			method: "PUT",
			data,
		});
	}
}

export const departmentService = new DepartmentService();