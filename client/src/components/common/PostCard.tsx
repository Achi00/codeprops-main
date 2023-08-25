import { Link } from "@pankod/refine-react-router-v6";
import {
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  Stack,
} from "@pankod/refine-mui";
import { Button } from "@pankod/refine-mui";
import { PostCardProps } from "interfaces/property";
import { useGetIdentity } from "@pankod/refine-core";
import { useState } from "react";
import { GoogleButton } from "pages/login";

const PostCard = ({
  id,
  title,
  tech,
  description,
  photo,
  photo2,
  photo3,
  photo4,
  postType,
}: PostCardProps) => {
  const [hover, setHover] = useState(false);
  const { data: user } = useGetIdentity();
  return (
    <Card
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      component={Link}
      to={`/posts/show/${id}`}
      sx={{
        maxWidth: { lg: "400px", md: "350px", xs: "280px" },
        height: "350px",
        borderRadius: "25px",
        backgroundColor: "#131B24",
        padding: "2vmin",
        marginTop: "30px",
        marginBottom: "30px",
        cursor: "pointer",
        color: "#000",
      }}
      elevation={0}
    >
      <CardMedia
        component="img"
        width="250px"
        height="170px"
        image={photo}
        alt="card Image"
        sx={{
          borderRadius: "25px",
          cursor: "pointer",
          "&:hover": {
            opacity: 1,
            backgroundColor: "black",
            filter: "brightness(50%)",
            transition: "all 0.2s ease",
            objectFit: "cover",
          },
        }}
      />
      {hover === true ? (
        <Box
          component="div"
          sx={{
            position: "relative",
            bottom: "25%",
            left: "50%",
            transform: "translate(-50%, 50%)",
          }}
        >
          {user ? (
            <Button
              sx={{
                zIndex: "10",
                position: "absolute",
                bottom: "30%",
                left: "50%",
                transform: "translate(-50%, 50%)",
                backgroundColor: "#0D1318",
                color: "white",
                fontSize: "18px",
                fontWeight: "900",
                padding: "0.5rem",
                pointerEvents: "none",
                "&:hover": {
                  backgroundColor: "rgba(71, 91, 232, 0.7)",
                },
              }}
            >
              Explore More
            </Button>
          ) : (
            <Button
              sx={{
                zIndex: "10",
                position: "absolute",
                bottom: "30%",
                left: "50%",
                transform: "translate(-50%, 50%)",
                backgroundColor: "#0D1318",
                color: "white",
                fontSize: "18px",
                fontWeight: "900",
                padding: "0.5rem",
                pointerEvents: "none",
                "&:hover": {
                  backgroundColor: "rgba(71, 91, 232, 0.7)",
                },
              }}
            >
              Explore More
            </Button>
          )}
        </Box>
      ) : null}
      <Box component="div" sx={{ position: "relative" }}>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: "10px",
            padding: "5px",
            textTransform: "capitalize",
            textAlign: "center",
          }}
        >
          <Stack direction="column">
            <Typography fontSize={22} fontWeight={700} color="#B7BEC5">
              {title}
            </Typography>
            <Typography fontSize={20} fontWeight={500} color="#999999">
              {postType}
            </Typography>
            <Typography fontSize={18} fontWeight={500} color="#999999">
              {tech}
            </Typography>
          </Stack>
        </CardContent>
      </Box>
    </Card>
  );
};

export default PostCard;
