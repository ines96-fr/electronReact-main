import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";

import Grid from "@material-ui/core/Grid";

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

const IngresarPin = ({ next, setPin, documentoInput, ...props }) => {
	const classes = useStyles();
	const [pinInput, setPinInput] = React.useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		if (pinInput !== "") {
			setPin(pinInput);
			next(1);
		}
	};

	return (
		<Grid
			className={classes.rootLoader}
			container
			direction="column"
			justify="center"
			alignItems="center"
		>
			<form onSubmit={handleSubmit}>
				<Box mb={1}>
					<Typography variant="h6" align="center">
						Ingresa tu PIN
					</Typography>
				</Box>
				<Box mb={1}>
					<TextField
						variant="outlined"
						fullWidth
						autoFocus
						required
						onChange={(e) => setPinInput(e.target.value)}
					/>
				</Box>
				<Box align="center">
					<Button
						type="submit"
						variant="contained"
						color="primary"
						disabled={pinInput === ""}
					>
						Siguiente
					</Button>
				</Box>
			</form>
		</Grid>
	);
};

export default IngresarPin;
