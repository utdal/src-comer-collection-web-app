import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Paper,
  Stack,
  TableContainer, Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Switch, useTheme, Box, IconButton, DialogContentText, TextField, Divider
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Unauthorized from "../../ErrorPages/Unauthorized";
import SearchBox from "../Tools/SearchBox";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { ColumnSortButton } from "../Tools/ColumnSortButton";
import { ColumnFilterButton } from "../Tools/ColumnFilterButton";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import LockResetIcon from "@mui/icons-material/LockReset";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete"


const UserManagement = (props) => {
  const [users, setUsers] = useState([]);
  const [refreshInProgress, setRefreshInProgress] = useState(true);

  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);
  const [editDialogUser, setEditDialogUser] = useState(null);
  const [editDialogFieldEmail, setEditDialogFieldEmail] = useState('');
  const [editDialogFieldFamilyName, setEditDialogFieldFamilyName] = useState('');
  const [editDialogFieldGivenName, setEditDialogFieldGivenName] = useState('');
  const [editDialogSubmitEnabled, setEditDialogSubmitEnabled] = useState(false);

  const [addDialogIsOpen, setAddDialogIsOpen] = useState(false);
  const [addDialogUsers, setAddDialogUsers] = useState([]);
  const [addDialogSubmitEnabled, setAddDialogSubmitEnabled] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [userTypeFilter, setUserTypeFilter] = useState(null);
  const [userTypeMenuAnchorElement, setUserTypeMenuAnchorElement] = useState(null);
  const clearFilters = () => {
    setSearchQuery("");
    setUserTypeFilter(null);
    setUserActivationStatusFilter(null);
    setUserPasswordTypeFilter(null);
  }

  const [userActivationStatusFilter, setUserActivationStatusFilter] = useState(null);
  const [userActivationStatusMenuAnchorElement, setUserActivationStatusMenuAnchorElement] = useState(null);

  const [userPasswordTypeFilter, setUserPasswordTypeFilter] = useState(null);
  const [userPasswordTypeMenuAnchorElement, setUserPasswordTypeMenuAnchorElement] = useState(null);

  const [sortColumn, setSortColumn] = useState("ID");
  const [sortAscending, setSortAscending] = useState(true);


  const { appUser, setAppUser, selectedNavItem, setSelectedNavItem, 
    snackbarOpen, snackbarText, snackbarSeverity,
    setSnackbarOpen, setSnackbarText, setSnackbarSeverity } = props;
  const theme = useTheme();
  

  useEffect(() => {
    setSelectedNavItem("User Management");
    if(appUser.is_admin) {
      fetchData();
    }
  }, []); 

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:9000/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const userData = response.data;

      setUsers(userData.data);
      setTimeout(() => {
        setRefreshInProgress(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  /*
    User display:
    Step 1: apply column filters
    Step 2: apply search query
    Step 3: apply sorting order
  */

  const filterUsers = (userTypeFilter, userActivationStatusFilter, userPasswordTypeFilter) => {
    return users.filter((user) => {
      return (
        // filter by user type
        !userTypeFilter || userTypeFilter == "Administrator" && user.is_admin || userTypeFilter == "Curator" && !user.is_admin
      ) && (
        // filter by user activation status
        !userActivationStatusFilter || userActivationStatusFilter == "Active" && user.is_active || userActivationStatusFilter == "Inactive" && !user.is_active
      ) && (
        // filter by password type
        !userPasswordTypeFilter || userPasswordTypeFilter == "Temporary" && user.pw_temp || userPasswordTypeFilter == "Permanent" && !user.pw_temp
      )
    })
  }


  const filteredUsers = useMemo(() => filterUsers(
    userTypeFilter, userActivationStatusFilter, userPasswordTypeFilter
  ), [
    users, userTypeFilter, userActivationStatusFilter, userPasswordTypeFilter
  ])


  const searchUsers = (searchQuery) => {
    return filteredUsers.filter((user) => {
      return searchQuery == "" ||
        Boolean((user.family_name ?? "").toLowerCase().includes(searchQuery.toLowerCase())) ||
        Boolean((user.given_name ?? "").toLowerCase().includes(searchQuery.toLowerCase())) ||
        Boolean(`${(user.given_name ?? "").toLowerCase()} ${(user.family_name ?? "").toLowerCase()}`.includes(searchQuery.toLowerCase())) ||
        Boolean(`${(user.family_name ?? "").toLowerCase()}, ${(user.given_name ?? "").toLowerCase()}`.includes(searchQuery.toLowerCase())) ||
        Boolean(user.email?.replace("@utdallas.edu", "").toLowerCase().includes(searchQuery.toLowerCase()))
    })
  }

  const filteredAndSearchedUsers = useMemo(() => searchUsers(searchQuery), [filteredUsers, searchQuery])

  const usersToDisplay = filteredAndSearchedUsers.sort((a, b) => {
    if(sortColumn == "Name")
      return b.family_name && b.given_name && (!sortAscending ^ (a.family_name > b.family_name || (a.family_name == b.family_name && a.given_name > b.given_name)));
    else if(sortColumn == "ID")
      return !sortAscending ^ (a.id > b.id);
    else if(sortColumn == "Email")
      return !sortAscending ^ (a.email > b.email)
  })
  

  const handleDeleteClick = (userId) => {
    setUserToDelete({ userId });
    setDeleteConfirmation(true);
  };


  const handleUsersCreate = async(newUserArray) => {
    let usersCreated = 0;
    let userIndicesWithErrors = []
    for(const [i, newUserData] of newUserArray.entries()) {
      try {
        let { email, given_name, family_name } = newUserData;
        await axios.post(
          `http://localhost:9000/api/users`, { email, given_name, family_name },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        usersCreated++;
  
      } catch (error) {
        console.error(`Error creating user ${JSON.stringify(newUserData)}: ${error}`);
        userIndicesWithErrors.push(i);
      }
    }
    fetchData();

    if(usersCreated == newUserArray.length) {
      setAddDialogIsOpen(false);
      setAddDialogUsers([]);

      setSnackbarText(`Successfully created ${newUserArray.length} ${newUserArray.length == 1 ? "user" : "users"}`)
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

    } else if(usersCreated < newUserArray.length) {

      if(usersCreated > 0) {
        setSnackbarText(`Created ${usersCreated} of ${newUserArray.length} ${newUserArray.length == 1 ? "user" : "users"}`)
        setSnackbarSeverity("warning");
      }
      else {
        setSnackbarText(`Failed to create ${newUserArray.length} ${newUserArray.length == 1 ? "user" : "users"}`)
        setSnackbarSeverity("error");
      }
      setSnackbarOpen(true);

      setAddDialogUsers(newUserArray.filter((u, i) => {
        return userIndicesWithErrors.includes(i);
      }))
    }


  }


  const handleUserEdit = async(userId, updateFields) => {
    const { email, given_name, family_name } = updateFields;
    try {
      await axios.put(
        `http://localhost:9000/api/users/${userId}`, { email, given_name, family_name },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchData();

      setEditDialogIsOpen(false);
      setEditDialogFieldEmail('')
      setEditDialogFieldFamilyName('')
      setEditDialogFieldGivenName('')

      setSnackbarText(`Successfully edited user ${userId}`)
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

    } catch (error) {
      console.error(`Error editing user ${userId}: ${error}`);

      setSnackbarText(`Error editing for user ${userId}`)
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }

  const handleChangeUserActivationStatus = async(userId, willBeActive) => {
    try {
      await axios.put(
        (willBeActive ? 
          `http://localhost:9000/api/users/${userId}/activate` : 
          `http://localhost:9000/api/users/${userId}/deactivate`
          ), null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchData();

      setSnackbarText(`User ${userId} is now ${willBeActive ? "activated" : "deactivated"}`)
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

    } catch (error) {
      console.error(`Error deactivating user ${userId}: ${error}`);

      setSnackbarText(`Error deactivating user ${userId}`)
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }

  const handleResetPassword = async(userId) => {
    try {
      await axios.put(
        `http://localhost:9000/api/users/${userId}/resetpassword`, null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchData();

      setSnackbarText(`Password reset for user ${userId}`)
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

    } catch (error) {
      console.error(`Error resetting password for user ${userId}: ${error}`);

      setSnackbarText(`Error resetting password for user ${userId}`)
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }


  const handleDelete = async () => {
    try {
      const { userId } = userToDelete;

      const response = await axios.delete(
        `http://localhost:9000/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.status === 200 || response.status === 204) {
        fetchData();
      } else {
        console.error("Error deleting user:", response.statusText);
      }
    } catch (error) {
      console.error("Error handling delete operation:", error);
    } finally {
      setDeleteConfirmation(false);
      setUserToDelete(null);
    }
  };


  const handleCopyToClipboard = useCallback((user) => {
    try {
      navigator.clipboard.writeText(user.pw_temp);
      setSnackbarSeverity("success")
      setSnackbarText(`Password for user ${user.id} copied to clipboard`);
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarSeverity("error")
      setSnackbarText(`Error copying password`);
      setSnackbarOpen(true);
    }
  }, [])


  return !appUser.is_admin && (
    <Unauthorized message="Insufficient Privileges" buttonText="Return to Profile" buttonDestination="/Account/Profile" />
  ) ||
  appUser.is_admin && (
    <>
        <Stack direction="row" justifyContent="space-between" spacing={2} padding={2}>
          <SearchBox {...{searchQuery, setSearchQuery}} placeholder="Search by name or email" width="50%" />
          <Stack direction="row" spacing={2}>
            <Button color="primary" variant="outlined" startIcon={<RefreshIcon/>} onClick={() => {
              setRefreshInProgress(true);
              fetchData();
            }}
              disabled={refreshInProgress}>
              <Typography variant="body1">Refresh</Typography>
            </Button>
            <Button color="primary" variant="outlined" startIcon={<FilterAltOffOutlinedIcon/>} onClick={clearFilters}
              disabled={
                !Boolean(searchQuery || userTypeFilter || userActivationStatusFilter || userPasswordTypeFilter)
              }>
              <Typography variant="body1">Clear Filters</Typography>
            </Button>
            <Button color="primary" variant="contained" startIcon={<GroupAddIcon/>}
              onClick={() => {
                setAddDialogIsOpen(true);
              }}
            >
              <Typography variant="body1">Create Users</Typography>
            </Button>
          </Stack>
        </Stack>
        <TableContainer component={Paper} sx={{ width: "100%", maxHeight: 'calc(100% - 100px)' }}>
          <Table stickyHeader size="small" aria-label="user table" sx={{ width: "100%" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{backgroundColor: "#CCC"}}>
                    <ColumnSortButton columnName="ID" {...{sortAscending, setSortAscending, sortColumn, setSortColumn}} />
                </TableCell>
                <TableCell sx={{backgroundColor: "#CCC"}}>
                    <ColumnSortButton columnName="Name" {...{sortAscending, setSortAscending, sortColumn, setSortColumn}} />
                </TableCell>
                <TableCell sx={{backgroundColor: "#CCC"}}>
                    <ColumnSortButton columnName="Email" {...{sortAscending, setSortAscending, sortColumn, setSortColumn}} />
                </TableCell>
                <TableCell sx={{backgroundColor: userPasswordTypeFilter ? theme.palette.primary["200"] : "#CCC"}}>
                    <ColumnFilterButton columnName="Password"
                      options={[
                        {
                          value: "Temporary",
                          displayText: "Temporary password"
                        },
                        {
                          value: "Permanent",
                          displayText: "Password set by user"
                        }
                      ]}
                      optionAll="All Users"
                      filter={userPasswordTypeFilter} 
                      setFilter={setUserPasswordTypeFilter} 
                      menuAnchorElement={userPasswordTypeMenuAnchorElement}
                      setMenuAnchorElement={setUserPasswordTypeMenuAnchorElement}
                    />
                </TableCell>
                <TableCell sx={{backgroundColor: "#CCC"}}>
                  <Typography variant="h6">Courses</Typography>
                </TableCell>
                <TableCell sx={{backgroundColor: "#CCC"}}>
                  <Typography variant="h6">Exhibitions</Typography>
                </TableCell>
                <TableCell sx={{backgroundColor: userTypeFilter ? theme.palette.primary["200"] : "#CCC"}}>
                    <ColumnFilterButton columnName="User Type"
                      options={[
                        {
                          value: "Administrator",
                          displayText: "Administrators"
                        },
                        {
                          value: "Curator",
                          displayText: "Curators"
                        }
                      ]}
                      optionAll="All Users"
                      filter={userTypeFilter} 
                      setFilter={setUserTypeFilter} 
                      menuAnchorElement={userTypeMenuAnchorElement}
                      setMenuAnchorElement={setUserTypeMenuAnchorElement}
                    />
                </TableCell>
                <TableCell sx={{backgroundColor: userActivationStatusFilter ? theme.palette.primary["200"] : "#CCC"}}>
                    <ColumnFilterButton columnName="Active" 
                      options={[
                        {
                          value: "Active",
                          displayText: "Active"
                        },
                        {
                          value: "Inactive",
                          displayText: "Inactive"
                        }
                      ]}
                      optionAll="All Users"
                      filter={userActivationStatusFilter} 
                      setFilter={setUserActivationStatusFilter} 
                      menuAnchorElement={userActivationStatusMenuAnchorElement}
                      setMenuAnchorElement={setUserActivationStatusMenuAnchorElement}
                    />
                </TableCell>
                <TableCell sx={{backgroundColor: "#CCC"}}>
                  <Typography variant="h6">Options</Typography>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {usersToDisplay.map((user) => (
                  <TableRow key={user.id} sx={{
                    [`&:hover`]: {
                      backgroundColor: "#EEE"
                    }
                  }}>
                    <TableCell>
                      <Typography variant="body1">{user.id}</Typography>
                    </TableCell>
                    <TableCell>
                      {
                        user.family_name || user.given_name ? (
                          <Typography variant="body1">{user.family_name ?? ""}, {user.given_name ?? ""}</Typography>
                        ) : (
                          <Typography variant="body1" sx={{opacity: 0.5}}>Not set</Typography>
                        )
                      }
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{user.email}</Typography>
                    </TableCell>
                    <TableCell>
                      {user.pw_temp ? (
                        <Button startIcon={<ContentCopyIcon />}
                          variant="outlined"
                          onClick={() => {handleCopyToClipboard(user)}}>
                          <Typography variant="body1">Copy</Typography>
                        </Button>
                      ) : (
                        <Button 
                          startIcon={<LockResetIcon />}
                          itemID={user.id}
                          variant="outlined" 
                          disabled={appUser.id == user.id}
                          onClick={(e) => {
                            handleResetPassword(e.target.parentElement.attributes.itemid.value);
                          }}>
                          <Typography variant="body1">Reset</Typography>
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{user.Courses.length}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{user.Exhibitions.length}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{user.is_admin ? "Administrator" : "Curator"}</Typography>
                    </TableCell>


                    <TableCell>
                      <Switch 
                        itemID={user.id}
                        checked={user.is_active} 
                        disabled={user.is_admin} 
                        onClick={(e) => {
                          handleChangeUserActivationStatus(e.target.parentElement.attributes.itemid.value, e.target.checked)
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        disabled={user.is_admin} 
                        onClick={(e) => {
                          setEditDialogUser(user);
                          setEditDialogFieldEmail(user.email);
                          setEditDialogFieldFamilyName(user.family_name);
                          setEditDialogFieldGivenName(user.given_name);
                          setEditDialogSubmitEnabled(true);
                          setEditDialogIsOpen(true)
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
          {
            usersToDisplay.length == 0 && (
              <Box sx={{width: '100%'}}>
                <Stack direction="column" alignItems="center" justifyContent="center" spacing={2} sx={{height: '100%'}}>
                  <PersonSearchIcon sx={{fontSize: '150pt', opacity: 0.5}} />
                  <Typography variant="h4">No users found</Typography>
                  <Button variant="contained" startIcon={<FilterAltOffOutlinedIcon/>} onClick={clearFilters}>
                    <Typography variant="body1">Clear Filters</Typography>
                  </Button>
                </Stack>
              </Box>
            )
          }

      <Dialog component="form" fullWidth={true} maxWidth="lg"
        open={addDialogIsOpen}
        onClose={(event, reason) => {
          if(reason == "backdropClick")
            return;
          setAddDialogIsOpen(false);
        }}
        onSubmit={(e) => {
          e.preventDefault();
          handleUsersCreate([...addDialogUsers]);
        }}
      >
        <DialogTitle sx={{textAlign: "center"}} variant="h4">Create Users
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
          <DialogContentText variant="body1">
            Add users, edit the user fields, then click 'Create'.  The system will generate temporary passwords for each user.
          </DialogContentText>
            {addDialogUsers.map((u, index) => (
            <Stack key={index} direction="row" spacing={2} alignItems="center">
              <DialogContentText variant="body1">{index + 1}</DialogContentText>
              <TextField label="First Name" autoFocus value={u.given_name} sx={{width: "100%"}}
                onChange={(e) => {
                  setAddDialogUsers(addDialogUsers.map((r, i) => {
                    if(index == i)
                      return {...r, given_name: e.target.value};
                    else
                      return r;
                  }))
                }} 
              />
              <TextField label="Last Name" value={u.family_name} sx={{width: "100%"}}
                onChange={(e) => {
                  setAddDialogUsers(addDialogUsers.map((r, i) => {
                    if(index == i)
                      return {...r, family_name: e.target.value};
                    else
                      return r;
                  }))
                }} 
              />
              <TextField label="Email" inputProps={{required: true}} value={u.email} sx={{width: "100%"}}
                onChange={(e) => {
                  setAddDialogUsers(addDialogUsers.map((r, i) => {
                    if(index == i)
                      return {...r, email: e.target.value};
                    else
                      return r;
                  }))
                }} 
              />
              <IconButton onClick={() => {
                setAddDialogUsers(addDialogUsers.filter((r, i) => {
                  return index != i;
                }))
              }}>
                <DeleteIcon />
              </IconButton>
            </Stack>
          ))}
          <Divider />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Stack direction="row" justifyContent="space-between" spacing={1} sx={{width: "100%"}}>
            <Button color="primary" variant="outlined" size="large" onClick={() => {
              setAddDialogIsOpen(false);
              setAddDialogSubmitEnabled(false);
              setAddDialogUsers([]);
            }}>
              <Typography variant="body1">Cancel</Typography>
            </Button>
          <Stack direction="row" spacing={1} sx={{width: "50%"}}>
            <Button color="primary" 
              variant={addDialogUsers.length ? "outlined" : "contained"}
              size="large" sx={{width: "100%"}} onClick={(e) => {
              setAddDialogUsers([...addDialogUsers, {
                family_name: "",
                given_name: "",
                email: ""
              }])
              e.target.focus();
            }}>
              <Typography variant="body1">{addDialogUsers.length ? "Add another user" : "Add User"}</Typography>
            </Button>
          <Button type="submit" color="primary" variant="contained" size="large"  sx={{width: "100%"}}
            disabled={addDialogUsers.length == 0}>
            <Typography variant="body1">Create</Typography>
          </Button>
          </Stack>
          </Stack>
          </DialogActions>
      </Dialog>


      <Dialog component="form"
        open={editDialogIsOpen}
        onClose={(event, reason) => {
          if(reason == "backdropClick")
            return;
          setEditDialogIsOpen(false);
        }}
        onSubmit={(e) => {
          e.preventDefault();
          handleUserEdit(editDialogUser.id, {
            email: editDialogFieldEmail,
            family_name: editDialogFieldFamilyName,
            given_name: editDialogFieldGivenName
          });
        }}
      >
        <DialogTitle variant="h4" sx={{textAlign: "center"}}>Edit User</DialogTitle>
        <DialogContent
        sx={{
          width: "500px",
        }}>
          <Stack spacing={2}>
          <DialogContentText variant="body1">Edit the user fields, then click 'Save'.</DialogContentText>
          <TextField label="First Name" value={editDialogFieldGivenName}
            onChange={(e) => {
              setEditDialogFieldGivenName(e.target.value)
            }}>
          </TextField>
          <TextField label="Last Name" value={editDialogFieldFamilyName}
            onChange={(e) => {
              setEditDialogFieldFamilyName(e.target.value)
            }}>
          </TextField>
          <TextField label="Email" value={editDialogFieldEmail}
            onChange={(e) => {
              setEditDialogFieldEmail(e.target.value)
            }}>
          </TextField>
          <Stack direction="row" justifyContent="space-between" spacing={2}>
            <Button color="primary" variant="outlined" sx={{width: "50%"}} onClick={() => {
              setEditDialogIsOpen(false);
              setEditDialogSubmitEnabled(false);
            }}>
              <Typography variant="body1">Cancel</Typography>
            </Button>
            <Button color="primary" variant="contained" size="large"  sx={{width: "50%"}}
              disabled={!Boolean(editDialogSubmitEnabled && editDialogFieldEmail)}
              type="submit">
              <Typography variant="body1">Save</Typography>
            </Button>
          </Stack>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteConfirmation}
        onClose={() => setDeleteConfirmation(false)}
        // className={classes.dialog}
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          Delete User
        </DialogTitle>

        <DialogContent>
          Are you sure you want to delete this user 
          {/* "{userToDelete?.userId}" */}
          ?
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={() => setDeleteConfirmation(false)}
            color="primary"
            sx={{
              "&:hover": {
                color: "white",
                backgroundColor: "green",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="primary"
            sx={{
              color: "red",
              "&:hover": {
                color: "white",
                backgroundColor: "red",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default UserManagement;
