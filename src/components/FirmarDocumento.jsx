import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import Grid from "@material-ui/core/Grid";
import axios from "axios";

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

const FirmarDocumento = ({
	next,
	pin,
	alias,
	documentoInput,
	payload,
	numberPages,
	...props
}) => {
	const classes = useStyles();
	const [called, setCalled] = React.useState(false);
	const [error, setError] = React.useState(null);
	const [loading, setLoading] = React.useState(false);
	const [doc, setDoc] = React.useState("");

	const firmarDocumento = () => {
		setLoading(true);
		setCalled(true);
		setError(null);
		axios({
			method: "post",
			url: "http://localhost:3001/sign_doc",
			data: {
				pin,
				alias,
				input: documentoInput,
				payload: payload,
				numberPages,
			},
		})
			.then(({ data }) => {
				setDoc(data.message);
			})
			.catch((err) => {
				setError(err.response?.data?.error || err.message);
			})
			.finally(() => setLoading(false));
	};

	const handleRetry = () => {
		firmarDocumento();
	};

	const handleOpen = () => {
		axios({
			url: `http://localhost:3001/open/${doc}`,
		});
	};

	const handleClose = () => {
		axios({
			url: "http://localhost:3001/close",
		});
	};

	React.useEffect(() => {
		firmarDocumento();
	}, []);

	if (loading || !called)
		return (
			<Grid
				className={classes.rootLoader}
				container
				direction="column"
				justify="center"
				alignItems="center"
			>
				<CircularProgress />
			</Grid>
		);

	if (error)
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
					<Typography variant="subtitle2">{error}</Typography>
				</Box>
				<Box mb={1}>
					<Button
						variant="contained"
						color="primary"
						onClick={handleRetry}
					>
						Reintentar
					</Button>
				</Box>
			</Grid>
		);

	return (
		<Grid
			className={classes.rootLoader}
			container
			direction="column"
			justify="center"
			alignItems="center"
		>
			<Box mb={1}>
				<ThumbUpIcon color="primary" fontSize="large" />
			</Box>
			<Box mb={1}>
				<Typography variant="subtitle2">Documento firmado</Typography>
			</Box>
			<Box mb={1}>
				<Button
					variant="contained"
					color="primary"
					onClick={handleOpen}
				>
					Ver documento
				</Button>
			</Box>
			<Button onClick={handleClose}>Cerrar</Button>
		</Grid>
	);
};

export default FirmarDocumento;
