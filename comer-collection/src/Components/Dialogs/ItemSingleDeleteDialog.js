import React, { useCallback, useEffect, useState } from "react";
import {
    Stack, DialogTitle,
    DialogContent,
    DialogActions,
    Button, DialogContentText, TextField
} from "@mui/material";
import { DeleteIcon, RestoreIcon } from "../../Imports/Icons.js";
import PropTypes from "prop-types";
import { useSnackbar } from "../../ContextProviders/AppFeatures.js";
import { useEntity } from "../../ContextProviders/ManagementPageProvider.js";
import { DialogStateOld } from "../../Classes/DialogState.js";
import { PersistentDialog } from "./PersistentDialog.js";
import { useActionData, useSubmit } from "react-router-dom";
import { capitalized } from "../../Classes/Entity.js";

/**
 * @param {{
 *  dialogState: DialogStateOld
 * }} param0
 * @returns
 */
export const ItemSingleDeleteDialog = ({ requireTypedConfirmation, dialogState, restoreMode = false }) => {
    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    const [submitEnabled, setSubmitEnabled] = useState(true);
    const showSnackbar = useSnackbar();

    const Entity = useEntity();

    const submit = useSubmit();

    /**
     * @type {import("../../Classes/buildRouterAction.js").RouterActionResponse}
     */
    const actionData = useActionData();

    const { dialogIsOpen, closeDialog, dialogItem } = dialogState;

    useEffect(() => {
        if (dialogIsOpen) {
            setSubmitEnabled(true);
        }
    }, [dialogIsOpen]);

    const handleSubmit = useCallback(() => {
        /**
         * @type {import("../../Classes/buildRouterAction.js").RouterActionRequest}
         */
        const request = {
            intent: Entity.isTrash
                ? (
                    restoreMode ? "single-restore" : "single-permanent-delete"
                )
                : "single-delete",
            itemId: dialogItem?.id
        };
        submit(request, {
            method: restoreMode ? "PUT" : "DELETE",
            encType: "application/json"
        });
    }, [Entity.isTrash, dialogItem?.id, restoreMode, submit]);

    useEffect(() => {
        if (actionData) {
            if (actionData.status === "success") {
                showSnackbar(actionData.snackbarText, "success");
                closeDialog();
            } else if (actionData.status === "error") {
                setSubmitEnabled(true);
                showSnackbar(actionData.snackbarText, "error");
            }
        }
    }, [actionData, closeDialog, showSnackbar]);

    return (
        <PersistentDialog
            isForm
            maxWidth="sm"
            onClose={closeDialog}
            onSubmit={handleSubmit}
            open={dialogIsOpen}
        >
            {Entity.hasTrash
                ? (
                    <DialogTitle>
                        {"Move "}

                        {Entity?.singular.substr(0, 1).toUpperCase()}

                        {Entity?.singular.substr(1).toLowerCase()}

                        {" to Trash "}
                    </DialogTitle>
                )
                : restoreMode
                    ? (
                        <DialogTitle>
                            {`Restore ${capitalized(Entity?.singular)} from Trash`}
                        </DialogTitle>
                    )
                    : (
                        <DialogTitle>
                            {Entity.isTrash ? "Permanently Delete " : "Delete "}

                            {Entity?.singular.substr(0, 1).toUpperCase()}

                            {Entity?.singular.substr(1).toLowerCase()}
                        </DialogTitle>
                    )}

            <DialogContent>
                <Stack spacing={2}>
                    {Entity.hasTrash
                        ? (
                            <DialogContentText
                                sx={{ wordWrap: "break-word" }}
                                variant="body1"
                            >
                                {"Are you sure you want to move the "}

                                {Entity?.singular}

                                {" "}

                                <i>
                                    {dialogItem?.safe_display_name}
                                </i>

                                {" to the trash? "}
                            </DialogContentText>
                        )
                        : Entity.isTrash
                            ? restoreMode
                                ? (
                                    <DialogContentText
                                        sx={{ wordWrap: "break-word" }}
                                        variant="body1"
                                    >
                                        {"Are you sure you want to restore the "}

                                        {Entity?.singular}

                                        {" "}

                                        <i>
                                            {dialogItem?.safe_display_name}
                                        </i>

                                        {" from the trash? "}
                                    </DialogContentText>
                                )
                                : (
                                    <DialogContentText
                                        sx={{ wordWrap: "break-word" }}
                                        variant="body1"
                                    >
                                        {"Are you sure you want to delete the "}

                                        {Entity?.singular}

                                        {" "}

                                        <i>
                                            {dialogItem?.safe_display_name}
                                        </i>

                                        <b>
                                            {" permanently"}
                                        </b>

                                        {"? "}
                                    </DialogContentText>
                                )
                            : (
                                <DialogContentText
                                    sx={{ wordWrap: "break-word" }}
                                    variant="body1"
                                >
                                    {"Are you sure you want to delete the "}

                                    {Entity?.singular}

                                    {" "}

                                    <i>
                                        {dialogItem?.safe_display_name}
                                    </i>

                                    {"? "}
                                </DialogContentText>
                            )}

                    {Entity?.deleteDialogAdditionalInstructions
                        ? (
                            <DialogContentText>
                                {Entity?.deleteDialogAdditionalInstructions}
                            </DialogContentText>
                        )
                        : null}

                    {requireTypedConfirmation
                        ? (
                            <TextField
                                autoComplete="off"
                                onChange={(e) => {
                                    setDeleteConfirmation(e.target.value);
                                }}
                                placeholder="Type 'delete' to confirm"
                                value={deleteConfirmation}
                            />
                        )
                        : null}

                </Stack>
            </DialogContent>

            <DialogActions>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={1}
                    sx={{ width: "100%" }}
                >
                    <Button
                        color="primary"
                        disabled={!submitEnabled}
                        fullWidth
                        onClick={closeDialog}
                        variant="outlined"
                    >
                        Cancel
                    </Button>

                    <Button
                        color={Entity.hasTrash || restoreMode ? "primary" : "error"}
                        disabled={!submitEnabled || (requireTypedConfirmation && deleteConfirmation.toLowerCase() !== "delete")}
                        fullWidth
                        size="large"
                        startIcon={restoreMode ? <RestoreIcon /> : <DeleteIcon />}
                        type="submit"
                        variant="contained"
                    >
                        {restoreMode ? "Restore" : Entity.hasTrash ? "Move to Trash" : "Delete"}

                    </Button>

                </Stack>
            </DialogActions>
        </PersistentDialog>
    );
};

ItemSingleDeleteDialog.propTypes = {
    dialogState: PropTypes.instanceOf(DialogStateOld),
    requireTypedConfirmation: PropTypes.bool,
    restoreMode: PropTypes.bool
};
