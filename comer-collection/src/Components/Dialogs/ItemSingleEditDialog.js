import React, { useMemo, useRef } from "react";
import {
    Stack, Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography, DialogContentText, TextField
} from "@mui/material";
import { SaveIcon } from "../../Imports/Icons.js";
import { getLocalISOString } from "../../Helpers/getLocalISOString.js";
import PropTypes from "prop-types";
import { useSnackbar } from "../../ContextProviders/AppFeatures.js";
import { useAppUser } from "../../ContextProviders/AppUser.js";
import { User } from "../../Classes/Entities/User.js";
import { entityPropTypeShape } from "../../Classes/Entity.js";

export const ItemSingleEditDialog = ({ Entity, editDialogItem, refreshAllItems, editDialogIsOpen, setEditDialogIsOpen }) => {
    const editDialogFieldRefs = useRef([]);

    editDialogFieldRefs.current = [];

    const editDialogEntryFields = useMemo(() => {
        return (
            Entity.fieldDefinitions.map((f) => {
                return (
                    <TextField
                        defaultValue={
                            f.inputType === "datetime-local"
                                ? getLocalISOString(editDialogItem?.[f.fieldName])
                                : editDialogItem?.[f.fieldName]
                        }
                        inputProps={{
                            type: f.inputType,
                            min: f.minValue ?? ""
                        }}
                        inputRef={(element) => editDialogFieldRefs.current.push(element)}
                        key={f.fieldName}
                        label={f.displayName}
                        minRows={2}
                        multiline={f.multiline}
                        name={f.fieldName}
                        required={f.isRequired}
                    />
                );
            })
        );
    }, [editDialogItem, Entity.fieldDefinitions]);

    const singularCapitalized = Entity?.singular.substr(0, 1).toUpperCase() + Entity?.singular.substr(1).toLowerCase();

    const showSnackbar = useSnackbar();
    const [appUser, , initializeAppUser] = useAppUser();

    return (
        <Dialog
            component="form"
            disableEscapeKeyDown
            onClose={(event, reason) => {
                if (reason === "backdropClick") { return; }
                setEditDialogIsOpen(false);
            }}
            onSubmit={(e) => {
                e.preventDefault();
                const editDialogFieldData = {};
                for (const r of editDialogFieldRefs.current) {
                    editDialogFieldData[r.name] = r.value;
                }
                Entity.handleEdit(editDialogItem.id, editDialogFieldData).then((msg) => {
                    // setAllItems(allItems.filter((i) => i.id !== editDialogItem.id));
                    showSnackbar(msg, "success");
                    refreshAllItems();
                    setEditDialogIsOpen(false);
                    if (Entity === User && editDialogItem.id === appUser.id) {
                        initializeAppUser();
                    }
                }).catch((err) => {
                    // setSubmitEnabled(true);
                    showSnackbar(err.message, "error");
                });
            }}
            open={editDialogIsOpen}
            sx={{ zIndex: 10000 }}
        >
            <DialogTitle
                textAlign="center"
                variant="h4"
            >
                Edit
                {singularCapitalized}
            </DialogTitle>

            <DialogContent
                sx={{
                    width: "500px"
                }}
            >
                <Stack spacing={2}>
                    <DialogContentText variant="body1">
                        Edit the
                        {Entity.singular}

                        {" "}

                        fields, then click &lsquo;Save
                        {singularCapitalized}
                        &rsquo;.
                    </DialogContentText>

                    {editDialogEntryFields}
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
                            setEditDialogIsOpen(false);
                            editDialogFieldRefs.current = [];
                        }}
                        sx={{ width: "100%" }}
                        variant="outlined"
                    >
                        <Typography variant="body1">
                            Cancel
                        </Typography>
                    </Button>

                    <Button
                        color="primary"
                        size="large"
                        startIcon={<SaveIcon />}
                        sx={{ width: "100%" }}
                        type="submit"
                        variant="contained"
                    >
                        <Typography variant="body1">
                            Save
                            {Entity.singular}
                        </Typography>
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
};

ItemSingleEditDialog.propTypes = {
    Entity: PropTypes.node.isRequired,
    editDialogIsOpen: PropTypes.bool.isRequired,
    editDialogItem: PropTypes.shape(entityPropTypeShape).isRequired,
    refreshAllItems: PropTypes.func.isRequired,
    setEditDialogIsOpen: PropTypes.func.isRequired
};
