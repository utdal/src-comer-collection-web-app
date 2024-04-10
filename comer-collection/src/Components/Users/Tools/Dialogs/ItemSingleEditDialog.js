import React, { useMemo, useRef } from "react";
import {
    Stack, Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography, DialogContentText, TextField
} from "@mui/material";
import { SaveIcon } from "../../../../Imports/IconImports.js";
import { getLocalISOString } from "../HelperMethods/getLocalISOString.js";
import PropTypes from "prop-types";
import { useSnackbar } from "../../../../ContextProviders/AppFeatures.js";
import { useAppUser } from "../../../../ContextProviders/AppUser.js";
import { User } from "../../../../Classes/Entities/User.js";

export const ItemSingleEditDialog = ({ Entity, editDialogItem, editDialogFieldDefinitions, refreshAllItems, editDialogIsOpen, setEditDialogIsOpen }) => {


    const editDialogFieldRefs = useRef([]);

    editDialogFieldRefs.current = [];

    const editDialogEntryFields = useMemo(() => {
        return (
            editDialogFieldDefinitions.map((f) => {
                return (
                    <TextField multiline={f.multiline}
                        minRows={2}
                        key={f.fieldName} 
                        name={f.fieldName} 
                        label={f.displayName} 
                        required={f.isRequired}
                        inputRef={(element) => editDialogFieldRefs.current.push(element)}
                        defaultValue={
                            f.inputType == "datetime-local" ?
                                getLocalISOString(editDialogItem?.[f.fieldName]) :
                                editDialogItem?.[f.fieldName]
                        }
                        inputProps={{
                            type: f.inputType,
                            min: f.minValue ?? ""
                        }}
                    >
                    </TextField>
                );
            })
        );
    }, [editDialogFieldDefinitions, editDialogItem]);


    const singularCapitalized = Entity?.singular.substr(0, 1).toUpperCase() + Entity?.singular.substr(1).toLowerCase();

    const showSnackbar = useSnackbar();
    const [appUser, , initializeAppUser] = useAppUser();
    
  
    return (
        <Dialog component="form" sx={{zIndex: 10000}}
            open={editDialogIsOpen} disableEscapeKeyDown
            onClose={(event, reason) => {
                if (reason == "backdropClick")
                    return;
                setEditDialogIsOpen(false);
            }}
            onSubmit={(e) => {
                e.preventDefault();
                const editDialogFieldData = {};
                for(const r of editDialogFieldRefs.current) {
                    editDialogFieldData[r.name] = r.value;
                }
                Entity.handleEdit(editDialogItem.id, editDialogFieldData).then((msg) => {
                    // setAllItems(allItems.filter((i) => i.id !== editDialogItem.id));
                    showSnackbar(msg, "success");
                    refreshAllItems();
                    setEditDialogIsOpen(false);
                    if(Entity === User && editDialogItem.id == appUser.id) {
                        initializeAppUser();
                    }
                }).catch((err) => {
                    // setSubmitEnabled(true);
                    showSnackbar(err, "error");
                });
            }}
        >
            <DialogTitle variant="h4" textAlign="center">Edit {singularCapitalized}</DialogTitle>
            <DialogContent
                sx={{
                    width: "500px",
                }}>
                <Stack spacing={2}>
                    <DialogContentText variant="body1">Edit the {Entity.singular} fields, then click &lsquo;Save {singularCapitalized}&rsquo;.</DialogContentText>
                    {editDialogEntryFields}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Stack direction="row" justifyContent="space-between" spacing={1} sx={{ width: "100%" }}>
                    <Button color="primary" variant="outlined" sx={{ width: "100%" }} onClick={() => {
                        setEditDialogIsOpen(false);
                        editDialogFieldRefs.current = [];
                    }}>
                        <Typography variant="body1">Cancel</Typography>
                    </Button>
                    <Button color="primary" variant="contained" size="large" startIcon={<SaveIcon />} sx={{ width: "100%" }}
                        type="submit">
                        <Typography variant="body1">Save {Entity.singular}</Typography>
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
};

ItemSingleEditDialog.propTypes = {
    Entity: PropTypes.any,
    editDialogItem: PropTypes.object,
    editDialogFieldDefinitions: PropTypes.arrayOf(PropTypes.object),
    editDialogIsOpen: PropTypes.bool,
    setEditDialogIsOpen: PropTypes.func,
    refreshAllItems: PropTypes.func.isRequired
};