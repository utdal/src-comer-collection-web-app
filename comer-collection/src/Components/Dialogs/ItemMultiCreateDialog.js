import React, { useCallback, useEffect, useReducer, useState } from "react";
import PropTypes from "prop-types";
import {
    Stack, DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography, IconButton, DialogContentText, TextField, Divider
} from "@mui/material";
import { DeleteIcon } from "../../Imports/Icons.js";
import { getBlankItemFields } from "../../Helpers/fields.js";
import { useSnackbar } from "../../ContextProviders/AppFeatures.js";
import { useEntity, useManagementCallbacks } from "../../ContextProviders/ManagementPageProvider.js";
import { PersistentDialog } from "./PersistentDialog.js";
import { DialogState } from "../../Classes/DialogState.js";

export const ItemMultiCreateDialog = ({ dialogState }) => {
    const { handleRefresh } = useManagementCallbacks();
    const Entity = useEntity();
    const showSnackbar = useSnackbar();

    const { dialogIsOpen, closeDialog } = dialogState;

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

        case "set":
            return action.newArray;

        default:
            throw Error("Unknown action type");
        }
    }, [Entity.fieldDefinitions]);

    const [createDialogItems, createDialogDispatch] = useReducer(createDialogReducer, []);
    const [submitEnabled, setSubmitEnabled] = useState(true);

    useEffect(() => {
        if (dialogIsOpen) {
            setSubmitEnabled(true);
        }
    }, [dialogIsOpen]);

    const pluralCapitalized = Entity?.plural.substr(0, 1).toUpperCase() + Entity?.plural.substr(1).toLowerCase();

    const handleSubmit = useCallback(() => {
        setSubmitEnabled(false);
        Entity.handleMultiCreate(createDialogItems).then((itemPromises) => {
            const itemsWithErrors = createDialogItems.filter((u, i) => {
                return itemPromises[i].status !== "fulfilled";
            });
            createDialogDispatch({
                type: "set",
                newArray: itemsWithErrors
            });
            if (itemsWithErrors.length > 0) {
                setSubmitEnabled(true);
                if (itemsWithErrors.length === createDialogItems.length) {
                    showSnackbar(`Could not create ${createDialogItems.length === 1 ? Entity.singular : Entity.plural}`, "error");
                } else if (itemsWithErrors.length < createDialogItems.length) {
                    handleRefresh();
                    showSnackbar(`${createDialogItems.length - itemsWithErrors.length} of ${createDialogItems.length} ${Entity.plural} created`, "warning");
                }
            } else {
                handleRefresh();
                closeDialog();
                showSnackbar(`${createDialogItems.length} ${createDialogItems.length === 1 ? Entity.singular : Entity.plural} created`, "success");
            }
        });
    }, [Entity, closeDialog, createDialogItems, handleRefresh, showSnackbar]);

    return (
        <PersistentDialog
            isForm
            maxWidth="lg"
            onClose={closeDialog}
            onSubmit={handleSubmit}
            open={dialogIsOpen}
        >
            <DialogTitle
                textAlign="center"
                variant="h4"
            >
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
                    <Button
                        color="primary"
                        disabled={!submitEnabled}
                        onClick={() => {
                            closeDialog();
                            createDialogDispatch({
                                type: "set",
                                newArray: []
                            });
                        }}
                        size="large"
                        variant="outlined"
                    >
                        <Typography variant="body1">
                            {createDialogItems.length > 0 ? "Cancel" : "Close"}
                        </Typography>
                    </Button>

                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{ width: "50%" }}
                    >
                        <Button
                            color="primary"
                            disabled={!submitEnabled}
                            onClick={() => {
                                createDialogDispatch({
                                    type: "add"
                                });
                            }}
                            size="large"
                            sx={{ width: "100%" }}
                            variant={createDialogItems.length ? "outlined" : "contained"}
                        >
                            <Typography variant="body1">
                                {createDialogItems.length ? `Add another ${Entity.singular}` : `Add ${Entity.singular}`}
                            </Typography>
                        </Button>

                        <Button
                            color="primary"
                            disabled={!submitEnabled || createDialogItems.length === 0}
                            size="large"
                            sx={{ width: "100%" }}
                            type="submit"
                            variant="contained"
                        >
                            <Typography variant="body1">
                                {createDialogItems.length >= 2 ? `Create (${createDialogItems.length})` : "Create"}
                            </Typography>
                        </Button>
                    </Stack>
                </Stack>
            </DialogActions>
        </PersistentDialog>
    );
};

ItemMultiCreateDialog.propTypes = {
    dialogState: PropTypes.instanceOf(DialogState).isRequired
};
