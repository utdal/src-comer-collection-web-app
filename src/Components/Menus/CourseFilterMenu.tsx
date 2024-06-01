import type { ElementType } from "react";
import React from "react";
import { SchoolIcon } from "../../Imports/Icons.js";
import { SecondaryFilterMenu } from "./SecondaryFilterMenu.js";
import { Typography } from "@mui/material";
import type { CourseItem, Item } from "../../index.js";

const courseSortFunction = (a: Item, b: Item): number => {
    return (new Date((b as CourseItem).date_start)).getTime() - (new Date((a as CourseItem).date_start)).getTime() ? 1 : -1;
};

const courseDisplayFunction = (c: Item): React.ReactNode => {
    return (
        <>
            <Typography
                sx={{ minWidth: "120px", maxWidth: "200px", wordWrap: "break-word" }}
                variant="body1"
            >
                {(c as CourseItem).name}
            </Typography>

            <Typography sx={{ opacity: 0.5 }}>
                {/* {} */}
                {(new Date((c as CourseItem).date_start)).toLocaleDateString() + "-" + (new Date((c as CourseItem).date_end)).toLocaleDateString()}
            </Typography>

        </>
    );
};

export const CourseFilterMenu = ({ filterValue, setFilterValue, courses }: {
    readonly filterValue: CourseItem;
    readonly setFilterValue: React.Dispatch<React.SetStateAction<Item | null>>;
    readonly courses: CourseItem[];
}): React.JSX.Element => {
    return (
        <SecondaryFilterMenu
            SecondaryIcon={SchoolIcon as ElementType}
            displayFunction={courseDisplayFunction}
            emptyMessage="No course filters available"
            filterValue={filterValue}
            helpMessage="Filter users by course"
            nullMessage="Do not filter by course"
            secondaries={courses}
            setFilterValue={setFilterValue}
            sortFunction={courseSortFunction}
        />
    );
};
