import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import List from "@material-ui/core/List";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Box from "@material-ui/core/Box";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
import Radio from "@material-ui/core/Radio";
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

const ListarCertificados = ({ next, setAlias, pin, ...props }) => {
	const classes = useStyles();
	const [called, setCalled] = React.useState(false);
	const [error, setError] = React.useState(null);
	const [loading, setLoading] = React.useState(false);
	const [aliasInput, setAliasInput] = React.useState("");
	const [certificados, setCertificados] = React.useState([]);
	const getCertificados = () => {
		setLoading(true);
		setCalled(true);
		setError(null);
		axios({
			url: "http://localhost:3001/key_store_list",
			params: {
				pin,
			},
		})
			.then(({ data }) => {
				setCertificados(data);
			})
			.catch((err) => {
				setError(err.response?.data?.error || err.message);
			})
			.finally(() => setLoading(false));
	};

	const handleNext = () => {
		if (aliasInput !== "") {
			setAlias(aliasInput);
			next(2);
		}
	};

	const back = () => {
		next(0);
	};

	React.useEffect(() => {
		getCertificados();
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
				<Button variant="contained" color="primary" onClick={back}>
					Regresar
				</Button>
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
				<Typography variant="h6">Selecciona un certificado</Typography>
			</Box>
			<Box className={classes.root} mb={1}>
				<List component="nav" disablePadding>
					{certificados.map((i) => (
						<ListItem
							key={i.id}
							selected={aliasInput === i.value}
							button
							onClick={() =>
								setAliasInput(
									i.value === aliasInput ? "" : i.value
								)
							}
						>
							<ListItemIcon>
								<Radio
									checked={aliasInput === i.value}
									value={i.value}
									name="alias"
									color="primary"
								/>
							</ListItemIcon>
							<ListItemText primary={i.value} />
						</ListItem>
					))}
				</List>
			</Box>
			<Box>
				<Button
					onClick={handleNext}
					variant="contained"
					color="primary"
					disabled={aliasInput === ""}
				>
					Siguiente
				</Button>
			</Box>
		</Grid>
	);
};

export default ListarCertificados;
