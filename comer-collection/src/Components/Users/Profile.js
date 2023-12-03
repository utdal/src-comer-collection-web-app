import React, { useCallback, useEffect, useState } from "react";
import {
  Typography,
  Button,
  Stack, TableCell,
  IconButton,
  Paper,
  Box
} from "@mui/material";
import { Navigate, useNavigate } from "react-router";
import { DataTable } from "./Tools/DataTable";
import SecurityIcon from "@mui/icons-material/Security";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SchoolIcon from '@mui/icons-material/School';
import { useTheme } from "@emotion/react";
import { sendAuthenticatedRequest } from "./Tools/HelperMethods/APICalls";
import { useAppUser } from "../App/AppUser";
import { useSnackbar } from "../App/AppSnackbar";

const Profile = (props) => {

  const { setSelectedNavItem } = props;

  const [appUser, setAppUser] = useAppUser();
  const showSnackbar = useSnackbar();

  const navigate = useNavigate();
  const theme = useTheme();

  const [myCourses, setMyCourses] = useState([]);
  const fetchMyCourses = async() => {
    try {
      const response = await sendAuthenticatedRequest("GET", `/api/account/courses`);
      setMyCourses(response.data);
    } catch(e) {
      console.log(`Error fetching courses: ${e.message}`);
    }
  }

  useEffect(() => {
    setSelectedNavItem("Profile");
    fetchMyCourses();
  }, [])


  
  const courseTableFields = [
    {
      columnDescription: "Course Name",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          <Typography variant="h6">Course Name</Typography>
        </TableCell>
      ),
      generateTableCell: (course) => (
        <TableCell sx={{wordWrap: "break-word", maxWidth: "200px"}}>
          <Typography variant="body1">{course.name}</Typography>
        </TableCell>
      )
    },
    {
      columnDescription: "Start",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          <Typography variant="h6">Start</Typography>
        </TableCell>
      ),
      generateTableCell: (course) => (
        <TableCell>
          <Typography variant="body1">{new Date (course.date_start).toLocaleString()}</Typography>
        </TableCell>
      )
    },
    {
      columnDescription: "End",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          <Typography variant="h6">End</Typography>
        </TableCell>
      ),
      generateTableCell: (course) => (
        <TableCell>
          <Typography variant="body1">{new Date (course.date_end).toLocaleString()}</Typography>
        </TableCell>
      )
    },
    {
      columnDescription: "Status",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          <Typography variant="h6">Status</Typography>
        </TableCell>
      ),
      generateTableCell: (course) => (
        <TableCell>
          {
            new Date(course.date_start).getTime() > new Date().getTime() && (
              <Typography variant="body1">Upcoming</Typography>
            ) || 
            new Date(course.date_end).getTime() < new Date().getTime() && (
              <Typography variant="body1">Expired</Typography>
            ) || 
            new Date(course.date_end).getTime() >= new Date().getTime() && new Date(course.date_start).getTime() <= new Date().getTime() && (
              <Typography variant="body1">Active</Typography>
            )
          }
        </TableCell>
      )
    },
    {
      columnDescription: "Notes",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          <Typography variant="h6">Notes</Typography>
        </TableCell>
      ),
      generateTableCell: (course) => (
        <TableCell sx={{wordWrap: "break-word", maxWidth: "300px"}}>
          <Typography variant="body1">{course.notes}</Typography>
        </TableCell>
      )
    }
  ]

  
  const userTableFields = [
    {
      columnDescription: "Name",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          <Typography variant="h6">Name</Typography>
        </TableCell>
      ),
      generateTableCell: (user) => (
        <TableCell>
          {
            user.has_name ? (
              <Typography variant="body1">{user.full_name}</Typography>
            ) : (
              <Typography variant="body1" sx={{opacity: 0.5}}>Not set</Typography>
            )
          }
        </TableCell>
      )
    },
    {
      columnDescription: "Email",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          <Typography variant="h6">Email</Typography>
        </TableCell>
      ),
      generateTableCell: (user) => (
        <TableCell>
          <Button color="grey"
            variant="text" sx={{textTransform: "unset"}}
            onClick={() => {handleCopyToClipboard(user, "email")}}>
            <Typography variant="body1">{user.email}</Typography>
          </Button>
        </TableCell>
      )
    },
    {
      columnDescription: "Password",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          <Typography variant="h6">Password Last Changed</Typography>
        </TableCell>
      ),
      generateTableCell: (user) => (
        <TableCell>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body1">{new Date(appUser.pw_updated).toLocaleString()}</Typography>
            <Button color={user.is_admin ? "secondary" : "primary"}
              variant="outlined"
              onClick={() => {
                navigate('/Account/ChangePassword');
              }}>
              <Typography variant="body1">Change</Typography>
            </Button>
          </Stack>
        </TableCell>
      )
    },
    // {
    //   columnDescription: "Exhibitions",
    //   generateTableHeaderCell: () => (
    //     <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
    //       <Typography variant="h6">Exhibitions</Typography>
    //     </TableCell>
    //   ),
    //   generateTableCell: (user) => (
    //     <TableCell>
    //       <Stack direction="row" spacing={1} alignItems="center">
    //         <Typography variant="body1">{user.Exhibitions.length}</Typography>
    //       </Stack>
    //     </TableCell>
    //   )
    // },
    {
      columnDescription: "User Type",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          <Typography variant="h6">User Type</Typography>
        </TableCell>
      ),
      generateTableCell: (user) => (
        <TableCell>
          <Stack direction="row" spacing={1}>
            <Typography variant="body1">{user.is_admin ? "Administrator" : "Curator"}</Typography>
            {user.is_admin ? (<SecurityIcon color="secondary" />) : (<PersonIcon color="primary" />)}
          </Stack>
        </TableCell>
      )
    },
    {
      columnDescription: "Options",
      generateTableHeaderCell: () => (
        <TableCell sx={{backgroundColor: theme.palette.grey.translucent}}>
          <Typography variant="h6">Options</Typography>
        </TableCell>
      ),
      generateTableCell: (user) => (
        <TableCell>
          <IconButton 
            disabled={user.id == appUser.id} 
            onClick={(e) => {
              setEditDialogUser(user);
              const { email, family_name, given_name } = user;
              setEditDialogFields({ email, family_name, given_name });
              setEditDialogSubmitEnabled(true);
              setEditDialogIsOpen(true)
            }}
          >
            <EditIcon />
          </IconButton>
        </TableCell>
      )
    }
  ]

  const handleCopyToClipboard = useCallback((user, fieldName) => {
    try {
      navigator.clipboard.writeText(user[fieldName]);
      showSnackbar("Copied to clipboard", "success");
    } catch (error) {
      showSnackbar("Error copying text to clipboard", "error");
    }
  }, [])

  return appUser.password_change_required && (
    <Navigate to="/Account/ChangePassword" />
  ) || !appUser.password_change_required && (
    <Box component={Paper} square sx={{height: "100%"}}>
    <Stack spacing={4} paddingTop={5} paddingLeft={5} paddingRight={5}>
      <Stack spacing={2}>
        <Stack direction="row" paddingLeft={1} spacing={2} alignItems="center">
          <AccountCircleIcon fontSize="large" />
          <Typography variant="h4">Profile Information</Typography>
        </Stack>
        <DataTable
          visibleItems={[appUser]}
          tableFields={userTableFields}
        />
      </Stack>
    </Stack>
    <Stack spacing={4} paddingTop={5} paddingLeft={5} paddingRight={5} height="400px">
      <Stack spacing={2}  sx={{
        display: "grid",
        gridTemplateRows: "50px 350px",
        gridTemplateColumns: "1fr",
        gridTemplateAreas: `
          "title"
          "content"
        `
      }}  overflow="hidden">
      <Stack direction="row" paddingLeft={1} spacing={2} alignItems="center"
        sx={{gridArea: "title"}}>
          <SchoolIcon fontSize="large" />
          <Typography variant="h4">My Courses</Typography>
        </Stack>
        <DataTable sx={{overflow: "scroll"}}
          nonEmptyHeight="350px"
          visibleItems={myCourses.sort((a, b) => (a.date_start < b.date_start ? 1 : -1))}
          tableFields={courseTableFields}
          NoContentIcon={SchoolIcon}
          emptyMinHeight="400px"
          noContentMessage="You are not enrolled in any courses."
        />
      </Stack>
    </Stack>
    </Box>
  );
}

export default Profile;
