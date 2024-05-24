import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Stack, DialogTitle,
    DialogContent,
    DialogActions,
    Button, DialogContentText, Divider, TextField, Box,
    LinearProgress
} from "@mui/material";
import { AddIcon, WarningIcon } from "../../Imports/Icons.js";
import { getBlankItemFields } from "../../Helpers/fields.js";
import { DataTable } from "../DataTable/DataTable.js";
import SearchBox from "../SearchBox.js";
import { doesItemMatchSearchQuery } from "../../Helpers/SearchUtilities.js";
import { ItemSingleDeleteDialog } from "./ItemSingleDeleteDialog.js";
import { ItemSingleEditDialog } from "./ItemSingleEditDialog.js";
import PropTypes from "prop-types";
import { useSnackbar } from "../../ContextProviders/AppFeatures.js";
import { ManagementPageProvider, useItemsReducer } from "../../ContextProviders/ManagementPageProvider.js";
import { useDialogState } from "../../Hooks/useDialogState.js";
import { DialogState } from "../../Classes/DialogState.js";
import { PersistentDialog } from "./PersistentDialog.js";
import { FullPageMessage } from "../FullPageMessage.js";
import { RefreshButton } from "../Buttons/RefreshButton.js";
import { SelectionSummary } from "../SelectionSummary.js";

/**
 * @param {{
 *  dialogState: DialogState
 * }} props
 * @returns
 */
export const EntityManageDialog = ({
    Entity,
    dialogState
}) => {
    const blankItem = useMemo(() => getBlankItemFields(Entity.fieldDefinitions), [Entity.fieldDefinitions]);
    const [itemToAdd, setItemToAdd] = useState(blankItem);
    const showSnackbar = useSnackbar();

    const { closeDialog, dialogIsOpen } = dialogState;

    const [dialogItemsCombinedState, setDialogItems, setSelectedDialogItems, filterDialogItems] = useItemsReducer(Entity);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);

    const [itemSearchQuery, setItemSearchQuery] = useState("");

    const [editDialogState, openEditDialog] = useDialogState(false);
    const [deleteDialogState, openDeleteDialog] = useDialogState(false);

    const handleRefresh = useCallback(async () => {
        setIsError(false);
        try {
            const fetchedItems = await Entity.handleFetchAll();
            setDialogItems(fetchedItems);
            setIsLoaded(true);
        } catch (e) {
            setIsError(true);
            setIsLoaded(false);
        }
    }, [Entity, setDialogItems]);

    useEffect(() => {
        if (dialogIsOpen) {
            handleRefresh();
        }
    }, [dialogIsOpen, handleRefresh]);

    const itemFilterFunction = useCallback((item) => {
        return (
            doesItemMatchSearchQuery(itemSearchQuery, item, Entity.searchBoxFields)
        );
    }, [itemSearchQuery, Entity.searchBoxFields]);

    useEffect(() => {
        filterDialogItems(itemFilterFunction);
    }, [filterDialogItems, itemFilterFunction]);

    const singularCapitalized = Entity?.singular.substr(0, 1).toUpperCase() + Entity?.singular.substr(1).toLowerCase();
    const pluralCapitalized = Entity?.plural.substr(0, 1).toUpperCase() + Entity?.plural.substr(1).toLowerCase();

    const handleCreate = useCallback(() => {
        Entity.handleMultiCreate([itemToAdd]).then(([{ status }]) => {
            if (status === "fulfilled") {
                handleRefresh();
                showSnackbar(`${singularCapitalized} created`, "success");
            } else {
                showSnackbar(`Failed to create ${Entity.singular}`, "error");
            }
        });
        setItemToAdd(blankItem);
    }, [Entity, itemToAdd, blankItem, handleRefresh, showSnackbar, singularCapitalized]);

    const handleOpenEntityEditDialog = useCallback((item) => {
        openEditDialog(item);
    }, [openEditDialog]);

    const handleOpenEntityDeleteDialog = useCallback((item) => {
        openDeleteDialog(item);
    }, [openDeleteDialog]);

    return (
        <ManagementPageProvider
            itemsCombinedState={dialogItemsCombinedState}
            managementCallbacks={{
                handleOpenEntityEditDialog,
                handleOpenEntityDeleteDialog,
                handleRefresh
            }}
            setItems={setDialogItems}
            setSelectedItems={setSelectedDialogItems}
        >
            <PersistentDialog
                maxWidth="lg"
                onClose={closeDialog}
                onSubmit={handleCreate}
                open={dialogIsOpen}
            >
                <DialogTitle
                    textAlign="center"
                    variant="h4"
                >
                    {"Manage "}

                    {pluralCapitalized}
                </DialogTitle>

                <DialogContent sx={{ overflow: "hidden" }}>
                    {isError
                        ? (
                            <FullPageMessage
                                Icon={WarningIcon}
                                buttonAction={handleRefresh}
                                buttonText="Retry"
                                message={`Failed to load ${Entity.plural}`}
                            />
                        )
                        : (
                            !isLoaded
                                ? (
                                    <LinearProgress />
                                )
                                : (
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
                                        {dialogItemsCombinedState.items.length > 0 && (
                                            <>
                                                <Box sx={{ gridArea: "update", overflowX: "auto" }}>
                                                    <Stack
                                                        spacing={2}
                                                        sx={{ height: "300px" }}
                                                    >
                                                        <Stack
                                                            alignItems="center"
                                                            direction="row"
                                                            justifyContent="space-between"
                                                            spacing={2}
                                                        >

                                                            <SearchBox
                                                                searchQuery={itemSearchQuery}
                                                                setSearchQuery={setItemSearchQuery}
                                                                width="40%"
                                                            />

                                                            <RefreshButton />

                                                        </Stack>

                                                        <DataTable
                                                            NoContentIcon="div"
                                                            rowSelectionEnabled
                                                            smallCheckboxes
                                                            tableFields={Entity.tableFields}
                                                        />

                                                    </Stack>
                                                </Box>

                                                <Divider />
                                            </>
                                        )}

                                        <Box sx={{ gridArea: "create" }}>
                                            <Stack spacing={2}>
                                                <DialogContentText
                                                    textAlign="left"
                                                    variant="h6"
                                                >
                                                    {"Create a new "}

                                                    {Entity.singular}
                                                </DialogContentText>

                                                <Stack
                                                    alignItems="center"
                                                    direction="row"
                                                    justifyContent="space-around"
                                                    spacing={2}
                                                >
                                                    <Stack
                                                        alignItems="center"
                                                        direction="row"
                                                        flexWrap="wrap"
                                                        spacing={2}
                                                        useFlexGap
                                                    >
                                                        {Entity.fieldDefinitions.map((f, fi) => (
                                                            <TextField
                                                                autoFocus={fi === 0}
                                                                inputProps={{
                                                                    type: f.inputType ?? "text",
                                                                    sx: {
                                                                        ...{
                                                                            textAlign: f.inputType === "datetime-local" ? "center" : ""
                                                                        }
                                                                    }
                                                                }}
                                                                key={f.fieldName}
                                                                label={f.displayName}
                                                                minRows={2}
                                                                multiline={f.multiline}
                                                                name={f.fieldName}
                                                                onChange={(e) => {
                                                                    setItemToAdd({
                                                                        ...itemToAdd,
                                                                        [f.fieldName]: e.target.value
                                                                    });
                                                                }}
                                                                required={Boolean(f.isRequired)}
                                                                sx={{
                                                                    minWidth: "200px"
                                                                }}
                                                                value={itemToAdd[f.fieldName]}
                                                            />
                                                        ))}

                                                    </Stack>

                                                    <Button
                                                        startIcon={<AddIcon />}
                                                        sx={{ minWidth: "200px", height: "100%" }}
                                                        type="submit"
                                                        variant="contained"
                                                    >
                                                        {`Create ${Entity.singular}`}
                                                    </Button>
                                                </Stack>
                                            </Stack>
                                        </Box>
                                    </Stack>

                                )
                        )}
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
                            onClick={closeDialog}
                            size="large"
                            sx={{
                                width: "30%"
                            }}
                            variant="contained"
                        >
                            Close
                        </Button>

                        {isLoaded && !isError
                            ? (
                                <SelectionSummary />
                            )
                            : null}
                    </Stack>
                </DialogActions>
            </PersistentDialog>

            <ItemSingleEditDialog dialogState={editDialogState} />

            <ItemSingleDeleteDialog dialogState={deleteDialogState} />

        </ManagementPageProvider>
    );
};

EntityManageDialog.propTypes = {
    Entity: PropTypes.node.isRequired,
    dialogState: PropTypes.instanceOf(DialogState).isRequired
};
