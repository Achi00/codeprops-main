import { Typography, Box, Stack, Link } from "@pankod/refine-mui";
import { useDelete, useGetIdentity, useShow } from "@pankod/refine-core";
import { useParams, useNavigate } from "@pankod/refine-react-router-v6";
import { Button } from "@pankod/refine-mui";
import { Delete, Edit } from "@mui/icons-material";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import GitHubIcon from "@mui/icons-material/GitHub";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { CustomButton, Loading } from "components";
import { motion } from "framer-motion";
import { revealVariants } from "assets/motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactHtmlParser from "react-html-parser";
import Slider from "components/common/Slider";

const PostDetails = () => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity();
  const { id } = useParams();
  const { mutate } = useDelete();
  const { queryResult } = useShow();

  const { data, isLoading, isError } = queryResult;

  const postDetails = data?.data ?? {};
  const {
    title,
    tech,
    description,
    header,
    header2,
    header3,
    photo,
    photo2,
    photo3,
    photo4,
    postType,
    github,
    preview,
    imgurl,
  } = postDetails;

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div>Something went wrong!</div>;
  }

  const isCurrentUser =
    user && postDetails && user.email === postDetails.creator.email;

  const handleDeletePost = () => {
    const response = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (response) {
      mutate(
        {
          resource: "posts",
          id: id as string,
        },
        {
          onSuccess: () => {
            navigate("/posts");
          },
        }
      );
    }
  };

  interface CodeProps {
    text: string;
  }

  const StyledText: React.FC<CodeProps> = ({ text }) => {
    const codeRegex = /<code>([\s\S]*?)<\/code>/g;
    const linkRegex = /<a href="([^"]+)"\s*>(.*?)<\/a>/g;
    const imgRegex =
      /<img src="([^"]+)"\s*alt="([^"]+)"\s*class="([^"]+)"\s*(\/?)>/g;

    const content = text.split(codeRegex);

    return (
      <>
        {content.map((part, index) => {
          if (index % 2 === 0) {
            // Text content (outside of <code> tags)
            const modifiedPart = part
              .replace(
                linkRegex,
                '<a href="$1" target="_blank" rel="noopener noreferrer">$2</a>'
              )
              .replace(imgRegex, '<img src="$1" alt="$2" class="$3" />');

            return (
              <div key={index} className="textContent">
                {ReactHtmlParser(modifiedPart)}
              </div>
            );
          } else {
            // Code content (inside <code> tags)
            return (
              <div className="textContent">
                <SyntaxHighlighter key={index} language="jsx" style={oneDark}>
                  {part}
                </SyntaxHighlighter>
              </div>
            );
          }
        })}
      </>
    );
  };

  const images = imgurl;

  return (
    <Box
      component={motion.div}
      variants={revealVariants}
      initial="hidden"
      whileInView="show"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      // sx={{ textTransform: "capitalize" }}
      my={{ lg: 10, md: 8, xs: 2 }}
      mx={{ lg: 10, md: 8, xs: 2 }}
    >
      <Stack
        direction={{ lg: "row", md: "row", sm: "row", xs: "column" }}
        display="flex"
        justifyContent="center"
        gap="4vmin"
        pb="4vmin"
      >
        <Typography
          component="h1"
          fontSize={{ lg: "2vw", md: 25, xs: 20 }}
          width={{ lg: 400, md: 300, xs: 250 }}
          fontWeight={900}
          color="#000000"
        >
          {title}
        </Typography>
        <Typography
          component="h2"
          fontSize={{ lg: "1vw", md: 15, xs: 12 }}
          width={{ lg: 400, md: 300, xs: 250 }}
          fontWeight={600}
          color="#000000"
        >
          {description}
        </Typography>
      </Stack>
      <div className="slider-container">
        <Slider images={images} />
      </div>
      <Typography component="h2" fontSize={25} fontWeight={700} color="#9D9D9D">
        {postType}
      </Typography>
      <Box component="div">
        <Stack mt="25px" direction="column" gap={2}>
          {isCurrentUser ? (
            <CustomButton
              title={!isCurrentUser ? "Save Post" : "Edit"}
              width="100px"
              height="30px"
              backgroundColor="#0D1318"
              color="#FCFCFC"
              fullWidth
              disabled={isCurrentUser ? false : true}
              icon={!isCurrentUser ? <SaveAltIcon /> : <Edit />}
              handleClick={() => {
                if (isCurrentUser) {
                  navigate(`/posts/edit/${postDetails._id}`);
                }
              }}
            />
          ) : null}
          {isCurrentUser ? (
            <CustomButton
              title={"Delete"}
              backgroundColor={!isCurrentUser ? "#2ED480" : "#d42e2e"}
              color="#FCFCFC"
              width="100px"
              height="30px"
              fullWidth
              disabled={isCurrentUser ? false : true}
              icon={!isCurrentUser ? null : <Delete />}
              handleClick={() => {
                if (isCurrentUser) handleDeletePost();
              }}
            />
          ) : null}
        </Stack>
      </Box>
      <Stack
        padding="5vmin"
        direction={{ lg: "row", md: "row", xs: "column" }}
        gap="20px"
        display="flex"
        justifyContent="space-between"
      >
        <Button
          href={preview}
          target="_blank"
          sx={{
            backgroundColor: "#0D1318",
            width: "150px",
            height: "50px",
            color: "#fff",
            fontWeight: "700",
            fontSize: "20px",
            textTransform: "capitalize",
            transition: "0.2s ease-in-out",
            alignItems: "center",
            "&:hover": {
              backgroundColor: "#0D1318",
              boxShadow: "5px 10px 25px 8px rgba(176, 176, 176, 0.8)",
            },
          }}
        >
          Preview <RemoveRedEyeIcon sx={{ ml: "5px" }} />
        </Button>
        <Button
          href={github}
          target="_blank"
          sx={{
            backgroundColor: "#0D1318",
            width: "150px",
            height: "50px",
            color: "#fff",
            fontWeight: "700",
            fontSize: "20px",
            textTransform: "capitalize",
            alignItems: "center",
            transition: "0.2s ease-in-out",
            "&:hover": {
              backgroundColor: "#0D1318",
              boxShadow: "5px 10px 25px 8px rgba(176, 176, 176, 0.8)",
            },
          }}
        >
          GitHub
          <GitHubIcon sx={{ ml: "5px" }} />
        </Button>
      </Stack>
      <Stack
        width="100%"
        direction="column"
        display="flex"
        justifyContent="center"
      >
        <Box
          component="div"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <img
            src={photo}
            style={{ borderRadius: "20px", maxWidth: "70%", height: "auto" }}
            alt="Image"
          />
        </Box>
        <Stack
          py={2}
          direction="column"
          width="100%"
          display="flex"
          justifyContent="center"
          alignItems={{ lg: "flex-end", md: "flex-end", xs: "center" }}
        >
          <Typography
            fontSize={25}
            fontWeight={200}
            width={{ lg: "500px", md: "350px", xs: "200px" }}
            color="#000000"
          >
            <strong>Used Libraries</strong>
            <br />
            {tech}
          </Typography>
        </Stack>
        <Box
          component="div"
          display="flex"
          justifyContent="center"
          ml={{ lg: "10vmin", md: "4vmin" }}
        >
          <Typography
            component="h3"
            width={{ lg: 1250, md: 560, sm: 400, xs: 300 }}
            py={5}
            fontSize={{ lg: "2vmin", md: "3vmin", xs: "2.5vmin" }}
            fontWeight={500}
            color="#000000"
          >
            <StyledText text={header} />
          </Typography>
        </Box>
        <Box
          component="div"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <img
            src={photo2}
            style={{ borderRadius: "20px", maxWidth: "70%", height: "auto" }}
            alt="Image"
          />
        </Box>
        <Box
          component="div"
          display="flex"
          justifyContent="center"
          ml={{ lg: "10vmin", md: "4vmin" }}
        >
          <Typography
            component="h3"
            width={{ lg: 1250, md: 560, sm: 400, xs: 300 }}
            py={5}
            fontSize="2vmin"
            fontWeight={500}
            color="#000000"
          >
            <StyledText text={header2} />
          </Typography>
        </Box>
        <Box
          component="div"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <img
            src={photo3}
            style={{ borderRadius: "20px", maxWidth: "70%", height: "auto" }}
            alt="Image"
          />
        </Box>
        <Box
          component="div"
          display="flex"
          justifyContent="center"
          ml={{ lg: "10vmin", md: "4vmin" }}
        >
          <Typography
            component="h3"
            width={{ lg: 1250, md: 560, sm: 400, xs: 300 }}
            py={5}
            fontSize={{ lg: "2vmin", md: "3vmin", xs: "2.5vmin" }}
            fontWeight={500}
            color="#000000"
          >
            <StyledText text={header3} />
          </Typography>
        </Box>
        <Box
          component="div"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <img
            src={photo4}
            style={{ borderRadius: "20px", maxWidth: "70%", height: "auto" }}
            alt="Image"
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default PostDetails;
