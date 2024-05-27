import React, { useMemo } from "react";
import {
    Typography, Stack, Paper,
    Box
} from "@mui/material";
import { DataTable } from "../../Components/DataTable/DataTable.js";
import { AccountCircleIcon, SchoolIcon } from "../../Imports/Icons.js";
import { useAppUser } from "../../Hooks/useAppUser.js";
import { useTitle } from "../../ContextProviders/AppFeatures.js";

import { CourseNameCell } from "../../Components/TableCells/Course/CourseNameCell.js";
import { CourseStartDateTimeCell } from "../../Components/TableCells/Course/CourseStartDateTimeCell.js";
import { CourseEndDateTimeCell } from "../../Components/TableCells/Course/CourseEndDateTimeCell.js";
import { CourseStatusCell } from "../../Components/TableCells/Course/CourseStatusCell.js";
import { CourseNotesCell } from "../../Components/TableCells/Course/CourseNotesCell.js";
import { ManagementPageProvider, useItemsReducer } from "../../ContextProviders/ManagementPageProvider.js";
import { UserFullNameReverseCell } from "../../Components/TableCells/User/UserFullNameReverseCell.js";
import { UserEmailCopyCell } from "../../Components/TableCells/User/UserEmailCopyCell.js";
import { UserProfilePasswordInfoCell } from "../../Components/TableCells/User/UserProfilePasswordInfoCell.js";
import { UserTypeCell } from "../../Components/TableCells/User/UserTypeCell.js";
import { UserExhibitionQuotaCell } from "../../Components/TableCells/User/UserExhibitionQuotaCell.js";
import { User } from "../../Classes/Entities/User.js";
import { Course } from "../../Classes/Entities/Course.js";

const courseTableFields = [
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

const Profile = () => {
    const appUser = useAppUser();

    const [usersCombinedState, {
        setItems: setUsers,
        calculateSortableItemValues: calculateSortableUserValues
    }] = useItemsReducer([appUser]);

    const [coursesCombinedState, {
        setItems: setCourses,
        calculateSortableItemValues: calculateSortableCourseValues
    }] = useItemsReducer(appUser.Courses);

    useTitle("Profile");

    const managementCallbacks = useMemo(() => ({}), []);

    return (
        <Box
            component={Paper}
            square
            sx={{ height: "100%", overflowY: "auto" }}
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
                        <ManagementPageProvider
                            Entity={User}
                            calculateSortableItemValues={calculateSortableUserValues}
                            itemsCombinedState={usersCombinedState}
                            managementCallbacks={managementCallbacks}
                            setItems={setUsers}
                        >
                            <DataTable
                                noSkeleton
                                tableFields={userTableFields}
                            />
                        </ManagementPageProvider>
                    </Box>
                </Stack>
            </Stack>

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
                        paddingLeft={1}
                        spacing={2}
                        sx={{ gridArea: "title" }}
                    >
                        <SchoolIcon fontSize="large" />

                        <Typography variant="h4">
                            My Courses
                        </Typography>
                    </Stack>

                    <ManagementPageProvider
                        Entity={Course}
                        calculateSortableItemValues={calculateSortableCourseValues}
                        itemsCombinedState={coursesCombinedState}
                        managementCallbacks={managementCallbacks}
                        setItems={setCourses}
                    >
                        <DataTable
                            defaultSortAscending={false}
                            defaultSortColumn="Start"
                            noSkeleton
                            tableFields={courseTableFields}
                        />
                    </ManagementPageProvider>
                </Stack>
            </Stack>
        </Box>
    );
};

export default Profile;
