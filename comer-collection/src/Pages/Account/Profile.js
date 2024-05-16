import React, { useEffect } from "react";
import {
    Typography,
    Button,
    Stack, Paper,
    Box
} from "@mui/material";
import { Navigate, useNavigate } from "react-router";
import { DataTable } from "../../Components/DataTable.js";
import { SecurityIcon, PersonIcon, AccountCircleIcon, SchoolIcon, PhotoCameraBackIcon, CollectionManagerIcon } from "../../Imports/Icons.js";
import { useAppUser } from "../../ContextProviders/AppUser.js";
import { useTitle } from "../../ContextProviders/AppFeatures.js";

import { useAccountNav } from "../../ContextProviders/AccountNavProvider.js";
import { Course } from "../../Classes/Entities/Course.js";
import { User } from "../../Classes/Entities/User.js";

const Profile = () => {
    const [, setSelectedNavItem] = useAccountNav();

    const [appUser] = useAppUser();

    const navigate = useNavigate();
    const setTitleText = useTitle();

    useEffect(() => {
        setSelectedNavItem("Profile");
        setTitleText("Profile");
    }, [setSelectedNavItem, setTitleText]);

    const courseTableFields = [
        {
            columnDescription: "Course Name",
            generateTableCell: (course) => (
                <Typography variant="body1">{course.name}</Typography>
            )
        },
        {
            columnDescription: "Start",
            generateTableCell: (course) => (
                <Course.TableCells.StartDateTime {...{ course }} />
            )
        },
        {
            columnDescription: "End",
            generateTableCell: (course) => (
                <Course.TableCells.EndDateTime {...{ course }} />
            )
        },
        {
            columnDescription: "Status",
            generateTableCell: (course) => (
                <Course.TableCells.Status {...{ course }} />
            )
        },
        {
            columnDescription: "Notes",
            maxWidth: "300px",
            generateTableCell: (course) => (
                <Typography variant="body1">{course.notes}</Typography>
            )
        }
    ];

    const userTableFields = [
        {
            columnDescription: "Name",
            generateTableCell: (user) => (
                user.has_name
                    ? (
                        <Typography variant="body1">{user.full_name}</Typography>
                    )
                    : (
                        <Typography variant="body1" sx={{ opacity: 0.5 }}>Not set</Typography>
                    )
            )
        },
        {
            columnDescription: "Email",
            TableCellComponent: User.TableCells.EmailWithCopyButton
        },
        {
            columnDescription: "Password",
            generateTableCell: (user) => (
                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="body1">{new Date(appUser.pw_updated).toLocaleString()}</Typography>
                    <Button color={user.is_admin_or_collection_manager ? "secondary" : "primary"}
                        variant="outlined"
                        onClick={() => {
                            navigate("/Account/ChangePassword");
                        }}>
                        <Typography variant="body1">Change</Typography>
                    </Button>
                </Stack>
            )
        },
        {
            columnDescription: "User Type",
            generateTableCell: (user) => (
                <Stack direction="row" spacing={1}>
                    <Typography variant="body1">{user.is_admin ? "Administrator" : user.is_collection_manager ? "Collection Manager" : "Curator"}</Typography>
                    {user.is_admin ? (<SecurityIcon color="secondary" />) : user.is_collection_manager ? (<CollectionManagerIcon color="secondary" />) : (<PersonIcon color="primary" />)}
                </Stack>
            )
        },
        {
            columnDescription: "Exhibition Quota",
            generateTableCell: (user) => (
                <Stack direction="row" spacing={1}>
                    <PhotoCameraBackIcon />
                    <Typography variant="body1">{user.Exhibitions.length} of {user.exhibition_quota} </Typography>
                    <Typography variant="body1" color="gray">{user.is_admin ? " (ignored for administrators)" : ""}</Typography>
                </Stack>
            )
        }
    ];

    return (appUser.pw_change_required &&
        <Navigate to="/Account/ChangePassword" />
    ) || (!appUser.pw_change_required &&
        <Box component={Paper} square sx={{ height: "100%", overflowY: "auto" }}>
            <Stack spacing={4} paddingTop={5} paddingLeft={5} paddingRight={5}>
                <Stack spacing={2}>
                    <Stack direction="row" paddingLeft={1} spacing={2} alignItems="center">
                        <AccountCircleIcon fontSize="large" />
                        <Typography variant="h4">Profile Information</Typography>
                    </Stack>
                    <Box sx={{ height: "100px" }}>
                        <DataTable
                            items={[appUser]}
                            visibleItems={[appUser]}
                            tableFields={userTableFields}
                        />
                    </Box>
                </Stack>
            </Stack>
            <Stack spacing={4} paddingTop={5} paddingLeft={5} paddingRight={5} height="400px">
                <Stack spacing={2} sx={{
                    display: "grid",
                    gridTemplateRows: "50px 350px",
                    gridTemplateColumns: "1fr",
                    gridTemplateAreas: `
          "title"
          "content"
        `
                }} overflow="hidden">
                    <Stack direction="row" paddingLeft={1} spacing={2} alignItems="center"
                        sx={{ gridArea: "title" }}>
                        <SchoolIcon fontSize="large" />
                        <Typography variant="h4">My Courses</Typography>
                    </Stack>
                    <DataTable sx={{ overflow: "scroll" }}
                        items={appUser.Courses}
                        visibleItems={appUser.Courses}
                        tableFields={courseTableFields}
                        NoContentIcon={SchoolIcon}
                        noContentMessage="You are not enrolled in any courses."
                        defaultSortAscending={false}
                        defaultSortColumn="Start"
                    />
                </Stack>
            </Stack>
        </Box>
    );
};

export default Profile;
