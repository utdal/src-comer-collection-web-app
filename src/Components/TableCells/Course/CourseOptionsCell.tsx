import React from "react";
import CourseEditButton from "./CourseEditButton";
import CourseDeleteButton from "./CourseDeleteButton";

const CourseOptionsCell = (): React.JSX.Element => {
    return (
        <>
            <CourseEditButton />

            <CourseDeleteButton />
        </>
    );
};

export default CourseOptionsCell;
