import {request} from "../configs/api";

class BookRoomService {
    fetchBookRoomApi () {
        return request({
            url: '/dat-phong',
            method: 'GET',
        })
    }

    bookRoomDetailApi(id) {
        return request({
            url: `/dat-phong/${id}`,
            method: 'GET',
        })
    }

    bookRoomApi(data) {
        return request({
            url: '/dat-phong',
            method: 'POST',
            data,
        })
    }

    fetchBookRoomFromUser(id) {
        return request({
            url: `/dat-phong/lay-theo-nguoi-dung/${id}`,
            method: 'GET',
        })
    }
}

export const bookRoomService = new BookRoomService();