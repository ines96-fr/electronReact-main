import React from "react";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import axios from "axios";
import ListarCertificados from "../components/ListarCertificados";
import IngresarPin from "../components/IngresarPin";
import FirmarDocumento from "../components/FirmarDocumento";
import ErrorDocumento from "../components/ErrorDocumento";

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
	},
	appBar: {
		top: "auto",
		bottom: 0,
	},
	button: {
		textTransform: "capitalize",
		margin: theme.spacing(0, 1, 1, 0),
	},
}));

const HomePage = (props) => {
	const classes = useStyles();


	const handlePrint = () => {
		axios({
			url: "http://10.10.40.121:3001/print?url=https://github.com/amazon-connect/amazon-connect-streams#readme",
		}).then(r=>console.log(r.data))
	};

	return (
		<div className={classes.root}>
		
			<button onClick={handlePrint}>Imprimir</button>
		</div>
	);
};

export default HomePage;
