import React, { useCallback, useEffect, useState } from "react";
import {
    Stack, DialogTitle,
    DialogContent,
    DialogActions,
    Button, DialogContentText, TextField
} from "@mui/material";
import { DeleteIcon } from "../../Imports/Icons.js";
import PropTypes from "prop-types";
import { useSnackbar } from "../../ContextProviders/AppFeatures.js";
import { useEntity } from "../../ContextProviders/ManagementPageProvider.js";
import { DialogState } from "../../Classes/DialogState.js";
import { PersistentDialog } from "./PersistentDialog.js";
import { useActionData, useFetcher, useSubmit } from "react-router-dom";

/**
 * @param {{
 *  dialogState: DialogState
 * }} param0
 * @returns
 */
export const ItemSingleDeleteDialog = ({ requireTypedConfirmation, dialogState }) => {
    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    const [submitEnabled, setSubmitEnabled] = useState(true);
    const showSnackbar = useSnackbar();

    const Entity = useEntity();

    const submit = useSubmit();
    const fetcher = useFetcher();

    /**
     * @type {import("../../Classes/buildRouterAction.js").RouterActionResponse}
     */
    const actionData = useActionData();

    // /**
    //  * @type {import("../../Classes/buildRouterAction.js").RouterActionResponse}
    //  */
    // const fetcherActionData = fetcher.data;

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
            intent: "single-delete",
            itemId: dialogItem?.id
        };
        if (Entity.fetcherUrl) {
            fetcher.submit(request, {
                method: "DELETE",
                encType: "application/json",
                action: Entity.fetcherUrl
            });
        } else {
            submit(request, {
                method: "DELETE",
                encType: "application/json"
            });
        }
    }, [Entity.fetcherUrl, dialogItem?.id, fetcher, submit]);

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

    useEffect(() => {
        if (fetcher.data) {
            if (fetcher.data.status === "success") {
                showSnackbar(fetcher.data.snackbarText, "success");
                closeDialog();
            } else if (fetcher.data.status === "error") {
                setSubmitEnabled(true);
                showSnackbar(fetcher.data.snackbarText, "error");
            }
        }
    }, [fetcher.data, closeDialog, showSnackbar]);

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
                : (
                    <DialogTitle>
                        {"Delete "}

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

                    <DialogContentText>
                        {Entity?.deleteDialogAdditionalInstructions}
                    </DialogContentText>

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

                    {Entity.hasTrash
                        ? (
                            <Button
                                color="primary"
                                disabled={!submitEnabled || (requireTypedConfirmation && deleteConfirmation.toLowerCase() !== "delete")}
                                fullWidth
                                size="large"
                                startIcon={<DeleteIcon />}
                                type="submit"
                                variant="contained"
                            >
                                Trash

                            </Button>
                        )
                        : (
                            <Button
                                color="error"
                                disabled={!submitEnabled || (requireTypedConfirmation && deleteConfirmation.toLowerCase() !== "delete")}
                                fullWidth
                                size="large"
                                startIcon={<DeleteIcon />}
                                type="submit"
                                variant="contained"
                            >
                                Delete

                            </Button>
                        )}
                </Stack>
            </DialogActions>
        </PersistentDialog>
    );
};

ItemSingleDeleteDialog.propTypes = {
    dialogState: PropTypes.instanceOf(DialogState),
    requireTypedConfirmation: PropTypes.bool
};
