/** @format */

import { SET_USER_INFO } from "../types/userType";

const DEFAULT_STATE = {
	userInfo: null,
};

const stringify = localStorage.getItem("USER_INFO");

if (stringify) {
	DEFAULT_STATE.userInfo = JSON.parse(stringify);
}

export const userReducer = (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case SET_USER_INFO:
			state.userInfo = action.payload;
			break;
		default:
			break;
	}
	return { ...state };
};
