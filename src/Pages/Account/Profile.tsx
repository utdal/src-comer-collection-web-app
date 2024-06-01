import React, { useMemo } from "react";
import {
    Typography, Stack, Paper,
    Box
} from "@mui/material";
import { DataTable } from "../../Components/DataTable/DataTable.js";
import { AccountCircleIcon, SchoolIcon } from "../../Imports/Icons.js";
import useAppUser from "../../Hooks/useAppUser.js";
import { useTitle } from "../../ContextProviders/AppFeatures.js";

import CourseNameCell from "../../Components/TableCells/Course/CourseNameCell.js";
import CourseStartDateTimeCell from "../../Components/TableCells/Course/CourseStartDateTimeCell.js";
import CourseEndDateTimeCell from "../../Components/TableCells/Course/CourseEndDateTimeCell.js";
import CourseStatusCell from "../../Components/TableCells/Course/CourseStatusCell.js";
import CourseNotesCell from "../../Components/TableCells/Course/CourseNotesCell.js";
import { ManagementPageProvider, useItemsReducer } from "../../ContextProviders/ManagementPageProvider.js";
import UserFullNameReverseCell from "../../Components/TableCells/User/UserFullNameReverseCell.js";
import UserEmailCopyCell from "../../Components/TableCells/User/UserEmailCopyCell.js";
import UserProfilePasswordInfoCell from "../../Components/TableCells/User/UserProfilePasswordInfoCell.js";
import UserTypeCell from "../../Components/TableCells/User/UserTypeCell.js";
import UserExhibitionQuotaCell from "../../Components/TableCells/User/UserExhibitionQuotaCell.js";
import { User } from "../../Classes/Entities/User.js";
import { Course } from "../../Classes/Entities/Course.js";
import PaginationSummary from "../../Components/PaginationSummary/PaginationSummary.js";
import type { AppUser, CourseItem, TableFieldDefinition } from "../../index.js";

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
    const [coursesCombinedState, coursesCallbacks] = useItemsReducer(appUser.Courses as CourseItem[]);

    useTitle("Profile");

    const managementCallbacks = useMemo(() => ({}), []);

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
                managementCallbacks={managementCallbacks}
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
                managementCallbacks={managementCallbacks}
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
                            tableFields={courseTableFields}
                        />
                    </Stack>
                </Stack>
            </ManagementPageProvider>
        </Box>
    );
};

export default Profile;
