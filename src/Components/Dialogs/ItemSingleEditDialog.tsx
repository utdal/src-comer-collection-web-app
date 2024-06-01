import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Stack, DialogTitle,
    DialogContent,
    DialogActions,
    Button, DialogContentText
} from "@mui/material";
import { SaveIcon } from "../../Imports/Icons";
import getLocalISOString from "../../Helpers/getLocalISOString";
import { useSnackbar } from "../../ContextProviders/AppFeatures";
import { useEntity, useManagementCallbacks } from "../../ContextProviders/ManagementPageProvider";
import DialogInputFieldWithRef from "../Inputs/DialogInputFieldWithRef";
import PersistentDialog from "./PersistentDialog";
import { useActionData, useSubmit } from "react-router-dom";
import DialogCancelButton from "../Buttons/DialogCancelButton";
import type { DialogState, DialogStateSingleUnderlyingItem, ItemGenericFieldValue, RouterActionRequest, RouterActionResponse } from "../../index";

const ItemSingleEditDialog = ({ dialogState }: {
    readonly dialogState: DialogState;
}): React.JSX.Element => {
    const showSnackbar = useSnackbar();
    const Entity = useEntity();

    const [submitEnabled, setSubmitEnabled] = useState(true);

    const { dialogIsOpen, underlyingItem: dialogItem } = dialogState as DialogStateSingleUnderlyingItem;

    const { closeDialogByIntent } = useManagementCallbacks();
    const handleClose = useCallback(() => {
        closeDialogByIntent("single-edit");
    }, [closeDialogByIntent]);

    const editDialogFieldRefs = useRef([] as HTMLInputElement[]);

    const submit = useSubmit();

    const actionData = useActionData() as RouterActionResponse | null;

    useEffect(() => {
        if (actionData) {
            if (actionData.status === "success") {
                showSnackbar(actionData.snackbarText, "success");
                handleClose();
            } else if (actionData.status === "error") {
                setSubmitEnabled(true);
                showSnackbar(actionData.snackbarText, "error");
            }
        }
    }, [actionData, handleClose, showSnackbar]);

    useEffect(() => {
        if (dialogIsOpen) {
            editDialogFieldRefs.current = [];
        }
    }, [dialogIsOpen]);

    useEffect(() => {
        if (!dialogIsOpen) {
            editDialogFieldRefs.current = [];
        }
    }, [dialogIsOpen]);

    const handleSubmit = useCallback(() => {
        if (dialogItem) {
            const editDialogFieldData = {} as Record<string, ItemGenericFieldValue>;
            for (const r of editDialogFieldRefs.current) {
                editDialogFieldData[r.name] = r.value;
            }

            const request: RouterActionRequest = {
                intent: "single-edit",
                body: editDialogFieldData,
                itemId: dialogItem.id
            };
            const requestAsString = JSON.stringify(request);
            submit(requestAsString, {
                encType: "application/json",
                method: "PUT"
            });
        }
    }, [dialogItem, submit]);

    const singularCapitalized = Entity.singular.substring(0, 1).toUpperCase() + Entity.singular.substr(1).toLowerCase();

    return (
        <PersistentDialog
            onClose={handleClose}
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
                                    ? getLocalISOString(dialogItem?.[f.fieldName] as string)
                                    : dialogItem?.[f.fieldName]
                            }
                            fieldDefinition={f}
                            inputRef={(element: HTMLInputElement): number => editDialogFieldRefs.current.push(element)}
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
                    <DialogCancelButton dialogIntent="single-edit" />

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

export default ItemSingleEditDialog;
