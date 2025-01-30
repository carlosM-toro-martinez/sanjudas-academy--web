import { useContext, useState } from "react";
import {
  Box,
  Divider,
  Drawer,
  List,
  Typography,
  useTheme,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SchoolSharpIcon from "@mui/icons-material/SchoolSharp";
import StoreIcon from "@mui/icons-material/Store";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import useStyles from "./drawer.styles";
import { Link, useLocation } from "react-router-dom";
import { MainContext } from "../../context/MainContext";
import NavBarComponent from "./NavBarComponent";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import FooterComponent from "./FooterComponent";

export default function DrawerComponent({ children }) {
  const { open, setOpen } = useContext(MainContext);

  const classes = useStyles({ open });
  const location = useLocation();

  const handleDrawerOpen = () => setOpen(!open);

  const routes = [
    {
      path: "/",
      name: "Inicio",
      icon: <HomeIcon sx={{ color: "#fff" }} />,
    },
    {
      path: "/academia",
      name: "Academia",
      icon: <SchoolSharpIcon sx={{ color: "#fff" }} />,
    },
    {
      path: "/movimiento-inventario",
      name: "movimientos",
      icon: <ShoppingCartIcon sx={{ color: "#fff" }} />,
    },
    {
      path: "/movimiento-caja",
      name: "Caja",
      icon: <AttachMoneyIcon sx={{ color: "#fff" }} />,
    },
    {
      path: "/almacenes",
      name: "Almacenes",
      icon: <StoreIcon sx={{ color: "#fff" }} />,
    },
    {
      path: "/trabajadores",
      name: "Trabajadores",
      icon: <GroupIcon sx={{ color: "#fff" }} />,
    },
  ];

  return (
    <Box
      sx={{ display: "flex", flexDirection: "row", backgroundColor: "#f9fafc" }}
    >
      <Drawer
        variant="permanent"
        className={open ? classes.drawerOpen : classes.drawerClose}
        classes={{
          paper: open ? classes.drawerOpen : classes.drawerClose,
        }}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: "#1f1f21",
            color: "white",
            margin: ".1rem",
            borderRadius: ".5rem",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "gray",
              borderRadius: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#1f1f21",
            },
          },
        }}
      >
        <div className={classes.drawerHeader}>
          <Typography
            variant="h1"
            style={{
              textAlign: "center",
              fontSize: "2rem",
              margin: "2rem 0 1rem 0",
              fontWeight: "bold",
            }}
          >
            {open ? "Bienvenido" : <WavingHandIcon />}
          </Typography>
        </div>
        <Divider sx={{ backgroundColor: "#c0c0c0", margin: "1rem 0 0 0" }} />
        <List
          sx={{
            "& .MuiDrawer-list": {
              "&::-webkit-scrollbar": {
                width: "8px",
                height: "80%",
                marginTop: "2rem",
                borderRadius: "2rem",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#fff",
                borderRadius: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#2c2c2e",
              },
            },
          }}
        >
          {routes.slice(0, 9).map(({ path, name, icon }) => (
            <div key={path} style={{ padding: "8px", display: "block" }}>
              <Link
                to={path}
                style={{
                  display: "flex",
                  justifyContent: open ? "flex-start" : "center",
                  alignItems: "center",
                  textDecoration: "none",
                  backgroundColor:
                    path === "/"
                      ? location.pathname === path
                        ? "#3d97ef"
                        : ""
                      : location.pathname.includes(path)
                      ? "#3d97ef"
                      : "",
                  color: "white",
                  padding: "10px 10px 10px 20px",
                  borderRadius: "4px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                  }}
                >
                  <span
                    style={{
                      marginRight: "8px",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    {icon}
                  </span>
                  <Typography
                    variant="button"
                    gutterBottom
                    style={{
                      display: open ? "block" : "none",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    {name}
                  </Typography>
                </Box>
              </Link>
            </div>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          flexDirection: "column",
          backgroundColor: "#f9fafc",
        }}
      >
        <NavBarComponent handleDrawerOpen={handleDrawerOpen} open={open} />
        {children}
        <FooterComponent />
      </Box>
    </Box>
  );
}
