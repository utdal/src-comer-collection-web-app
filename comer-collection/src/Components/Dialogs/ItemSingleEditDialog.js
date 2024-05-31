import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Stack, DialogTitle,
    DialogContent,
    DialogActions,
    Button, DialogContentText
} from "@mui/material";
import { SaveIcon } from "../../Imports/Icons.js";
import { getLocalISOString } from "../../Helpers/getLocalISOString.js";
import { useSnackbar } from "../../ContextProviders/AppFeatures.js";
import { useEntity } from "../../ContextProviders/ManagementPageProvider.js";
import { DialogInputFieldWithRef } from "../Inputs/DialogInputFieldWithRef.js";
import { PersistentDialog } from "./PersistentDialog.js";
import PropTypes from "prop-types";
import { DialogStateOld } from "../../Classes/DialogState.js";
import { useActionData, useSubmit } from "react-router-dom";

/**
 * @param {{ dialogState: DialogStateOld }} props
 */
export const ItemSingleEditDialog = ({ dialogState }) => {
    const showSnackbar = useSnackbar();
    const Entity = useEntity();

    const [submitEnabled, setSubmitEnabled] = useState(true);

    const { dialogItem, dialogIsOpen, closeDialog } = dialogState;

    const editDialogFieldRefs = useRef([]);

    const submit = useSubmit();

    /**
     * @type {import("../../Classes/buildRouterAction.js").RouterActionResponse}
     */
    const actionData = useActionData();

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
        if (dialogIsOpen || !dialogIsOpen) {
            editDialogFieldRefs.current = [];
        }
    }, [dialogIsOpen]);

    const handleSubmit = useCallback(() => {
        const editDialogFieldData = {};
        for (const r of editDialogFieldRefs.current) {
            editDialogFieldData[r.name] = r.value;
        }
        /**
         * @type {import("../../Classes/buildRouterAction.js").RouterActionRequest}
         */
        const request = {
            intent: "single-edit",
            body: editDialogFieldData,
            itemId: dialogItem?.id
        };
        submit(request, {
            encType: "application/json",
            method: "PUT"
        });
    }, [dialogItem, submit]);

    const singularCapitalized = Entity?.singular.substr(0, 1).toUpperCase() + Entity?.singular.substr(1).toLowerCase();

    return (
        <PersistentDialog
            isForm
            onClose={closeDialog}
            onSubmit={handleSubmit}
            open={dialogIsOpen}
        >
            <DialogTitle>
                {"Edit "}

                {singularCapitalized}
            </DialogTitle>

            <DialogContent
                sx={{
                    width: "500px"
                }}
            >
                <Stack spacing={2}>
                    <DialogContentText variant="body1">
                        {"Edit the "}

                        {Entity.singular}

                        {" fields, then click "}

                        &lsquo;

                        {"Save "}

                        {singularCapitalized}

                        &rsquo;.
                    </DialogContentText>

                    {Entity.fieldDefinitions.map((f) => (
                        <DialogInputFieldWithRef
                            defaultValue={
                                f.inputType === "datetime-local"
                                    ? getLocalISOString(dialogItem?.[f.fieldName])
                                    : dialogItem?.[f.fieldName]
                            }
                            fieldDefinition={f}
                            inputRef={(element) => editDialogFieldRefs.current.push(element)}
                            key={f.fieldName}
                        />
                    ))}
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
                        fullWidth
                        onClick={() => {
                            closeDialog();
                            editDialogFieldRefs.current = [];
                        }}
                        variant="outlined"
                    >
                        Cancel
                    </Button>

                    <Button
                        color="primary"
                        disabled={!submitEnabled}
                        fullWidth
                        size="large"
                        startIcon={<SaveIcon />}
                        type="submit"
                        variant="contained"
                    >
                        {"Save "}

                        {Entity.singular}
                    </Button>
                </Stack>
            </DialogActions>
        </PersistentDialog>
    );
};

ItemSingleEditDialog.propTypes = {
    dialogState: PropTypes.instanceOf(DialogStateOld).isRequired
};
