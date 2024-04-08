/* eslint-disable react/prop-types */
import { Button, Stack, Typography } from "@mui/material";
import { Entity } from "./Entity.js";
import React from "react";
import { PersonIcon } from "../../../IconImports.js";

class Course extends Entity {
    static baseUrl = "/api/admin/courses";
    static singular = "course";
    static plural = "courses";

    static formatDate = (date) => {
        return new Date(date).toLocaleDateString([], {
            year: "numeric",
            month: "short",
            day: "numeric",
            weekday: "short"
        });
    };

    static formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        });
    };

    static TableCells = {
        ID({ course }) {
            return (
                <Typography variant="body1">{course.id}</Typography>
            );
        },
        Name({ course }) {
            return (
                <Typography variant="body1">{course.name}</Typography>
            );
        },
        Status({ course }) {
            return (
                <Typography variant="body1">{course.status}</Typography>
            );
        },
        StartDateTime({ course }) {
            return (
                <Typography variant="body1">
                    {Course.formatDate(course.date_start)}, {Course.formatTime(course.date_start)}
                </Typography>
            );
        },
        StartDateTimeStacked({ course }) {
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
        EndDateTime({ course }) {
            return (
                <Typography variant="body1">
                    {Course.formatDate(course.date_end)}, {Course.formatTime(course.date_end)}
                </Typography>
            );
        },
        EndDateTimeStacked({ course }) {
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
        UserAssignmentButton({ course, onClick }) {
            return (
                <Stack direction="row" spacing={1} alignItems="center">
                    <Button variant="outlined" color="primary" startIcon={<PersonIcon />}
                        {...{onClick}}
                    >
                        <Typography variant="body1">{course.Users.length}</Typography>
                    </Button>
                </Stack>
            );
        },
        Notes({ course }) {
            return (
                <Typography variant="body1">{course.notes}</Typography>
            );
        },
        EditButton({ onClick }) {
            return (
                <Entity.TableCells.EditButton {...{onClick}} />
            );
        },
        DeleteButton({ course, onClick }) {
            return (
                <Entity.TableCells.DeleteButton 
                    disabled={course.Users.length > 0}
                    {...{onClick}} />
            );
        }
    };
    
}

export { Course };