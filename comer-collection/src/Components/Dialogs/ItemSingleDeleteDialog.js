import React, { useCallback, useEffect, useState } from "react";
import {
    Stack, DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography, DialogContentText, TextField
} from "@mui/material";
import { DeleteIcon } from "../../Imports/Icons.js";
import PropTypes from "prop-types";
import { useSnackbar } from "../../ContextProviders/AppFeatures.js";
import { useEntity, useItems } from "../../ContextProviders/ManagementPageProvider.js";
import { DialogState } from "../../Classes/DialogState.js";
import { PersistentFormDialog } from "./PersistentFormDialog.js";

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

    const [items, setItems] = useItems();
    const Entity = useEntity();

    const { dialogIsOpen, closeDialog, dialogItem } = dialogState;

    useEffect(() => {
        if (dialogIsOpen) { setSubmitEnabled(true); }
    }, [dialogIsOpen]);

    const handleSubmit = useCallback(() => {
        setSubmitEnabled(false);
        if (dialogItem) {
            Entity.handleDelete(dialogItem.id).then((msg) => {
                setItems(items.filter((i) => i.id !== dialogItem.id));
                showSnackbar(msg, "success");
                closeDialog();
            }).catch((err) => {
                setSubmitEnabled(true);
                showSnackbar(err.message, "error");
            });
        }
        setDeleteConfirmation("");
    }, [Entity, closeDialog, dialogItem, items, setItems, showSnackbar]);

    return (
        <PersistentFormDialog
            maxWidth="sm"
            onClose={closeDialog}
            onSubmit={handleSubmit}
            open={dialogIsOpen}
            sx={{ zIndex: 10000 }}
        >
            <DialogTitle
                textAlign="center"
                variant="h4"
            >
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
                        onClick={closeDialog}
                        sx={{ width: "100%" }}
                        variant="outlined"
                    >
                        <Typography variant="body1">
                            Cancel
                        </Typography>
                    </Button>

                    <Button
                        color="error"
                        disabled={!submitEnabled || (requireTypedConfirmation && deleteConfirmation.toLowerCase() !== "delete")}
                        size="large"
                        startIcon={<DeleteIcon />}
                        sx={{ width: "100%" }}
                        type="submit"
                        variant="contained"
                    >
                        <Typography variant="body1">
                            Delete
                        </Typography>

                    </Button>
                </Stack>
            </DialogActions>
        </PersistentFormDialog>
    );
};

ItemSingleDeleteDialog.propTypes = {
    dialogState: PropTypes.instanceOf(DialogState),
    requireTypedConfirmation: PropTypes.bool
};
