import React from "react";
import { Grid, Typography, Paper } from "@material-ui/core";
import { useStyles } from "./academia.styles";
import { Link } from "react-router-dom";
import SchoolSharpIcon from "@mui/icons-material/SchoolSharp";
import PeopleIcon from "@mui/icons-material/People";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DrawerComponent from "../../components/DrawerComponent";

function Academia() {
  const classes = useStyles();

  const items = [
    {
      title: "Estudiantes",
      icon: <PeopleIcon sx={{ fontSize: "5rem" }} />,
      path: "/academia/estudiantes",
    },
    {
      title: "Materias",
      icon: <CreditCardIcon sx={{ fontSize: "5rem" }} />,
      path: "/academia/materias",
    },
    {
      title: "Docentes",
      icon: <SchoolSharpIcon sx={{ fontSize: "5rem" }} />,
      path: "/academia/docentes",
    },
  ];

  return (
    <DrawerComponent>
      <Grid container spacing={2} className={classes.container}>
        {items.map((item, index) => (
          <Grid item xs={4} sm={3} md={4} key={index}>
            <Link to={item.path} style={{ textDecoration: "none" }}>
              <Paper className={classes.paper} elevation={1}>
                <div className={classes.icon}>{item.icon}</div>
                <Typography variant="h6" className={classes.title}>
                  {item.title}
                </Typography>
              </Paper>
            </Link>
          </Grid>
        ))}
      </Grid>
    </DrawerComponent>
  );
}

export default Academia;
