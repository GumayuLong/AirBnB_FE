/** @format */

import { request } from "../configs/api";

class PositionService {
	fetchPositionDetailApi(id) {
		return request({
			url: `/vi-tri/${id}`,
			method: "GET",
		});
	}

	fetchPositionApi() {
		return request({
			url: `/vi-tri`,
			method: "GET",
		});
	}

	positionDetailApi(id) {
		return request({
			url: `/vi-tri/${id}`,
			method: "GET",
		});
	}

	fetchDeletePositionApi(id) {
		return request({
			url: `/vi-tri/${id}`,
			method: "DELETE",
		});
	}

	fetchCreatePositionApi(data) {
		return request({
			url: "/vi-tri",
			method: "POST",
			data,
		});
	}

	createUploadHinhViTriApi(id, data) {
		return request({
			url: `/vi-tri/create-upload-hinh-vi-tri?maViTri=${id}`,
			method: "POST",
			data,
		});
	}

	fetchUpdatePositionApi(id, data) {
		return request({
			url: `/vi-tri/${id}`,
			method: "PUT",
			data,
		});
	}

	putAvaPositionApi(data, id) {
		return request({
			url: `/vi-tri/upload-hinh-vi-tri?maViTri=${id}`,
			method: "PUT",
			data,
		});
	}
}

export const positionService = new PositionService();