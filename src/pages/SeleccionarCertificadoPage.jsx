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

const SeleccionarCertificado = (props) => {
	const classes = useStyles();
	const url = new URL(`http://localhost:666${props.location.search}`);
	const payload = url.searchParams.get("payload");
	const documentoInput = url.searchParams.get("origen");
	const error = parseInt(url.searchParams.get("error"));
	const numberPages = parseInt(url.searchParams.get("numberPages"));

	const [activeStep, setActiveStep] = React.useState(0);
	const [pin, setPin] = React.useState("");
	const [alias, setAlias] = React.useState("");

	const handleClose = () => {
		axios({
			url: "http://localhost:3001/closeAll",
		});
	};

	return (
		<div className={classes.root}>
			<Grid
				container
				direction="column"
				justify="center"
				alignItems="center"
			>
				{error === 1 ? (
					<ErrorDocumento />
				) : (
					{
						0: (
							<IngresarPin
								next={setActiveStep}
								setPin={setPin}
								documentoInput={documentoInput}
							/>
						),
						1: (
							<ListarCertificados
								next={setActiveStep}
								setAlias={setAlias}
								pin={pin}
							/>
						),
						2: (
							<FirmarDocumento
								next={setActiveStep}
								pin={pin}
								alias={alias}
								documentoInput={documentoInput}
								payload={payload}
								numberPages={numberPages}
							/>
						),
					}[activeStep]
				)}
			</Grid>
			<AppBar
				position="fixed"
				color="transparent"
				className={classes.appBar}
				elevation={0}
			>
				<Grid
					container
					direction="row"
					justify="flex-end"
					alignItems="center"
				>
					<Tooltip title="Cerrar aplicación">
						<IconButton
							disableFocusRipple
							disableRipple
							className={classes.button}
							onClick={handleClose}
							size="small"
						>
							<PowerSettingsNewIcon />
						</IconButton>
					</Tooltip>
				</Grid>
			</AppBar>
		</div>
	);
};

const SeleccionarCertificadoPage = withRouter(SeleccionarCertificado);

export default SeleccionarCertificadoPage;
