import React, { useState } from "react";
import { useStyles } from "./dashboard.styles";
import DrawerComponent from "../DrawerComponent";

function DashboardComponent({ children }) {
  const classes = useStyles();
  const [count, setCount] = useState(0);
  return (
    <div style={{ display: "flex" }}>
      <DrawerComponent>{children}</DrawerComponent>
    </div>
  );
}

export default DashboardComponent;
