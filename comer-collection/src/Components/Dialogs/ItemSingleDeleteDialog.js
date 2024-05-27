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
import { useActionData, useSubmit } from "react-router-dom";

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

    const actionData = useActionData();

    const Entity = useEntity();

    const submit = useSubmit();

    const { dialogIsOpen, closeDialog, dialogItem } = dialogState;

    useEffect(() => {
        if (dialogIsOpen) { setSubmitEnabled(true); }
    }, [dialogIsOpen]);

    const newHandleSubmit = useCallback(() => {
        submit({
            id: dialogItem?.id
        }, {
            method: "DELETE",
            encType: "application/json"
        });
    }, [dialogItem?.id, submit]);

    useEffect(() => {
        if (actionData) {
            if (actionData.status === "success") {
                showSnackbar(actionData.message, "success");
                closeDialog();
            } else if (actionData.status === "error") {
                setSubmitEnabled(true);
                showSnackbar(actionData.error, "error");
            }
        }
    }, [actionData, closeDialog, showSnackbar]);

    return (
        <PersistentDialog
            isForm
            maxWidth="sm"
            onClose={closeDialog}
            onSubmit={newHandleSubmit}
            open={dialogIsOpen}
        >
            <DialogTitle>
                {"Delete "}

                {Entity?.singular.substr(0, 1).toUpperCase()}

                {Entity?.singular.substr(1).toLowerCase()}
            </DialogTitle>

            <DialogContent>
                <Stack spacing={2}>
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

                        {
                            /* */
                        }
                        ?
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
                </Stack>
            </DialogActions>
        </PersistentDialog>
    );
};

ItemSingleDeleteDialog.propTypes = {
    dialogState: PropTypes.instanceOf(DialogState),
    requireTypedConfirmation: PropTypes.bool
};
