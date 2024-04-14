'use client'

import { Box, Typography } from "@mui/material";
import { useContext } from "react";
import { SessionUserContext } from "../layout";

export default function Page() {
  let { sessionUser } = useContext(SessionUserContext);

  return (
    <Box>
      {`Hello ${sessionUser ? sessionUser.name : 'not logged in'}`}
    </Box>
  );
}