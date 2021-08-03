import React from "react";
import { Switch, Route } from "react-router-dom";
import SeleccionarCertificado from "./pages/SeleccionarCertificadoPage";
const Routes = () => {
	return (
		<Switch>
			<Route path="/">
				<SeleccionarCertificado />
			</Route>
		</Switch>
	);
};

export default Routes;
