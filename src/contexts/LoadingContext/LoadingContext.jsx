import { Spin } from "antd";
import { createContext, useState } from "react";
import "../../scss/loading.scss";

const DEFAULT_STATE = {
	isLoading: false,
};
export const loadingContext = createContext(DEFAULT_STATE);

export const LoadingProvider = (props) => {
	const [state, setState] = useState(DEFAULT_STATE);

	document.querySelector("body").style.overflow = state.isLoading
		? "hidden"
		: "unset";

	return (
		<loadingContext.Provider value={[state, setState]}>
			{state.isLoading && (
				<div className="wrapper-spin">
					<Spin size="large" />
				</div>
			)}
			{props.children}
		</loadingContext.Provider>
	);
};
