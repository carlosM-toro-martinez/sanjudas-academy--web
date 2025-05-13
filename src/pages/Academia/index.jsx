import React from "react";
import { Grid, Typography, Paper } from "@material-ui/core";
import { useStyles } from "./academia.styles";
import { Link } from "react-router-dom";
import SchoolSharpIcon from "@mui/icons-material/SchoolSharp";
import PeopleIcon from "@mui/icons-material/People";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DrawerComponent from "../../components/DrawerComponent";
import EarbudsIcon from "@mui/icons-material/Earbuds";
import ChairAltIcon from "@mui/icons-material/ChairAlt";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

function Academia() {
  const classes = useStyles();

  const items = [
    {
      title: "Estudiantes",
      icon: <PeopleIcon sx={{ fontSize: "5rem" }} />,
      path: "/instituto/estudiantes",
    },
    {
      title: "Materias",
      icon: <CreditCardIcon sx={{ fontSize: "5rem" }} />,
      path: "/instituto/materias",
    },
    {
      title: "Docentes",
      icon: <SchoolSharpIcon sx={{ fontSize: "5rem" }} />,
      path: "/instituto/docentes",
    },
  ];

  const itemsCarreras = [
    {
      title: "Carreras",
      icon: <EarbudsIcon sx={{ fontSize: "5rem" }} />,
      path: "/instituto/carreras",
    },
    // {
    //   title: "Ambientes",
    //   icon: <ChairAltIcon sx={{ fontSize: "5rem" }} />,
    //   path: "/instituto/ambientes",
    // },
    {
      title: "Estudiantes",
      icon: <PeopleIcon sx={{ fontSize: "5rem" }} />,
      path: "/instituto/estudiantes-carreras",
    },
    // {
    //   title: "Inscripciones",
    //   icon: <ChecklistRtlIcon sx={{ fontSize: "5rem" }} />,
    //   path: "/instituto/inscripciones",
    // },
    {
      title: "Mensualidades",
      icon: <AttachMoneyIcon sx={{ fontSize: "5rem" }} />,
      path: "/instituto/mensualidades",
    },
  ];

  return (
    <DrawerComponent>
      {/* <Typography
        variant="h6"
        style={{
          marginTop: "3rem",
          fontSize: "30px",
          fontWeight: "bold",
          marginLeft: "20px",
        }}
      >
        Preuniveritarios y nivelacion
      </Typography>
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
      </Grid> */}
      <Typography
        variant="h6"
        style={{
          marginTop: "3rem",
          fontSize: "30px",
          fontWeight: "bold",
          marginLeft: "20px",
        }}
      >
        Carreras
      </Typography>
      <Grid container spacing={2} className={classes.container}>
        {itemsCarreras.map((item, index) => (
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
