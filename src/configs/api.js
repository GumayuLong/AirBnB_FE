import Axios from "axios";
import { store } from "../store/config.js";

const request = Axios.create({
	baseURL: `http://localhost:8080/api`,
	headers: {
		authorization:
			"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjo2LCJlbWFpbCI6Imxvbmd0bzEyNUBnbWFpbC5jb20iLCJmdWxsX25hbWUiOiJZdUxvbmciLCJyb2xlIjoiQURNSU4ifSwiaWF0IjoxNzA0OTY0ODAxLCJleHAiOjE3MzY1MjI0MDF9.7nfYOSHeCqYuTcwU4RFhSkMVllxImCWQs6YxReNTTfY",
	},
});

request.interceptors.request.use((config) => {
	let token = null;
	const state = store.getState();

	if (state.userReducer.userInfo) {
		token = state.userReducer.userInfo.token;
		config.headers.token = `${token}`;
	}
	return config;
});

export { request };
