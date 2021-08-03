import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import Button from "@material-ui/core/Button";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";

const useStyles = makeStyles((theme) => ({
	rootLoader: {
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		position: "fixed",
		backgroundColor: theme.palette.background.paper,
	},
	root: {
		width: 320,
	},
}));

const ErrorDocumento = () => {
	const classes = useStyles();
	const handleClose = () => {
		axios({
			url: "http://localhost:3001/close",
		});
	};

	return (
		<Grid
			className={classes.rootLoader}
			container
			direction="column"
			justify="center"
			alignItems="center"
		>
			<Box mb={1}>
				<ErrorOutlineIcon color="error" fontSize="large" />
			</Box>
			<Box mb={1}>
				<Typography variant="subtitle2">
					Hubo un error al recuperar el documento
				</Typography>
			</Box>
			<Button variant="contained" color="primary" onClick={handleClose}>
				Aceptar
			</Button>
		</Grid>
	);
};

export default ErrorDocumento;
