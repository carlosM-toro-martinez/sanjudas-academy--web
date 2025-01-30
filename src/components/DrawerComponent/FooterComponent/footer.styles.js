import { makeStyles } from "@material-ui/core/styles";
import conver from "../../../assets/images/logos/3.png";

export const useStyles = makeStyles((theme) => ({
  footer: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: "2rem",
    bottom: 0,
  },
  container: {
    display: "flex",
    padding: theme.spacing(0, 5),
    marginTop: "2rem",
  },
  logoSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: ".5rem",
    flex: 0.4,
    marginLeft: "-2rem",
  },
  logo: {
    width: 150,
    height: 150,
    backgroundImage: `url(${conver})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  copyRight: {
    fontSize: "1.2rem",
  },
  link: {
    color: theme.palette.text.secondary,
    textDecoration: "none",
    "&:hover": {
      color: theme.palette.text.primary,
    },
  },
  iconButton: {
    display: "flex",
    gap: "1rem",
    borderRadius: 0,
    color: theme.palette.text.secondary,
    "&:hover": {
      color: theme.palette.text.primary,
    },
  },
  navLink: {
    marginLeft: theme.spacing(3),
    color: theme.palette.text.secondary,
    textDecoration: "none",
    "&:hover": {
      color: theme.palette.text.primary,
    },
  },
}));
