import React, { useEffect, useState } from "react";
import {
    Stack, Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography, DialogContentText, TextField
} from "@mui/material";
import { DeleteIcon } from "../../Imports/Icons.js";
import PropTypes from "prop-types";
import { useSnackbar } from "../../ContextProviders/AppFeatures.js";

export const ItemSingleDeleteDialog = ({ requireTypedConfirmation, allItems, setAllItems, Entity, deleteDialogItem, deleteDialogIsOpen, setDeleteDialogIsOpen }) => {
    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    const [submitEnabled, setSubmitEnabled] = useState(true);
    const showSnackbar = useSnackbar();

    useEffect(() => {
        if (deleteDialogIsOpen) { setSubmitEnabled(true); }
    }, [deleteDialogIsOpen]);

    return (
        <Dialog
            component="form"
            disableEscapeKeyDown
            fullWidth
            maxWidth="sm"
            onClose={(event, reason) => {
                if (reason === "backdropClick") { return; }
                setDeleteDialogIsOpen(false);
            }}
            onSubmit={(e) => {
                e.preventDefault();
                setSubmitEnabled(false);
                if (deleteDialogItem) {
                    Entity.handleDelete(deleteDialogItem.id).then((msg) => {
                        setAllItems(allItems.filter((i) => i.id !== deleteDialogItem.id));
                        showSnackbar(msg, "success");
                        setDeleteDialogIsOpen(false);
                    }).catch((err) => {
                        setSubmitEnabled(true);
                        showSnackbar(err.message, "error");
                    });
                }
                setDeleteConfirmation("");
            }}
            open={deleteDialogIsOpen}
            sx={{ zIndex: 10000 }}
        >
            <DialogTitle
                textAlign="center"
                variant="h4"
            >
                Delete
                {Entity?.singular.substr(0, 1).toUpperCase()}

                {Entity?.singular.substr(1).toLowerCase()}
            </DialogTitle>

            <DialogContent>
                <Stack spacing={2}>
                    <DialogContentText
                        sx={{ wordWrap: "break-word" }}
                        variant="body1"
                    >
                        Are you sure you want to delete the
                        {Entity?.singular}

                        {" "}

                        <i>
                            {deleteDialogItem?.safe_display_name}
                        </i>
                        ?
                    </DialogContentText>

                    {requireTypedConfirmation
                        ? <TextField
                            autoComplete="off" value={deleteConfirmation} onChange={(e) => {
                                setDeleteConfirmation(e.target.value);
                            }} placeholder="Type 'delete' to confirm"
                          />
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
                        onClick={() => {
                            setDeleteDialogIsOpen(false);
                        }}
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
        </Dialog>
    );
};

ItemSingleDeleteDialog.propTypes = {
    Entity: PropTypes.any,
    allItems: PropTypes.arrayOf(PropTypes.object),
    deleteDialogIsOpen: PropTypes.bool,
    deleteDialogItem: PropTypes.object,
    requireTypedConfirmation: PropTypes.bool,
    setAllItems: PropTypes.func,
    setDeleteDialogIsOpen: PropTypes.func
};
