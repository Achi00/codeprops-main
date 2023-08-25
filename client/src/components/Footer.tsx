import { Box, Stack, Typography } from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import logo from "../assets/codeprops.png";
import { useTable } from "@pankod/refine-core";

const Footer = () => {
  const {
    tableQueryResult: { isLoading },
  } = useTable();
  if (isLoading) return null;

  return (
    <Box
      component="div"
      sx={{
        borderTop: '1xp solid black',
        background: "linear-gradient(130deg, #fff, #adb5bd, #fff)",
        width: "100%",
        height: "200px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack
        width="90%"
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <img
          style={{ maxWidth: "20%", height: "auto" }}
          src={logo}
          alt="logo"
        />
        <Stack direction="column" gap={5}>
          <a
            className="media"
            href="https://twitter.com/Code_Props"
            target="_blank"
          >
            Follow us on Twitter
            <TwitterIcon />
          </a>

          <Typography fontSize={16} fontWeight={900} color="#000">
            contact@codeprops.com
          </Typography>
        </Stack>
      </Stack>
      {/* <Stack direction="row" gap={2} alignItems="center">
        <Typography fontSize={25} fontWeight={900} color="#9b9b9b">
          Contact:
        </Typography>
        <Typography fontSize={18} fontWeight={900} color="#fff">
          contact@codeprops.com
        </Typography>
      </Stack> */}
    </Box>
  );
};

export default Footer;
