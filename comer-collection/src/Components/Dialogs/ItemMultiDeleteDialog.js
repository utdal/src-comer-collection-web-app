import React, { useState } from "react";
import {
    Stack, Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography, DialogContentText, TextField
} from "@mui/material";
import { DeleteIcon } from "../../../IconImports.js";
import PropTypes from "prop-types";

export const ItemMultiDeleteDialog = ({ entityPlural, deleteDialogItems, deleteDialogIsOpen, setDeleteDialogIsOpen, handleDelete }) => {
    const [confirmText, setConfirmText] = useState("");

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
                handleDelete(deleteDialogItems.map((i) => i.id));
            }}
            open={deleteDialogIsOpen}
            sx={{ zIndex: 10000 }}
        >
            <DialogTitle
                textAlign="center"
                variant="h4"
            >
                Delete
                {deleteDialogItems?.length}

                {" "}

                {entityPlural[0].toUpperCase()}

                {entityPlural.substring(1)}
            </DialogTitle>

            <DialogContent>
                <Stack
                    direction="column"
                    spacing={2}
                >
                    <DialogContentText variant="body1">
                        Are you sure you want to delete
                        {deleteDialogItems?.length}

                        {" "}

                        {entityPlural}
                        ?
                    </DialogContentText>

                    <TextField
                        autoComplete="off"
                        onChange={(e) => {
                            setConfirmText(e.target.value);
                        }}
                        placeholder="Type 'delete' to confirm"
                        value={confirmText ?? ""}
                    />
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
                        onClick={() => {
                            setDeleteDialogIsOpen(false);
                            setConfirmText("");
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
                        disabled={confirmText?.toLowerCase() !== "delete"}
                        size="large"
                        startIcon={<DeleteIcon />}
                        sx={{ width: "100%" }}
                        type="submit"
                        variant="contained"
                    >
                        <Typography variant="body1">
                            Delete (
                            {deleteDialogItems.length}
                            )
                        </Typography>
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
};

ItemMultiDeleteDialog.propTypes = {
    deleteDialogIsOpen: PropTypes.bool.isRequired,
    deleteDialogItems: PropTypes.arrayOf(),
    entityPlural: PropTypes.string,
    handleDelete: PropTypes.func,
    setDeleteDialogIsOpen: PropTypes.func
};
