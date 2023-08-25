import { Box, Stack, Typography } from "@mui/material";
import cp from "../assets/cp.png";
import { useEffect, useState } from "react";

const Loading = () => {
  return (
    <Box
      component="div"
      flexDirection="column"
      sx={{
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
        display: "flex",
        zIndex: '10',
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img width="20%" height="auto" src={cp} alt="cp" />
      <Stack direction="row">
        <Typography
          fontSize={{lg: 50, md: 40, sm: 30, xs: 25}}
          fontWeight={700}
          color="#000"
          className="loading-text"
        >
          Loading
        </Typography>
        <Typography
          fontSize={{lg: 50, md: 40, sm: 30, xs: 25}}
          fontWeight={700}
          borderRadius="50%"
          color="#343a40"
          className="loading-text"
        >
          ...
        </Typography>
      </Stack>
    </Box>
  );
};

export default Loading;
