import React from "react";
import {
    Typography, Stack, Paper,
    Box
} from "@mui/material";
import DataTable from "../../Components/DataTable/DataTable";
import { AccountCircleIcon, SchoolIcon } from "../../Imports/Icons";
import useAppUser from "../../Hooks/useAppUser";
import { useTitle } from "../../ContextProviders/AppFeatures";

import CourseNameCell from "../../Components/TableCells/Course/CourseNameCell";
import CourseStartDateTimeCell from "../../Components/TableCells/Course/CourseStartDateTimeCell";
import CourseEndDateTimeCell from "../../Components/TableCells/Course/CourseEndDateTimeCell";
import CourseStatusCell from "../../Components/TableCells/Course/CourseStatusCell";
import CourseNotesCell from "../../Components/TableCells/Course/CourseNotesCell";
import { ManagementPageProvider, useItemsReducer } from "../../ContextProviders/ManagementPageProvider";
import UserFullNameReverseCell from "../../Components/TableCells/User/UserFullNameReverseCell";
import UserEmailCopyCell from "../../Components/TableCells/User/UserEmailCopyCell";
import UserProfilePasswordInfoCell from "../../Components/TableCells/User/UserProfilePasswordInfoCell";
import UserTypeCell from "../../Components/TableCells/User/UserTypeCell";
import UserExhibitionQuotaCell from "../../Components/TableCells/User/UserExhibitionQuotaCell";
import { User } from "../../Classes/Entities/User";
import { Course } from "../../Classes/Entities/Course";
import PaginationSummary from "../../Components/PaginationSummary/PaginationSummary";
import type { AppUser, Intent, TableFieldDefinition } from "../../index";
import useDialogStates from "../../Hooks/useDialogStates";

const courseTableFields: TableFieldDefinition[] = [
    {
        columnDescription: "Course Name",
        TableCellComponent: CourseNameCell
    },
    {
        columnDescription: "Start",
        TableCellComponent: CourseStartDateTimeCell
    },
    {
        columnDescription: "End",
        TableCellComponent: CourseEndDateTimeCell
    },
    {
        columnDescription: "Status",
        TableCellComponent: CourseStatusCell
    },
    {
        columnDescription: "Notes",
        TableCellComponent: CourseNotesCell,
        maxWidth: "300px"
    }
];

const userTableFields = [
    {
        columnDescription: "Name",
        TableCellComponent: UserFullNameReverseCell
    },
    {
        columnDescription: "Email",
        TableCellComponent: UserEmailCopyCell
    },
    {
        columnDescription: "Password",
        TableCellComponent: UserProfilePasswordInfoCell
    },
    {
        columnDescription: "User Type",
        TableCellComponent: UserTypeCell
    },
    {
        columnDescription: "Exhibition Quota",
        TableCellComponent: UserExhibitionQuotaCell
    }
];

const Profile = (): React.JSX.Element => {
    const appUser = useAppUser() as AppUser;

    const [usersCombinedState, usersCallbacks] = useItemsReducer([appUser]);
    const [coursesCombinedState, coursesCallbacks] = useItemsReducer(appUser.Courses);

    const dialogCallbacks = useDialogStates([] as Intent[]);

    useTitle("Profile");

    return (
        <Box
            component={Paper}
            square
            sx={{ height: "100%", overflowY: "auto" }}
        >
            <ManagementPageProvider
                Entity={User}
                itemsCallbacks={usersCallbacks}
                itemsCombinedState={usersCombinedState}
                managementCallbacks={dialogCallbacks}
            >
                <Stack
                    paddingLeft={5}
                    paddingRight={5}
                    paddingTop={5}
                    spacing={4}
                >
                    <Stack spacing={2}>
                        <Stack
                            alignItems="center"
                            direction="row"
                            paddingLeft={1}
                            spacing={2}
                        >
                            <AccountCircleIcon fontSize="large" />

                            <Typography variant="h4">
                                Profile Information
                            </Typography>
                        </Stack>

                        <Box height="100px">
                            <DataTable
                                noSkeleton
                                rowSelectionEnabled={false}
                                tableFields={userTableFields}
                            />
                        </Box>
                    </Stack>
                </Stack>
            </ManagementPageProvider>

            <ManagementPageProvider
                Entity={Course}
                itemsCallbacks={coursesCallbacks}
                itemsCombinedState={coursesCombinedState}
                managementCallbacks={dialogCallbacks}
            >
                <Stack
                    height="400px"
                    paddingLeft={5}
                    paddingRight={5}
                    paddingTop={5}
                    spacing={4}
                >
                    <Stack
                        overflow="hidden"
                        spacing={2}
                        sx={{
                            display: "grid",
                            gridTemplateRows: "50px 350px",
                            gridTemplateColumns: "1fr",
                            gridTemplateAreas: `
                            "title"
                            "content"
                        `
                        }}
                    >
                        <Stack
                            alignItems="center"
                            direction="row"
                            justifyContent="space-between"
                            paddingLeft={1}
                            spacing={2}
                            sx={{ gridArea: "title" }}
                        >
                            <Stack
                                alignItems="center"
                                direction="row"
                                spacing={2}
                            >
                                <SchoolIcon fontSize="large" />

                                <Typography variant="h4">
                                    My Courses
                                </Typography>

                            </Stack>

                            <PaginationSummary />
                        </Stack>

                        <DataTable
                            defaultSortAscending={false}
                            defaultSortColumn="Start"
                            noSkeleton
                            rowSelectionEnabled={false}
                            tableFields={courseTableFields}
                        />
                    </Stack>
                </Stack>
            </ManagementPageProvider>
        </Box>
    );
};

export default Profile;
