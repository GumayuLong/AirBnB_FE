import Axios from "axios";
import { store } from "../store/config.js";

const request = Axios.create({
	baseURL: `http://localhost:8080/api`,
	headers: {
		authorization:
			"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjo3LCJlbWFpbCI6ImJhb3Rpbmh1eW5oQGdtYWlsLmNvbSIsImZ1bGxfbmFtZSI6IlRpbkFkbWluIiwicm9sZSI6IkFETUlOIn0sImlhdCI6MTcwNDc2MTYwNCwiZXhwIjoxNzM2MzE5MjA0fQ.JEU4pDG9NK0K0z_pa_69eu0iurKGEGizI2rHAa-aTy0",
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
