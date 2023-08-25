import {
    Box,
    Typography,
    FormControl,
    FormHelperText,
    TextField,
    TextareaAutosize,
    Stack,
    Select,
    MenuItem,
    Button,
  } from "@pankod/refine-mui";
  
  import { ProblemProps } from "interfaces/common";
  import CustomButton from "./CustomButton";
  
  const ProblemsForm = ({
    type,
    register,
    handleSubmit,
    formLoading,
    onFinishHandler,
  }: ProblemProps) => {
    return (
      <Box component="div">
        <Stack sx={{ padding: "24px" }}>
          <Typography fontSize={25} fontWeight={700} color="#11142d">
            {type} a Post
          </Typography>
          <Box
            component="div"
            mt={2.5}
            borderRadius="15px"
            padding="20px"
            bgcolor="#fcfcfc"
          >
            <form
              style={{
                marginTop: "20px",
                padding: "24px",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
              onSubmit={handleSubmit(onFinishHandler)}
            >
              <FormControl>
                <FormHelperText
                  sx={{
                    fontWeight: 500,
                    margin: "10px 0",
                    fontSize: 16,
                    color: "#11142d",
                  }}
                >
                  Enter Problem Name
                </FormHelperText>
                <TextField
                  fullWidth
                  required
                  id="outlined-basic"
                  color="info"
                  variant="outlined"
                  {...register("name", { required: true })}
                />
              </FormControl>
              {/* desc */}
              <FormControl>
                <FormHelperText
                  sx={{
                    fontWeight: 500,
                    margin: "10px 0",
                    fontSize: 16,
                    color: "#11142d",
                  }}
                >
                  Enter Description
                </FormHelperText>
                <TextareaAutosize
                  minRows={5}
                  required
                  placeholder="Enter Description"
                  color="info"
                  style={{
                    width: "100%",
                    background: "transparent",
                    fontSize: "16px",
                    borderColor: "rgba(0, 0, 0, 0.23)",
                    borderRadius: 6,
                    padding: 10,
                    color: "#919191",
                  }}
                  {...register("description", { required: true })}
                />
              </FormControl>
              {/* time to solve */}
              <FormControl>
                <FormHelperText
                  sx={{
                    fontWeight: 500,
                    margin: "10px 0",
                    fontSize: 16,
                    color: "#11142d",
                  }}
                >
                  Enter Time Needed
                </FormHelperText>
                <TextareaAutosize
                  minRows={5}
                  required
                  placeholder="Enter timeToSolve"
                  color="info"
                  style={{
                    width: "100%",
                    background: "transparent",
                    fontSize: "16px",
                    borderColor: "rgba(0, 0, 0, 0.23)",
                    borderRadius: 6,
                    padding: 10,
                    color: "#919191",
                  }}
                  {...register("timeToSolve", { required: true })}
                />
              </FormControl>
              {/* difficulty */}
              <FormControl>
                <FormHelperText
                  sx={{
                    fontWeight: 500,
                    margin: "10px 0",
                    fontSize: 16,
                    color: "#11142d",
                  }}
                >
                  Enter Difficulty
                </FormHelperText>
                <TextareaAutosize
                  minRows={5}
                  required
                  placeholder="Enter difficulty"
                  color="info"
                  style={{
                    width: "100%",
                    background: "transparent",
                    fontSize: "16px",
                    borderColor: "rgba(0, 0, 0, 0.23)",
                    borderRadius: 6,
                    padding: 10,
                    color: "#919191",
                  }}
                  {...register("difficulty", { required: true })}
                />
              </FormControl>
              {/* language or syntax */}
              <FormControl>
              <FormHelperText
                  sx={{
                    fontWeight: 500,
                    margin: "10px 0",
                    fontSize: 16,
                    color: "#11142d",
                  }}
                >
                  Enter Syntax or Language
                </FormHelperText>
              <Select
                  variant="outlined"
                  color="info"
                  displayEmpty
                  required
                  inputProps={{ "aria-label": "Without label" }}
                  defaultValue="template"
                  {...register("language", { required: true })}
                >
                  <MenuItem value="javascript">JS</MenuItem>
                  <MenuItem value="react">React JS</MenuItem>
                  <MenuItem value="typescript">Typescript</MenuItem>
                  <MenuItem value="css">css</MenuItem>
                </Select>
              </FormControl>
              {/* solution */}
              <FormControl>
                <FormHelperText
                  sx={{
                    fontWeight: 500,
                    margin: "10px 0",
                    fontSize: 16,
                    color: "#11142d",
                  }}
                >
                  Enter solution
                </FormHelperText>
                <TextareaAutosize
                  minRows={5}
                  required
                  placeholder="Enter solution"
                  color="info"
                  style={{
                    width: "100%",
                    background: "transparent",
                    fontSize: "16px",
                    borderColor: "rgba(0, 0, 0, 0.23)",
                    borderRadius: 6,
                    padding: 10,
                    color: "#919191",
                  }}
                  {...register("solution", { required: true })}
                />
              </FormControl>
              {/* console output */}
              <FormControl>
                <FormHelperText
                  sx={{
                    fontWeight: 500,
                    margin: "10px 0",
                    fontSize: 16,
                    color: "#11142d",
                  }}
                >
                  Enter console output
                </FormHelperText>
                <TextareaAutosize
                  minRows={5}
                  required
                  placeholder="Enter console output"
                  color="info"
                  style={{
                    width: "100%",
                    background: "transparent",
                    fontSize: "16px",
                    borderColor: "rgba(0, 0, 0, 0.23)",
                    borderRadius: 6,
                    padding: 10,
                    color: "#919191",
                  }}
                  {...register("consoleOutput", { required: true })}
                />
              </FormControl>
            
              <CustomButton
                type="submit"
                title={formLoading ? "Submiting..." : "Submit"}
                backgroundColor="#475be8"
                color="#fcfcfc"
                height="70px"
                width="200px"
              />
            </form>
          </Box>
        </Stack>
      </Box>
    );
  };
  
  export default ProblemsForm;
  