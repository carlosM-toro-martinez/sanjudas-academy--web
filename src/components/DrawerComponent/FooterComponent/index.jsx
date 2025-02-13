import React from "react";
import {
  Grid,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import { useStyles } from "./footer.styles";
import { Box } from "@mui/material";

function FooterComponent() {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Box className={classes.container}>
        <div className={classes.logoSection}>
          <div className={classes.logo} />
          <Typography
            variant="body2"
            color="textSecondary"
            className={classes.copyRight}
          >
            © 2025 copyright
          </Typography>
        </div>
        <Box
          sx={{
            flex: 0.55,
            display: "flex",
            justifyContent: "flex-start",
            gap: "15rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h6"
              style={{ marginLeft: "1rem", fontWeight: "bold" }}
            >
              Social
            </Typography>

            <IconButton
              aria-label="whatsapp"
              href="https://wa.me/59178635209"
              target="_blank"
              rel="noopener noreferrer"
              className={classes.iconButton}
            >
              <WhatsAppIcon />
              <Typography variant="h6">Whatsapp</Typography>
            </IconButton>
            <IconButton
              aria-label="facebook"
              href="https://www.facebook.com/profile.php?id=100087789513331"
              target="_blank"
              rel="noopener noreferrer"
              className={classes.iconButton}
            >
              <FacebookIcon />
              <Typography variant="h6">Facebook</Typography>
            </IconButton>
            <IconButton
              aria-label="instagram"
              href="https://www.instagram.com/encuentrapotosi/"
              target="_blank"
              rel="noopener noreferrer"
              className={classes.iconButton}
            >
              <InstagramIcon />
              <Typography variant="h6">Instagram</Typography>
            </IconButton>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" style={{ fontWeight: "bold" }}>
              Contactos
            </Typography>
            <List>
              <ListItem style={{ padding: 0 }}>
                <ListItemText primary="Teléfono" secondary="+591 78635209" />
              </ListItem>
              {/* <ListItem style={{ padding: 0 }}>
                <ListItemText
                  primary="Dirección"
                  secondary="Calle Ejemplo, N° 123, Potosí"
                />
              </ListItem> */}
              <ListItem style={{ padding: 0 }}>
                <ListItemText
                  primary="Correo"
                  secondary="carlostorom.96@gmail.com"
                />
              </ListItem>
            </List>
          </Box>
        </Box>
      </Box>
    </footer>
  );
}

export default FooterComponent;
