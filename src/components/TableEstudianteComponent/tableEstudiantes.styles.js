import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  },
  tableHeader: {
    backgroundColor: "#3d97ef",
  },
  collapseContent: {
    backgroundColor: "#f9f9f9",
    padding: theme.spacing(2),
  },
}));

export default useStyles;
