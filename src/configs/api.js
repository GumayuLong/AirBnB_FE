import Axios from "axios";
import { store } from "../store/config.js";

const request = Axios.create({
	baseURL: `${process.env.REACT_APP_BASE_URL_DEV}`,
	headers: {
		authorization: process.env.REACT_APP_ACCESS_TOKEN,
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
