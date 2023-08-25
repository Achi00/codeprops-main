import { Add } from "@mui/icons-material";
import { useTable } from "@pankod/refine-core";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Select,
  MenuItem,
} from "@pankod/refine-mui";
import { useNavigate } from "@pankod/refine-react-router-v6";
import { useGetIdentity } from "@pankod/refine-core";
import { useMemo } from "react";
import { PostCard, CustomButton } from "components";
import { Loading } from "components";
import { revealVariants } from "assets/motion";
import { motion } from "framer-motion";

const AllPosts = () => {
  const navigate = useNavigate();
  const {
    tableQueryResult: { data, isError, isLoading },
    current,
    setCurrent,
    setPageSize,
    pageCount,
    sorter,
    setSorter,
    filters,
    setFilters,
  } = useTable();

  const { data: user } = useGetIdentity();

  const allPosts = data?.data ?? [];

  const currentFilterValues = useMemo(() => {
    const logicalFilters = filters.flatMap((item) =>
      "field" in item ? item : []
    );
    return {
      title: logicalFilters.find((item) => item.field === "title")?.value || "",
      postType:
        logicalFilters.find((item) => item.field === "postType")?.value || "",
    };
  }, [filters]);

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <Typography fontSize={25} fontWeight={700} color="#11142d">
        Error
      </Typography>
    );

  return (
    <Box
      component={motion.div}
      variants={revealVariants}
      initial="hidden"
      whileInView="show"
      mb="5vmin"
    >
      <Box
        component="div"
        mt="20px"
        sx={{ displey: "flex", flexWrap: "wrap", gap: 3 }}
      >
        <Stack direction="column" width="100%">
          <Typography p={3} fontSize={25} fontWeight={700} color="#11142d">
            {!allPosts.length ? "There are no posts to show" : "All Posts"}
          </Typography>
          <Box
            component="div"
            mb={2}
            mt={3}
            display="flex"
            width="84%"
            justifyContent="space-between"
            flexWrap="wrap"
          >
            <Box
              component="div"
              display="flex"
              gap={2}
              flexWrap="wrap"
              mb={{ xs: "20px", sm: 0 }}
            >
              <TextField
                sx={{ paddingLeft: "40px" }}
                variant="outlined"
                color="info"
                placeholder="Search By Title"
                value={currentFilterValues.title}
                onChange={(e) => {
                  setFilters([
                    {
                      field: "title",
                      operator: "contains",
                      value: e.currentTarget.value
                        ? e.currentTarget.value
                        : undefined,
                    },
                  ]);
                }}
              />
              <Select
                variant="outlined"
                color="info"
                displayEmpty
                required
                inputProps={{ "arie-label": "Without label" }}
                defaultValue=""
                value={currentFilterValues.postType}
                onChange={(e) => {
                  setFilters([
                    {
                      field: "postType",
                      operator: "eq",
                      value: e.target.value,
                    },
                  ]);
                }}
              >
                <MenuItem value="">All</MenuItem>
                {["Template", "Tutorial", "Blog"].map((type) => (
                  <MenuItem key={type} value={type.toLowerCase()}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
        </Stack>
      </Box>
      <Stack padding="24px">
        {user?.email === process.env.REACT_APP_ADMIN_USER && (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <CustomButton
              type="submit"
              title={"Add Post"}
              backgroundColor="#0D1318"
              handleClick={() => navigate("/posts/create")}
              color="#fcfcfc"
              width="180px"
              height="50px"
              icon={<Add />}
            />
          </Stack>
        )}
        <Box
          component="div"
          mt="20px"
          padding="24px"
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            backgroundColor: "#0D1318",
            borderRadius: "25px",
            justifyContent: "center",
          }}
        >
          {allPosts.map((post) => (
            <PostCard
              key={post._id}
              id={post._id}
              title={post.title}
              tech={post.tech}
              header={post.header}
              header2={post.header2}
              header3={post.header3}
              imgurl={post.imgurl}
              description={post.description}
              photo={post.photo}
              photo2={post.photo2}
              photo3={post.photo3}
              photo4={post.photo4}
              postType={post.postType}
            />
          ))}
        </Box>
      </Stack>
      {allPosts.length > 0 && (
        <Box
          component="div"
          display="flex"
          ml="30px"
          gap={2}
          mt={3}
          flexWrap="wrap"
        >
          <CustomButton
            handleClick={() => setCurrent((prev) => prev - 1)}
            title="Previous"
            backgroundColor="#fcfcfc"
            color="#fcfcfc"
            height="50px"
            width="200px"
            disabled={!(current > 1)}
          />
          <Box
            component="div"
            mt="20px"
            display={{ xs: "none", sm: "flex" }}
            alignItems="center"
            gap="5px"
          >
            Page{` `} <strong>of {pageCount}</strong>
          </Box>
          <CustomButton
            handleClick={() => setCurrent((prev) => prev + 1)}
            title="Next"
            backgroundColor="#fcfcfc"
            color="#fff"
            height="50px"
            width="200px"
            disabled={current === pageCount}
          />
          <Select
            variant="outlined"
            color="primary"
            displayEmpty
            required
            inputProps={{ "arie-label": "Without label" }}
            defaultValue={10}
            onChange={(e) =>
              setPageSize(e.target.value ? Number(e.target.value) : 10)
            }
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <MenuItem key={size} value={size}>
                Show {size}
              </MenuItem>
            ))}
          </Select>
        </Box>
      )}
    </Box>
  );
};

export default AllPosts;
