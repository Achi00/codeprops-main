import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Stack } from '@mui/system';
import { useNavigate } from "@pankod/refine-react-router-v6";
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import { useGetIdentity, useTable } from '@pankod/refine-core';
import { CustomButton, Loading } from 'components';
import { Add } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#0D1318',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 18,
    fontWeight: 'bold',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(
  name: string,
  calories: number,
  fat: string,
  carbs: string,
  protein: number,
) {
  return { name, calories, fat, carbs, protein };
}


const Problems = () => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity();
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

  const allProblems = data?.data ?? [];


  if (isLoading) return <Loading />;
  if (isError)
    return (
      <Typography fontSize={25} fontWeight={700} color="#11142d">
        Error
      </Typography>
    );
  return (
    <Box component="div">
      <Box component="div" sx={{mr: '40px'}}>
      {user?.email === process.env.REACT_APP_ADMIN_USER && (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <CustomButton
              type="submit"
              title={"Add Problem"}
              backgroundColor="#0D1318"
              handleClick={() => navigate("/problems/create")}
              color="#fcfcfc"
              width="180px"
              height="50px"
              icon={<Add />}
            />
          </Stack>
        )}
      </Box>
      <Stack sx={{padding: '2rem'}}>
          <Typography p={3} fontSize={25} fontWeight={700} color="#11142d">
            {!allProblems.length ? "There are no posts to show" : "All Posts"}
          </Typography>

                    <TableContainer component={Paper} sx={{ borderRadius: '15px' }}>
                    <Table sx={{ minWidth: 700, borderRadius: '15px' }} aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Tasks</StyledTableCell>
                          <StyledTableCell align="right">Avg. Time (Min)</StyledTableCell>
                          <StyledTableCell align="right">Difficulty</StyledTableCell>
                          <StyledTableCell align="right">Language</StyledTableCell>
                          <StyledTableCell align="right">Solution</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                      {allProblems.map((problem) => (
                        // <Link to={`/problems/show/${problem?._id}`}>
                          <StyledTableRow 
                          onClick={() => navigate(`/problems/show/${problem?._id}`)}
                          key={problem?._id} 
                          sx={{cursor: 'pointer', color: '#0D1318', '&:hover': {
                            background: "#ced4da",
                         },}}>
                            <StyledTableCell sx={{color: '#0D1318'}} component="th" scope="row">
                              {problem?.name}
                            </StyledTableCell>
                            <StyledTableCell sx={{color: '#0D1318'}} align="right">{problem?.timeToSolve}</StyledTableCell>
                            <StyledTableCell sx={{color: '#0D1318'}} align="right">{problem?.difficulty}</StyledTableCell>
                            <StyledTableCell sx={{color: '#0D1318'}} align="right">{problem?.language}</StyledTableCell>
                            <StyledTableCell align="right"><LibraryAddCheckIcon sx={{color: '#0D1318'}}/></StyledTableCell>
                          </StyledTableRow>
                        // </Link>
                      ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
    </Stack>

    </Box>
  );
}

export default Problems