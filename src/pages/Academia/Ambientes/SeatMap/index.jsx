import React from "react";
import { Box, Grid, Typography } from "@mui/material";

const rows = 5;
const cols = 6;
const occupiedSeats = [3, 5, 8, 10, 12];

function SeatMap() {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        display: "inline-block",
      }}
    >
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Grid container spacing={1} key={rowIndex} sx={{ mb: 1 }}>
          {Array.from({ length: cols }).map((_, colIndex) => {
            const seatIndex = rowIndex * cols + colIndex;
            const isOccupied = occupiedSeats.includes(seatIndex);

            return (
              <Grid item key={seatIndex}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: isOccupied ? "error.main" : "success.main",
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: 2,
                  }}
                >
                  <Typography variant="caption" color="common.white">
                    {seatIndex + 1}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      ))}
    </Box>
  );
}

export default SeatMap;
