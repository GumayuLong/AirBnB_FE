import { request } from "../configs/api";

class CommentService {
	fetchCommentListApi(id) {
		return request({
			url: `/binh-luan/lay-binh-luan-theo-phong/${id}/`,
			method: "GET",
		});
	}

	createCommentApi(data) {
		return request({
			url: "/binh-luan",
			method: "POST",
			data,
		});
	}
}

export const commentService = new CommentService();
