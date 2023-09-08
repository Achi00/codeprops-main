import { useGetIdentity, useList } from "@pankod/refine-core";
import { PostCard, CustomButton } from "components";
import { Typography, Box, Stack } from "@pankod/refine-mui";
import "../index.css";
import { motion } from "framer-motion";
import astronaut from "../assets/astronaut.jpg";
import astronaut2 from "../assets/astronaut-2.jpg";
import cp from "../assets/cp.png";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { useNavigate } from "@pankod/refine-react-router-v6";
import { GoogleButton } from "./login";
import SourceIcon from "@mui/icons-material/Source";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { revealVariants, textRevealVariant } from "../assets/motion.js";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import CheckIcon from "@mui/icons-material/Check";
import { Loading } from "components";

const Home = () => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity();

  const { data, isLoading, isError } = useList({
    resource: "posts",
    config: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  const latestPosts = data?.data ?? [];

  if (isLoading) return <Loading />;
  if (isError) return <Typography>Error</Typography>;

  return (
    <Box
      component="div"
      display="flex"
      justifyContent="center"
      paddingRight="200px"
      sx={{
        overflowX: "hidden",
        background: "linear-gradient(130deg, #fff, #adb5bd, #fff)",
      }}
    >
      <motion.div variants={revealVariants} initial="hidden" whileInView="show">
        <Box component="div" sx={{ marginTop: "10px" } as any}>
          {/* section 1 */}
          <Stack
            component={motion.div}
            variants={textRevealVariant(1.4)}
            sx={{ justifyContent: "center", alignItems: "center" }}
          >
            <Stack
              direction={{ lg: "row", md: "row", sm: "column" }}
              justifyContent={{
                lg: "space-between",
                md: "space-between",
                sm: "center",
                xs: "center",
              }}
              alignItems="center"
              gap="2vmin"
              p={{ lg: "5rem", md: "4rem", sm: "2rem", xs: "1rem" }}
            >
              <Box
                component={motion.div}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                gap="2vmin"
              >
                <Typography
                  color="#000"
                  sx={{ fontSize: { lg: "5vmin", md: "4vmin", sm: "2vmin" } }}
                  fontWeight={700}
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-start"
                  px={5}
                >
                  Learn, Create & Deploy
                </Typography>
                <Typography
                  color="#7c7c7c"
                  fontSize={20}
                  fontWeight={600}
                  display="flex"
                  justifyContent="flex-start"
                  px={5}
                >
                  Find Inspiration & Learn Latest Web Technologies
                </Typography>
                <Typography
                  color="#7c7c7c"
                  fontSize={18}
                  fontWeight={600}
                  display="flex"
                  justifyContent="flex-start"
                  px={5}
                >
                  Modern Design and Responive Layout
                </Typography>
                {user ? (
                  <Box component="div" ml={5}>
                    <CustomButton
                      type="submit"
                      title={"Explore More"}
                      backgroundColor="#0D1318"
                      handleClick={() => navigate("/posts")}
                      color="#fcfcfc"
                      width="180px"
                      height="50px"
                      icon={<ArrowOutwardIcon />}
                    />
                  </Box>
                ) : (
                  <Box component="div" ml={5}>
                    <GoogleButton />
                  </Box>
                )}
              </Box>
              <Box
                component="div"
                mt="50px"
                width={{ lg: "350px", md: "300px", sm: "270px", xs: "220px" }}
                sx={{
                  position: "relative",
                  background: "red",
                  display: "flex",
                  justifyContent: "center",
                  borderRadius: "35px",
                }}
              >
                <img
                  style={{
                    borderRadius: "35px",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                  width="100%"
                  height="auto"
                  src={astronaut}
                  alt="astronaut"
                />
                <Box
                  component="div"
                  className="img-circle"
                  width={{ lg: "150px", md: "120px", sm: "100px", xs: "90px" }}
                  sx={{
                    position: "absolute",
                    zIndex: "10",
                    top: "-30px",
                    right: "-50px",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img width="70%" height="auto" src={cp} alt="cp" />
                </Box>
              </Box>
            </Stack>
          </Stack>
          {/* middle sector */}
          <Stack
            direction={{ lg: "row", md: "row", sm: "column", xs: "column" }}
          >
            <Typography
              color="#000"
              fontSize={25}
              fontWeight={900}
              display="flex"
              justifyContent="flex-start"
              p={8}
            >
              Code oriented teaching,
              <br />
              Learn with your pace
            </Typography>
            <Box
              component="div"
              display="flex"
              flexWrap="wrap"
              justifyContent="center"
              gap="2vmin"
              mt="50px"
              ml="50px"
            >
              {/* stack 1 */}
              <Stack
                sx={{ dislpay: "flex", flexDirection: "column", gap: "1vmin" }}
              >
                <SourceIcon
                  sx={{
                    backgroundColor: "#000",
                    color: "#fff",
                    borderRadius: "15px",
                    padding: "1vmin",
                    fontSize: "5vmin",
                  }}
                />
                <Typography
                  color="#000"
                  fontSize={15}
                  fontWeight={400}
                  width={{ lg: "300px", md: "200px", sm: "180px" }}
                >
                  Access on <strong>Github Repositories</strong> for more
                  detailed explanation
                </Typography>
              </Stack>
              {/* stack 2 */}
              <Stack
                sx={{ dislpay: "flex", flexDirection: "column", gap: "1vmin" }}
              >
                <FormatAlignLeftIcon
                  sx={{
                    backgroundColor: "#000",
                    color: "#fff",
                    borderRadius: "15px",
                    padding: "1vmin",
                    fontSize: "5vmin",
                  }}
                />
                <Typography
                  color="#000"
                  fontSize={15}
                  fontWeight={400}
                  width={{ lg: "300px", md: "200px", sm: "180px" }}
                >
                  View full code <strong>Inside Repositories</strong> with line
                  by line explanation
                </Typography>
              </Stack>
              {/* stack 3 */}
              <Stack
                sx={{ dislpay: "flex", flexDirection: "column", gap: "1vmin" }}
              >
                <RemoveRedEyeIcon
                  sx={{
                    backgroundColor: "#000",
                    color: "#fff",
                    borderRadius: "15px",
                    padding: "1vmin",
                    fontSize: "5vmin",
                  }}
                />
                <Typography
                  color="#000"
                  fontSize={15}
                  fontWeight={400}
                  width={{ lg: "300px", md: "200px", sm: "180px" }}
                >
                  See live version <strong>Of Project</strong> and test its
                  design and functionality
                </Typography>
              </Stack>
            </Box>
          </Stack>
          {/* section 2 */}
          <Stack
            width="100%"
            display="flex"
            justifyContent={{
              lg: "space-between",
              md: "space-between",
              sm: "center",
              xs: "center",
            }}
            px={{ lg: "7vmin", md: "5vmin", sm: "2vmin", xs: "1.5vmin" }}
            direction={{ lg: "row", md: "row", sm: "column", xs: "column" }}
          >
            <Box
              component="div"
              sx={{
                height: "400px",
                width: { lg: "700px", md: "400px", sm: "300px", xs: "250px" },
              }}
            >
              <img style={{ width:"100%", borderRadius: '35px'}} src={astronaut2} alt="codeprops" />
            </Box>
            <Stack direction="column" gap="1vmin" mt="4rem">
              {/* check card 1 */}
              <Stack
                direction="column"
                alignItems={{
                  lg: "flex-start",
                  md: "flex-start",
                  sm: "center",
                  xs: "center",
                }}
                justifyContent="center"
              >
                <Typography
                  color="#000"
                  fontSize={20}
                  fontWeight={600}
                  display="flex"
                  justifyContent="flex-start"
                  alignItems="center"
                  gap="1rem"
                >
                  <CheckIcon
                    sx={{
                      background: "#000",
                      color: "#fff",
                      borderRadius: "50%",
                    }}
                  />
                  Responsive Layout
                </Typography>
                <Typography
                  color="#7c7c7c"
                  fontSize={20}
                  fontWeight={300}
                  display="flex"
                  justifyContent="flex-start"
                  ml="40px"
                >
                  Adjustable on any device
                </Typography>
              </Stack>
              {/* check card 2 */}
              <Stack
                direction="column"
                alignItems={{
                  lg: "flex-start",
                  md: "flex-start",
                  sm: "center",
                  xs: "center",
                }}
                justifyContent="center"
              >
                <Typography
                  color="#000"
                  fontSize={20}
                  fontWeight={600}
                  display="flex"
                  justifyContent="flex-start"
                  alignItems="center"
                  gap="1rem"
                >
                  <CheckIcon
                    sx={{
                      background: "#000",
                      color: "#fff",
                      borderRadius: "50%",
                    }}
                  />
                  Creative Projects
                </Typography>
                <Typography
                  color="#7c7c7c"
                  fontSize={20}
                  fontWeight={300}
                  display="flex"
                  justifyContent="flex-start"
                  ml="40px"
                >
                  With easy understanding code
                </Typography>
              </Stack>
              {/* check card 3 */}
              <Stack
                direction="column"
                alignItems={{
                  lg: "flex-start",
                  md: "flex-start",
                  sm: "center",
                  xs: "center",
                }}
                justifyContent="center"
              >
                <Typography
                  color="#000"
                  fontSize={20}
                  fontWeight={600}
                  display="flex"
                  justifyContent="flex-start"
                  alignItems="center"
                  gap="1rem"
                >
                  <CheckIcon
                    sx={{
                      background: "#000",
                      color: "#fff",
                      borderRadius: "50%",
                    }}
                  />
                  Access on Github
                </Typography>
                <Typography
                  color="#7c7c7c"
                  fontSize={20}
                  fontWeight={300}
                  display="flex"
                  justifyContent="flex-start"
                  ml="40px"
                >
                  See In-depth explanation on Github
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Box>
        <Box
          component="div"
          flex={1}
          borderRadius="20px"
          padding="20px"
          display="flex"
          flexDirection="column"
          minWidth="95%"
          justifyContent="center"
          alignItems="center"
          mt="25px"
          ml="25px"
        >
          <Stack
            direction={{ lg: "row", md: "row", sm: "column", xs: "column" }}
            justifyContent="space-between"
            px="2vmin"
            margin="10px"
            width="100%"
            alignItems="center"
          >
            <Typography fontSize="18px" fontWeight={600} color="#11142d">
              Latest Posts
            </Typography>
            {user ? (
              <CustomButton
                type="submit"
                title={"Explore More"}
                backgroundColor="#0D1318"
                handleClick={() => navigate("/posts")}
                color="#fcfcfc"
                width="180px"
                height="50px"
                icon={<ArrowOutwardIcon />}
              />
            ) : (
              <Typography
                fontSize="18px"
                bgcolor="#11142d"
                padding="1vmin"
                borderRadius="25px"
                fontWeight={600}
                color="#f2f2f2"
              >
                Sign in to get access on every project
              </Typography>
            )}
          </Stack>

          <Box
            component="div"
            mt={2.5}
            width={{ lg: "95%", md: "95%", sm: "90%", xs: "85%" }}
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#0D1318",
              margin: "2vmin",
              position: "relative",
              right: "10px",
              borderRadius: "25px",
            }}
          >
            {latestPosts.map((post) => (
              <PostCard
                key={post._id}
                id={post._id}
                description={post.description}
                postType={post.postType}
                tech={post.tech}
                title={post.title}
                photo={post.photo}
                photo2={post.photo2}
                photo3={post.photo3}
                photo4={post.photo4}
                header={post.header}
                header2={post.header2}
                header3={post.header3}
                imgurl={post.imgurl}
              />
            ))}
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
};

export default Home;
