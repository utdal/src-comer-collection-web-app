/* eslint-disable react/prop-types */
import { Button, Stack, Switch, Typography } from "@mui/material";
import { sendAuthenticatedRequest } from "../../Helpers/APICalls.js";
import { Entity } from "../Entity.js";
import React from "react";
import { useAppUser } from "../../ContextProviders/AppUser.js";
import { CollectionManagerIcon, LockIcon, LockResetIcon, OpenInNewIcon, PersonIcon, PhotoCameraBackIcon, SchoolIcon, SecurityIcon } from "../../Imports/Icons.js";
import { useTableRowItem } from "../../ContextProviders/TableRowProvider.js";

class User extends Entity {
    static baseUrl = "/api/admin/users";
    static singular = "user";
    static plural = "users";

    static fieldDefinitions = [
        {
            fieldName: "given_name",
            displayName: "First Name"
        },
        {
            fieldName: "family_name",
            displayName: "Last Name"
        },
        {
            fieldName: "email",
            displayName: "Email",
            isRequired: true,
            inputType: "email"
        },
        {
            fieldName: "exhibition_quota",
            displayName: "Exhibition Quota",
            isRequired: true,
            inputType: "number",
            blank: 5,
            minValue: 0
        }
    ];

    static TableCells = {
        ID () {
            const user = useTableRowItem();
            const [appUser] = useAppUser();
            return (
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body1">{user.id}</Typography>
                    {user.id === appUser.id && (
                        <PersonIcon color="secondary" />
                    )}
                </Stack>
            );
        },
        IDWithAccessIcon () {
            const user = useTableRowItem();
            return (
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body1">{user.id} </Typography>
                    {
                        (user.is_admin && <SecurityIcon color="secondary" />) ||
                        (user.is_collection_manager && <CollectionManagerIcon color="secondary" />)
                    }
                </Stack>
            );
        },
        Name () {
            const user = useTableRowItem();
            return (
                user.has_name
                    ? (
                        <Typography variant="body1">{user.full_name_reverse}</Typography>
                    )
                    : (
                        <Typography variant="body1" sx={{ opacity: 0.5 }}>Not set</Typography>
                    )
            );
        },
        Email ({ onClick }) {
            const user = useTableRowItem();
            return (onClick &&
                <Button color="grey"
                    variant="text" sx={{ textTransform: "unset" }}
                    onClick={onClick}>
                    <Typography variant="body1">{user.email}</Typography>
                </Button>
            ) || (!onClick &&
                <Typography variant="body1" color="grey">{user.email}</Typography>
            );
        },
        StackedNameEmail () {
            const user = useTableRowItem();
            return (
                <Stack direction="column" paddingTop={1} paddingBottom={1}>
                    <Typography variant="body1">{user.full_name_reverse}</Typography>
                    <Typography variant="body1" sx={{ opacity: 0.5 }}>{user.email}</Typography>
                </Stack>
            );
        },
        PasswordChangeCurrentAdmin ({ onClick }) {
            const user = useTableRowItem();
            return (
                <Button startIcon={<OpenInNewIcon />} color={user.is_admin_or_collection_manager ? "secondary" : "primary"}
                    variant="outlined"
                    onClick={onClick}>
                    <Typography variant="body1">Change</Typography>
                </Button>
            );
        },
        PasswordSetOrReset ({ onClick }) {
            const user = useTableRowItem();
            return (
                <Button
                    startIcon={user.has_password ? <LockResetIcon /> : <LockIcon />}
                    color={user.is_admin_or_collection_manager ? "secondary" : "primary"}
                    itemID={user.id}
                    variant={user.has_password ? "outlined" : "contained"}
                    onClick={onClick}>
                    <Typography variant="body1">
                        {user.has_password ? "Reset" : "Set"}
                    </Typography>
                </Button>
            );
        },
        CourseAssignmentButton ({ onClick }) {
            const user = useTableRowItem();
            return (
                <Stack direction="row" spacing={1} alignItems="center">
                    <Button variant="text"
                        color="lightgrey"
                        startIcon={<SchoolIcon />}
                        onClick={onClick}
                    >
                        <Typography variant="body1">{user.Courses.length}</Typography>
                    </Button>
                </Stack>
            );
        },
        UserExhibitionCountButton ({ onClick }) {
            const user = useTableRowItem();
            return (
                <Stack direction="row" spacing={1}>
                    <Button variant="text" sx={{ textTransform: "unset" }}
                        color="lightgrey"
                        startIcon={<PhotoCameraBackIcon />}
                        {...{ onClick }}
                    >
                        <Typography variant="body1">{user.Exhibitions.length} of {user.exhibition_quota}</Typography>
                    </Button>
                </Stack>
            );
        },
        UserTypeButton ({ onClick }) {
            const user = useTableRowItem();
            const [appUser] = useAppUser();
            return (
                <Button color="lightgrey" sx={{ textTransform: "unset" }}
                    disabled={user.id === appUser.id}
                    {...{ onClick }}
                    startIcon={
                        (user.is_admin && <SecurityIcon color="secondary" />) ||
                        (user.is_collection_manager && <CollectionManagerIcon color="secondary" />) ||
                        (<PersonIcon color="primary" />)
                    }
                >
                    <Typography variant="body1" align="left" width={90} >{user.is_admin ? "Administrator" : user.is_collection_manager ? "Collection Manager" : "Curator"}</Typography>
                </Button>
            );
        },
        UserActivationSwitch ({ onClick }) {
            const user = useTableRowItem();
            const [appUser] = useAppUser();
            return (
                <Switch
                    itemID={user.id}
                    checked={user.is_active && user.has_password}
                    disabled={user.id === appUser.id || !user.has_password}
                    color={user.is_admin_or_collection_manager ? "secondary" : "primary"}
                    {...{ onClick }}
                />
            );
        },
        DeleteButton ({ onClick }) {
            const user = useTableRowItem();
            const appUser = useAppUser();
            const disabled = Boolean(user.Courses.length || user.Exhibitions.length || user.id === appUser.id);
            return (
                <Entity.TableCells.DeleteButton {...{ onClick, disabled }} />
            );
        }
    };

    static handleChangeUserAccess (userId, newAccess) {
        return new Promise((resolve, reject) => {
            sendAuthenticatedRequest("PUT", `${this.baseUrl}/${userId}/access`, { access_level: newAccess }).then(() => {
                resolve("User access updated");
            }).catch(() => {
                reject(new Error("Failed to update user access"));
            });
        });
    }

    static handleChangeUserActivationStatus (userId, newActivationStatus) {
        return new Promise((resolve, reject) => {
            sendAuthenticatedRequest("PUT", `${this.baseUrl}/${userId}/${newActivationStatus ? "activate" : "deactivate"}`).then(() => {
                resolve(newActivationStatus ? "User activated" : "User deactivated");
            }).catch(() => {
                reject(new Error(newActivationStatus ? "Failed to activate user" : "Failed to deactivate user"));
            });
        });
    }

    static handleResetPassword (userId, newPassword) {
        return new Promise((resolve, reject) => {
            sendAuthenticatedRequest("PUT", `${this.baseUrl}/${userId}/password`, { newPassword }).then(() => {
                resolve("Password reset");
            }).catch(() => {
                reject(new Error("Failed to reset password"));
            });
        });
    }
}

export { User };
