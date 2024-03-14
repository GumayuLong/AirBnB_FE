import Axios from "axios";
import { store } from "../store/config.js";
export const BASE_URL_DEV = "http://localhost:8080/api";

const request = Axios.create({
	baseURL: `${BASE_URL_DEV}`,
	headers: {
		authorization: process.env.ACCESS_TOKEN,
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
