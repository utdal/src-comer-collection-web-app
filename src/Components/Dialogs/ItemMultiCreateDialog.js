import React, { useCallback, useEffect, useReducer, useState } from "react";
import PropTypes from "prop-types";
import {
    Stack, DialogTitle,
    DialogContent,
    DialogActions,
    Button, IconButton, DialogContentText, TextField, Divider
} from "@mui/material";
import { DeleteIcon } from "../../Imports/Icons.js";
import { getBlankItemFields } from "../../Helpers/fields.js";
import { useSnackbar } from "../../ContextProviders/AppFeatures.js";
import { useEntity, useManagementCallbacks } from "../../ContextProviders/ManagementPageProvider.js";
import { PersistentDialog } from "./PersistentDialog.js";
import { DialogStateOld } from "../../Classes/DialogState.js";
import { useActionData, useSubmit } from "react-router-dom";
import DialogCancelButton from "../Buttons/DialogCancelButton.js";

/**
 * @param {{dialogState: DialogState}} props
 * @returns
 */
export const ItemMultiCreateDialog = ({ dialogState }) => {
    const Entity = useEntity();
    const showSnackbar = useSnackbar();

    const { dialogIsOpen } = dialogState;

    const { closeDialogByIntent } = useManagementCallbacks();

    /**
     * @type {RouterActionResponse}
     */
    const actionData = useActionData();

    const submit = useSubmit();
    const [submitEnabled, setSubmitEnabled] = useState(true);

    /**
     * @type {(createDialogItems: Item[], action: MultiCreateDialogDispatchAction) => void}
     */
    const createDialogReducer = useCallback((createDialogItems, action) => {
        switch (action.type) {
        case "add":
            return [...createDialogItems, getBlankItemFields(Entity.fieldDefinitions)];

        case "change":
            return createDialogItems.map((r, i) => {
                if (action.index === i) { return { ...r, [action.field]: action.newValue }; } else { return r; }
            });

        case "remove":
            return createDialogItems.filter((r, i) => {
                return action.index !== i;
            });

        case "filterByIndex":
            return createDialogItems.filter((r, i) => {
                return action.indicesToKeep.includes(i);
            });

        case "set":
            return action.newArray;

        default:
            throw Error("Unknown action type");
        }
    }, [Entity.fieldDefinitions]);

    /**
     * @type {[Item[], (action: MultiCreateDialogDispatchAction) => void]}
     */
    const [createDialogItems, createDialogDispatch] = useReducer(createDialogReducer, []);

    useEffect(() => {
        if (dialogIsOpen) {
            setSubmitEnabled(true);
        }
    }, [dialogIsOpen]);

    const pluralCapitalized = Entity?.plural.substr(0, 1).toUpperCase() + Entity?.plural.substr(1).toLowerCase();

    const handleSubmit = useCallback(() => {
        setSubmitEnabled(false);
        /**
         * @type {RouterActionRequest}
         */
        const request = {
            intent: "multi-create",
            body: {
                itemsToCreate: createDialogItems
            }
        };
        submit(request, {
            method: "POST",
            encType: "application/json"
        });
    }, [createDialogItems, submit]);

    const handleClose = useCallback(() => {
        closeDialogByIntent("multi-create");
    }, [closeDialogByIntent]);

    /**
     * When dialog transitions from open to closed, clear all the input fields
     */
    useEffect(() => {
        if (!dialogState.dialogIsOpen) {
            createDialogDispatch({
                type: "set",
                newArray: []
            });
        }
    }, [dialogState.dialogIsOpen]);

    useEffect(() => {
        if (actionData) {
            console.log(actionData);
            if (actionData.status === "success") {
                handleClose();
                showSnackbar(actionData.snackbarText, "success");
            } else if (actionData.status === "error") {
                setSubmitEnabled(true);
                showSnackbar(actionData.snackbarText, "error");
            } else if (actionData.status === "partial") {
                setSubmitEnabled(true);
                showSnackbar(actionData.snackbarText, "warning");
                createDialogDispatch({
                    type: "filterByIndex",
                    indicesToKeep: actionData.indicesWithErrors
                });
            }
        }
    }, [actionData, handleClose, showSnackbar]);

    return (
        <PersistentDialog
            isForm
            maxWidth="lg"
            onClose={handleClose}
            onSubmit={handleSubmit}
            open={dialogIsOpen}
        >
            <DialogTitle>
                {"Create "}

                {pluralCapitalized}

                <DialogContentText
                    align="center"
                    paddingTop={1}
                    variant="body1"
                >
                    {Entity.multiCreateDialogSubtitle}
                </DialogContentText>
            </DialogTitle>

            <DialogContent>
                <Stack spacing={2}>

                    {createDialogItems.map((u, index) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <React.Fragment key={index}>
                            <Divider />

                            <Stack
                                alignItems="center"
                                direction="row"
                                justifyItems="center"
                                spacing={2}
                            >
                                <DialogContentText variant="body1">
                                    {index + 1}
                                </DialogContentText>

                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    flexWrap="wrap"
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={index}
                                    spacing={{ xs: 1, sm: 2 }}
                                    useFlexGap
                                >
                                    {Entity.fieldDefinitions.map((f, fi) => (
                                        <TextField
                                            InputLabelProps={
                                                (() => {
                                                    if (f.inputType === "datetime-local") {
                                                        return {
                                                            shrink: true
                                                        };
                                                    }
                                                })()
                                            }
                                            autoFocus={fi === 0}
                                            inputProps={{
                                                type: f.inputType ?? "text",
                                                maxLength: f.maxlength ?? 255,
                                                min: f.minValue
                                            }}
                                            key={f.fieldName}
                                            label={f.displayName ?? ""}
                                            minRows={2}
                                            multiline={f.multiline}
                                            name={f.fieldName}
                                            onChange={(e) => {
                                                createDialogDispatch({
                                                    type: "change",
                                                    field: f.fieldName,
                                                    index,
                                                    newValue: e.target.value
                                                });
                                            }}
                                            required={Boolean(f.isRequired)}
                                            sx={{
                                                minWidth: "250px"
                                            }}
                                            value={u[f.fieldName]}
                                        />
                                    ))}
                                </Stack>

                                <IconButton onClick={() => {
                                    createDialogDispatch({
                                        type: "remove",
                                        index
                                    });
                                }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Stack>
                        </React.Fragment>
                    ))}

                    <Divider />
                </Stack>
            </DialogContent>

            <DialogActions>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={1}
                    sx={{ width: "100%" }}
                >
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{ width: "20%" }}
                    >

                        <DialogCancelButton
                            dialogIntent="multi-create"
                            disabled={!submitEnabled}
                            displayText={createDialogItems.length > 0 ? "Cancel" : "Close"}
                        />
                    </Stack>

                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{ width: "50%" }}
                    >
                        <Button
                            color="primary"
                            disabled={!submitEnabled}
                            fullWidth
                            onClick={() => {
                                createDialogDispatch({
                                    type: "add"
                                });
                            }}
                            size="large"
                            variant={createDialogItems.length ? "outlined" : "contained"}
                        >
                            {createDialogItems.length ? `Add another ${Entity.singular}` : `Add ${Entity.singular}`}
                        </Button>

                        <Button
                            color="primary"
                            disabled={!submitEnabled || createDialogItems.length === 0}
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                        >
                            {createDialogItems.length >= 2 ? `Create (${createDialogItems.length})` : "Create"}
                        </Button>
                    </Stack>
                </Stack>
            </DialogActions>
        </PersistentDialog>
    );
};

ItemMultiCreateDialog.propTypes = {
    dialogState: PropTypes.instanceOf(DialogStateOld).isRequired
};
