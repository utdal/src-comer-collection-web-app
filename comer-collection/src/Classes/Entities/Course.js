/* eslint-disable react/prop-types */
import { Button, Stack, Typography } from "@mui/material";
import { Entity } from "../Entity.js";
import React from "react";
import { AccessTimeIcon, CheckIcon, ExpiredIcon, PersonIcon } from "../../Imports/Icons.js";
import { useTableRowItem } from "../../ContextProviders/TableRowProvider.js";

class Course extends Entity {
    static baseUrl = "/api/admin/courses";
    static singular = "course";
    static plural = "courses";

    static fieldDefinitions = [
        {
            fieldName: "name",
            displayName: "Course Name",
            inputType: "textarea",
            isRequired: true
        },
        {
            fieldName: "date_start",
            displayName: "Start",
            inputType: "datetime-local",
            isRequired: true
        },
        {
            fieldName: "date_end",
            displayName: "End",
            inputType: "datetime-local",
            isRequired: true
        },
        {
            fieldName: "notes",
            displayName: "Notes",
            inputType: "textarea",
            multiline: true
        }
    ];

    static TableCells = {
        ID () {
            const course = useTableRowItem();
            return (
                <Typography variant="body1">{course.id}</Typography>
            );
        },
        Name () {
            const course = useTableRowItem();
            return (
                <Typography variant="body1">{course.name}</Typography>
            );
        },
        Status () {
            const course = useTableRowItem();
            return (
                <Stack direction="row" spacing={1}>
                    {
                        (course.status === "Active" && <CheckIcon color="grey"/>) ||
                        (course.status === "Upcoming" && <AccessTimeIcon color="grey"/>) ||
                        (course.status === "Expired" && <ExpiredIcon color="grey"/>)
                    }
                    <Typography variant="body1">{course.status}</Typography>
                </Stack>
            );
        },
        StartDateTime () {
            const course = useTableRowItem();
            return (
                <Typography variant="body1">
                    {Course.formatDate(course.date_start)}, {Course.formatTime(course.date_start)}
                </Typography>
            );
        },
        StartDateTimeStacked () {
            const course = useTableRowItem();
            return (
                <Stack direction="column" padding={0}>
                    <Typography variant="body1">
                        {Course.formatDate(course.date_start)}
                    </Typography>
                    <Typography variant="body1">
                        {Course.formatTime(course.date_start)}
                    </Typography>
                </Stack>
            );
        },
        EndDateTime () {
            const course = useTableRowItem();
            return (
                <Typography variant="body1">
                    {Course.formatDate(course.date_end)}, {Course.formatTime(course.date_end)}
                </Typography>
            );
        },
        EndDateTimeStacked () {
            const course = useTableRowItem();
            return (
                <Stack direction="column" padding={0}>
                    <Typography variant="body1">
                        {Course.formatDate(course.date_end)}
                    </Typography>
                    <Typography variant="body1">
                        {Course.formatTime(course.date_end)}
                    </Typography>
                </Stack>
            );
        },
        UserAssignmentButton ({ onClick }) {
            const course = useTableRowItem();
            return (
                <Stack direction="row" spacing={1} alignItems="center">
                    <Button variant="outlined" color="primary" startIcon={<PersonIcon />}
                        {...{ onClick }}
                    >
                        <Typography variant="body1">{course.Users.length}</Typography>
                    </Button>
                </Stack>
            );
        },
        Notes () {
            const course = useTableRowItem();
            return (
                <Typography variant="body1">{course.notes}</Typography>
            );
        },
        EditButton ({ onClick }) {
            return (
                <Entity.TableCells.EditButton {...{ onClick }} />
            );
        },
        DeleteButton ({ onClick }) {
            const course = useTableRowItem();
            return (
                <Entity.TableCells.DeleteButton
                    disabled={course.Users.length > 0}
                    {...{ onClick }} />
            );
        }
    };
}

export { Course };
