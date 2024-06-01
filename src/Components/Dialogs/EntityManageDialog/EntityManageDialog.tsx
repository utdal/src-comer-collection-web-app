import React, { useCallback, useEffect, useMemo } from "react";
import {
    Stack, DialogTitle,
    DialogContent,
    DialogActions,
    Button, Divider
} from "@mui/material";
import ItemSingleDeleteDialog from "../ItemSingleDeleteDialog.js";
import ItemSingleEditDialog from "../ItemSingleEditDialog.js";
import { ManagementPageProvider, useItemsReducer } from "../../../ContextProviders/ManagementPageProvider.js";
import PersistentDialog from "../PersistentDialog.js";
import SelectionSummary from "../../SelectionSummary.js";
import { useLoaderData, useNavigate } from "react-router-dom";
import EntityManageUpdateSection from "./EntityManageUpdateSection.js";
import EntityManageCreateSection from "./EntityManageCreateSection.js";
import { DeleteIcon } from "../../../Imports/Icons";
import type { EntityType, Intent, Item, ManagementCallbacks } from "../../../index.js";
import useDialogStates from "../../../Hooks/useDialogStates.js";

const EntityManageDialog = ({ Entity }: {
    readonly Entity: EntityType;
}): React.JSX.Element => {
    const dialogItems = useLoaderData() as Item[];

    const [dialogItemsCombinedState, itemsCallbacks] = useItemsReducer([]);

    const { setItems: setDialogItems } = itemsCallbacks;

    useEffect(() => {
        setDialogItems(dialogItems);
    }, [dialogItems, setDialogItems]);

    const navigate = useNavigate();

    const handleClose = useCallback(() => {
        navigate("..");
    }, [navigate]);

    const intentArray: Intent[] = ["single-delete", "single-edit", "single-restore", "single-permanent-delete"];

    const {
        dialogStateDictionary,
        openDialogByIntentWithSingleUnderlyingItem,
        openDialogByIntentWithMultipleUnderlyingItems,
        openDialogByIntentWithNoUnderlyingItems,
        closeDialogByIntent
    } = useDialogStates(intentArray);

    const pluralCapitalized = Entity.plural.substring(0, 1).toUpperCase() + Entity.plural.substr(1).toLowerCase();

    const managementCallbacks: ManagementCallbacks = useMemo(() => ({
        openDialogByIntentWithNoUnderlyingItems,
        openDialogByIntentWithMultipleUnderlyingItems,
        openDialogByIntentWithSingleUnderlyingItem,
        closeDialogByIntent
    }), [closeDialogByIntent, openDialogByIntentWithMultipleUnderlyingItems, openDialogByIntentWithNoUnderlyingItems, openDialogByIntentWithSingleUnderlyingItem]);

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
                onClose={handleClose}
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

            <ItemSingleEditDialog dialogState={dialogStateDictionary["single-edit"]} />

            <ItemSingleDeleteDialog dialogState={dialogStateDictionary["single-delete"]} />

            <ItemSingleDeleteDialog
                dialogState={dialogStateDictionary["single-restore"]}
                restoreMode
            />

        </ManagementPageProvider>
    );
};

export default EntityManageDialog;
