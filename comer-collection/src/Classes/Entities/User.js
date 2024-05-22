/* eslint-disable react/prop-types */
import { Button, Stack, Switch, Typography } from "@mui/material";
import { sendAuthenticatedRequest } from "../../Helpers/APICalls.js";
import { Entity } from "../Entity.js";
import React, { useCallback } from "react";
import { useAppUser } from "../../ContextProviders/AppUser.js";
import { CollectionManagerIcon, LockIcon, LockResetIcon, OpenInNewIcon, PersonIcon, PhotoCameraBackIcon, SchoolIcon, SecurityIcon } from "../../Imports/Icons.js";
import { useTableRowItem } from "../../ContextProviders/TableRowProvider.js";
import { useClipboard } from "../../ContextProviders/AppFeatures.js";
import { useManagementCallbacks } from "../../ContextProviders/ManagementPageProvider.js";
import { EntityManageEditButton } from "../../Components/TableCells/Entity/EntityManageEditButton.js";
import { EditButton } from "../../Components/TableCells/Entity/EditButton.js";
import { DeleteButton } from "../../Components/TableCells/Entity/DeleteButton.js";

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
                <Stack
                    alignItems="center"
                    direction="row"
                    spacing={1}
                >
                    <Typography variant="body1">
                        {user.id}
                    </Typography>

                    {user.id === appUser.id && (
                        <PersonIcon color="secondary" />
                    )}
                </Stack>
            );
        },
        IDWithAccessIcon () {
            const user = useTableRowItem();
            return (
                <Stack
                    alignItems="center"
                    direction="row"
                    spacing={1}
                >
                    <Typography variant="body1">
                        {user.id}

                        {" "}
                    </Typography>

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
                        <Typography variant="body1">
                            {user.full_name_reverse}
                        </Typography>
                    )
                    : (
                        <Typography
                            sx={{ opacity: 0.5 }}
                            variant="body1"
                        >
                            Not set
                        </Typography>
                    )
            );
        },
        Email () {
            const user = useTableRowItem();
            return (
                <Typography
                    color="grey"
                    variant="body1"
                >
                    {user.email}
                </Typography>
            );
        },
        EmailWithCopyButton () {
            const user = useTableRowItem();
            const clipboard = useClipboard();
            const handleCopyToClipboard = useCallback(() => {
                clipboard(user.email);
            }, [clipboard, user.email]);
            return (
                <Button
                    color="grey"
                    onClick={handleCopyToClipboard}
                    sx={{ textTransform: "unset" }}
                    variant="text"
                >
                    <Typography variant="body1">
                        {user.email}
                    </Typography>
                </Button>
            );
        },
        StackedNameEmail () {
            const user = useTableRowItem();
            return (
                <Stack
                    direction="column"
                    paddingBottom={1}
                    paddingTop={1}
                >
                    <Typography variant="body1">
                        {user.full_name_reverse}
                    </Typography>

                    <Typography
                        sx={{ opacity: 0.5 }}
                        variant="body1"
                    >
                        {user.email}
                    </Typography>
                </Stack>
            );
        },
        PasswordSetOrReset () {
            const user = useTableRowItem();
            const appUser = useAppUser();
            const { handleOpenUserPasswordResetDialog, handleNavigateToChangePassword } = useManagementCallbacks();
            const handleOpenPasswordResetDialog = useCallback(() => {
                handleOpenUserPasswordResetDialog(user);
            }, [handleOpenUserPasswordResetDialog, user]);
            if (appUser.id === user.id) {
                return (
                    <Button
                        color="secondary"
                        onClick={handleNavigateToChangePassword}
                        startIcon={<OpenInNewIcon />}
                        variant="outlined"
                    >
                        <Typography variant="body1">
                            Change
                        </Typography>
                    </Button>
                );
            } else {
                return (
                    <Button
                        color={user.is_admin_or_collection_manager ? "secondary" : "primary"}
                        itemID={user.id}
                        onClick={handleOpenPasswordResetDialog}
                        startIcon={user.has_password ? <LockResetIcon /> : <LockIcon />}
                        variant={user.has_password ? "outlined" : "contained"}
                    >
                        <Typography variant="body1">
                            {user.has_password ? "Reset" : "Set"}
                        </Typography>
                    </Button>
                );
            }
        },
        CourseAssignmentButton () {
            const user = useTableRowItem();
            const { handleOpenUserAssignCourseDialog } = useManagementCallbacks();
            const handleOpenAssignCourseDialog = useCallback(() => {
                handleOpenUserAssignCourseDialog(user);
            }, [handleOpenUserAssignCourseDialog, user]);
            return (
                <Stack
                    alignItems="center"
                    direction="row"
                    spacing={1}
                >
                    <Button
                        color="lightgrey"
                        onClick={handleOpenAssignCourseDialog}
                        startIcon={<SchoolIcon />}
                        variant="text"
                    >
                        <Typography variant="body1">
                            {user.Courses.length}
                        </Typography>
                    </Button>
                </Stack>
            );
        },
        UserExhibitionCountButton () {
            const user = useTableRowItem();
            const { handleOpenViewUserExhibitionDialog } = useManagementCallbacks();
            const handleOpenViewExhibitionDialog = useCallback(() => {
                handleOpenViewUserExhibitionDialog(user);
            }, [handleOpenViewUserExhibitionDialog, user]);
            return (
                <Stack
                    direction="row"
                    spacing={1}
                >
                    <Button
                        color="lightgrey"
                        onClick={handleOpenViewExhibitionDialog}
                        startIcon={<PhotoCameraBackIcon />}
                        sx={{ textTransform: "unset" }}
                        variant="text"
                    >
                        <Typography variant="body1">
                            {user.Exhibitions.length}

                            {" "}
                            of

                            {" "}

                            {user.exhibition_quota}
                        </Typography>
                    </Button>
                </Stack>
            );
        },
        UserTypeButton () {
            const user = useTableRowItem();
            const [appUser] = useAppUser();
            const { handleOpenUserPrivilegesDialog } = useManagementCallbacks();
            const handleOpenPrivilegesDialog = useCallback(() => {
                handleOpenUserPrivilegesDialog(user);
            }, [handleOpenUserPrivilegesDialog, user]);
            return (
                <Button
                    color="lightgrey"
                    disabled={user.id === appUser.id}
                    onClick={handleOpenPrivilegesDialog}
                    startIcon={
                        (user.is_admin && <SecurityIcon color="secondary" />) ||
                        (user.is_collection_manager && <CollectionManagerIcon color="secondary" />) ||
                        (<PersonIcon color="primary" />)
                    }
                    sx={{ textTransform: "unset" }}
                >
                    <Typography
                        align="left"
                        variant="body1"
                        width={90}
                    >
                        {user.is_admin ? "Administrator" : user.is_collection_manager ? "Collection Manager" : "Curator"}
                    </Typography>
                </Button>
            );
        },
        UserActivationSwitch ({ onClick }) {
            const user = useTableRowItem();
            const [appUser] = useAppUser();
            const { handleChangeUserActivationStatus } = useManagementCallbacks();
            const handleChangeActivationStatus = useCallback((e) => {
                handleChangeUserActivationStatus(user, e.target.checked);
            }, [handleChangeUserActivationStatus, user]);
            return (
                <Switch
                    checked={user.is_active ? user.has_password : null}
                    color={user.is_admin_or_collection_manager ? "secondary" : "primary"}
                    disabled={user.id === appUser.id || !user.has_password}
                    itemID={user.id}
                    onClick={handleChangeActivationStatus}
                />
            );
        },
        EditButton () {
            const user = useTableRowItem();
            const { handleOpenUserEditDialog } = useManagementCallbacks();
            const handleOpenEditDialog = useCallback(() => {
                handleOpenUserEditDialog(user);
            }, [user, handleOpenUserEditDialog]);
            return (
                <EditButton onClick={handleOpenEditDialog} />
            );
        },
        DeleteButton () {
            const user = useTableRowItem();
            const appUser = useAppUser();
            const { handleOpenUserDeleteDialog } = useManagementCallbacks();
            const handleOpenDeleteDialog = useCallback(() => {
                handleOpenUserDeleteDialog(user);
            }, [user, handleOpenUserDeleteDialog]);
            const disabled = Boolean(user.Courses.length || user.Exhibitions.length || user.id === appUser.id);
            return (
                <DeleteButton
                    onClick={handleOpenDeleteDialog}
                    {... disabled}
                />
            );
        },
        OptionsArray () {
            return (
                <>
                    <User.TableCells.EditButton />

                    <User.TableCells.DeleteButton />
                </>
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

    static tableFields = [
        {
            columnDescription: "ID",
            TableCellComponent: User.TableCells.ID,
            generateSortableValue: (user) => user.id
        },
        {
            columnDescription: "Name",
            maxWidth: "150px",
            TableCellComponent: User.TableCells.Name,
            generateSortableValue: (user) => user.full_name_reverse.toLowerCase()
        },
        {
            columnDescription: "Email",
            TableCellComponent: User.TableCells.EmailWithCopyButton,
            generateSortableValue: (user) => user.email
        },
        {
            columnDescription: "Password",
            TableCellComponent: User.TableCells.PasswordSetOrReset
        },
        {
            columnDescription: "Courses",
            TableCellComponent: User.TableCells.CourseAssignmentButton
        },
        {
            columnDescription: "Exhibitions",
            TableCellComponent: User.TableCells.UserExhibitionCountButton
        },
        {
            columnDescription: "User Type",
            TableCellComponent: User.TableCells.UserTypeButton
        },
        {
            columnDescription: "Active",
            TableCellComponent: User.TableCells.UserActivationSwitch
        },
        {
            columnDescription: "Options",
            TableCellComponent: User.TableCells.OptionsArray
        }
    ];
}

export { User };
