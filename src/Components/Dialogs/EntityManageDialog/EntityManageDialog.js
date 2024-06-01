import React, { useCallback, useEffect, useMemo } from "react";
import {
    Stack, DialogTitle,
    DialogContent,
    DialogActions,
    Button, Divider
} from "@mui/material";
import { ItemSingleDeleteDialog } from "../ItemSingleDeleteDialog.js";
import { ItemSingleEditDialog } from "../ItemSingleEditDialog.js";
import PropTypes from "prop-types";
import { ManagementPageProvider, useItemsReducer } from "../../../ContextProviders/ManagementPageProvider";
import { useDialogState } from "../../../Hooks/useDialogState.js";
import { PersistentDialog } from "../PersistentDialog.js";
import { SelectionSummary } from "../../SelectionSummary.js";
import { useLoaderData, useNavigate } from "react-router-dom";
import EntityManageUpdateSection from "./EntityManageUpdateSection.js";
import EntityManageCreateSection from "./EntityManageCreateSection.js";
import { DeleteIcon } from "../../../Imports/Icons.js";
import { Entity } from "../../../Classes/Entity.ts";

/**
 * @returns {React.JSX.Element}
 */
export const EntityManageDialog = ({ Entity }) => {
    const dialogItems = useLoaderData();

    const [dialogItemsCombinedState, itemsCallbacks] = useItemsReducer([]);

    const { setItems: setDialogItems } = itemsCallbacks;

    useEffect(() => {
        setDialogItems(dialogItems);
    }, [dialogItems, setDialogItems]);

    const navigate = useNavigate();

    const handleClose = useCallback(() => {
        navigate("..");
    }, [navigate]);

    const [editDialogState, openEditDialog] = useDialogState(false);
    const [deleteDialogState, openDeleteDialog] = useDialogState(false);
    const [restoreDialogState, openRestoreDialog] = useDialogState(false);

    const pluralCapitalized = Entity?.plural.substr(0, 1).toUpperCase() + Entity?.plural.substr(1).toLowerCase();

    const handleOpenEntityEditDialog = useCallback((item) => {
        openEditDialog(item);
    }, [openEditDialog]);

    const handleOpenEntityDeleteDialog = useCallback((item) => {
        openDeleteDialog(item);
    }, [openDeleteDialog]);

    const handleOpenEntityRestoreDialog = useCallback((item) => {
        openRestoreDialog(item);
    }, [openRestoreDialog]);

    const managementCallbacks = useMemo(() => ({
        handleOpenEntityEditDialog,
        handleOpenEntityDeleteDialog,
        handleOpenEntityRestoreDialog
    }), [handleOpenEntityDeleteDialog, handleOpenEntityEditDialog, handleOpenEntityRestoreDialog]);

    const isTrashMode = Entity.isTrash;

    return (
        <ManagementPageProvider
            Entity={Entity}
            itemsCallbacks={itemsCallbacks}
            itemsCombinedState={dialogItemsCombinedState}
            managementCallbacks={managementCallbacks}
        >
            <PersistentDialog
                maxWidth="lg"
                open
            >
                {Entity.isTrash
                    ? (
                        <DialogTitle
                            alignItems="center"
                            component={Stack}
                            direction="row"
                            justifyContent="center"
                        >
                            <DeleteIcon
                                color="disabled"
                                fontSize="large"
                                sx={{
                                    marginRight: 1
                                }}
                            />

                            {pluralCapitalized}

                            {" in Trash"}

                        </DialogTitle>
                    )
                    : (
                        <DialogTitle>
                            {"Manage "}

                            {pluralCapitalized}
                        </DialogTitle>
                    )}

                <DialogContent sx={{ overflow: "hidden" }}>
                    <Stack
                        spacing={2}
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr",
                            gridTemplateRows: "auto auto",
                            gridTemplateAreas: `
                                "update"
                                "create"
                            `
                        }}
                    >
                        <EntityManageUpdateSection dialogItemsCombinedState={dialogItemsCombinedState} />

                        <Divider />

                        {!isTrashMode ? <EntityManageCreateSection /> : null}

                    </Stack>

                </DialogContent>

                <DialogActions>
                    <Stack
                        direction="row-reverse"
                        justifyContent="space-between"
                        padding={1}
                        spacing={2}
                        width="100%"
                    >

                        <Button
                            color="primary"
                            onClick={handleClose}
                            size="large"
                            sx={{
                                width: "30%"
                            }}
                            variant="contained"
                        >
                            Close
                        </Button>

                        <SelectionSummary />
                    </Stack>
                </DialogActions>
            </PersistentDialog>

            <ItemSingleEditDialog dialogState={editDialogState} />

            <ItemSingleDeleteDialog dialogState={deleteDialogState} />

            <ItemSingleDeleteDialog
                dialogState={restoreDialogState}
                restoreMode
            />

        </ManagementPageProvider>
    );
};

EntityManageDialog.propTypes = {
    Entity: PropTypes.instanceOf(typeof Entity)
};
