import React from "react";
import { SchoolIcon } from "../../Imports/Icons.js";
import PropTypes from "prop-types";
import { SecondaryFilterMenu } from "./SecondaryFilterMenu.js";
import { Typography } from "@mui/material";
import { entityPropTypeShape } from "../../Classes/Entity.js";

const courseSortFunction = (a, b) => {
    return (new Date(b.date_start)).getTime() - (new Date(a.date_start)).getTime();
};

const courseDisplayFunction = (c) => {
    return (
        <>
            <Typography
                sx={{ minWidth: "120px", maxWidth: "200px", wordWrap: "break-word" }}
                variant="body1"
            >
                {c.name}
            </Typography>

            <Typography sx={{ opacity: 0.5 }}>
                {/* {} */}
                {(new Date(c.date_start)).toLocaleDateString() + "-" + (new Date(c.date_end)).toLocaleDateString()}
            </Typography>

        </>
    );
};

export const CourseFilterMenu = ({ filterValue, setFilterValue, courses }) => {
    return (
        <SecondaryFilterMenu
            SecondaryIcon={SchoolIcon}
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

CourseFilterMenu.propTypes = {
    courses: PropTypes.arrayOf(PropTypes.shape(entityPropTypeShape)).isRequired,
    filterValue: PropTypes.shape(entityPropTypeShape),
    setFilterValue: PropTypes.func.isRequired
};

CourseFilterMenu.defaultProps = {
    filterValue: null
};
