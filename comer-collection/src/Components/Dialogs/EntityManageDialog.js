import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Stack, Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography, DialogContentText, Divider, TextField, Box
} from "@mui/material";
import { AddIcon } from "../../Imports/Icons.js";
import { getBlankItemFields } from "../../Helpers/fields.js";
import { DataTable } from "../DataTable/DataTable.js";
import SearchBox from "../SearchBox.js";
import { doesItemMatchSearchQuery } from "../../Helpers/SearchUtilities.js";
import { ItemSingleDeleteDialog } from "./ItemSingleDeleteDialog.js";
import { ItemSingleEditDialog } from "./ItemSingleEditDialog.js";
import PropTypes from "prop-types";
import { useSnackbar } from "../../ContextProviders/AppFeatures.js";
import { ManagementPageProvider } from "../../ContextProviders/ManagementPageProvider.js";
import { itemsCombinedStatePropTypeShape } from "../../Classes/Entity.js";

export const EntityManageDialog = ({
    Entity,
    dialogItemsCombinedState, setDialogItems, filterDialogItems,
    dialogIsOpen, setDialogIsOpen,
    searchBoxPlaceholder,

    refreshAllItems,

    onClose
}) => {
    const blankItem = useMemo(() => getBlankItemFields(Entity.fieldDefinitions), [Entity.fieldDefinitions]);
    const [itemToAdd, setItemToAdd] = useState(blankItem);
    const showSnackbar = useSnackbar();

    const [itemSearchQuery, setItemSearchQuery] = useState("");

    const [internalEditDialogItem, setInternalEditDialogItem] = useState(null);
    const [internalEditDialogIsOpen, setInternalEditDialogIsOpen] = useState(false);

    const [internalDeleteDialogItem, setInternalDeleteDialogItem] = useState(null);
    const [internalDeleteDialogIsOpen, setInternalDeleteDialogIsOpen] = useState(false);

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

    const handleCreate = useCallback((e) => {
        e.preventDefault();
        Entity.handleMultiCreate([itemToAdd]).then(([{ status }]) => {
            if (status === "fulfilled") {
                refreshAllItems();
                showSnackbar(`${singularCapitalized} created`, "success");
            } else {
                showSnackbar(`Failed to create ${Entity.singular}`, "error");
            }
        });
        setItemToAdd(blankItem);
    }, [Entity, blankItem, itemToAdd, refreshAllItems, showSnackbar, singularCapitalized]);

    const handleOpenEntityEditDialog = useCallback((item) => {
        setInternalEditDialogItem(item);
        setInternalEditDialogIsOpen(true);
    }, []);

    const handleOpenEntityDeleteDialog = useCallback((item) => {
        setInternalDeleteDialogItem(item);
        setInternalDeleteDialogIsOpen(true);
    }, []);

    return (
        <ManagementPageProvider
            itemsCombinedState={dialogItemsCombinedState}
            managementCallbacks={{
                handleOpenEntityEditDialog,
                handleOpenEntityDeleteDialog
            }}
        >
            <Dialog
                disableEscapeKeyDown
                fullWidth
                maxWidth="lg"
                onClose={(event, reason) => {
                    if (reason === "backdropClick") { return; }
                    setDialogIsOpen(false);
                }}
                open={dialogIsOpen}
                sx={{ zIndex: 10000 }}
            >
                <DialogTitle
                    textAlign="center"
                    variant="h4"
                >
                    Manage
                    {pluralCapitalized}
                </DialogTitle>

                <DialogContent>
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
                                <Box sx={{ gridArea: "update" }}>
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
                                            <DialogContentText
                                                textAlign="left"
                                                variant="h6"
                                            >
                                                Edit or delete existing
                                                {Entity.plural}
                                            </DialogContentText>

                                            <SearchBox
                                                placeholder={searchBoxPlaceholder}
                                                searchQuery={itemSearchQuery}
                                                setSearchQuery={setItemSearchQuery}
                                                width="40%"
                                            />
                                        </Stack>

                                        <DataTable
                                            NoContentIcon="div"
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
                                    Create a new
                                    {Entity.singular}
                                </DialogContentText>

                                <Stack
                                    alignItems="center"
                                    component="form"
                                    direction="row"
                                    justifyContent="space-around"
                                    onSubmit={handleCreate}
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
                                        <Typography variant="body1">
                                            {`Create ${Entity.singular}`}
                                        </Typography>
                                    </Button>
                                </Stack>
                            </Stack>
                        </Box>
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        width="100%"
                    >
                        <Typography
                            paddingLeft={4}
                            sx={{ opacity: 0.5 }}
                            variant="h6"
                        >
                            {dialogItemsCombinedState.items.length}

                            {" "}

                            {dialogItemsCombinedState.items.length === 1 ? Entity.singular : Entity.plural}
                        </Typography>

                        <Button
                            color="primary"
                            onClick={() => {
                                if (onClose) { onClose(); }
                                setDialogIsOpen(false);
                            }}
                            size="large"
                            sx={{
                                width: "30%"
                            }}
                            variant="contained"
                        >
                            <Typography variant="body1">
                                Close
                            </Typography>
                        </Button>
                    </Stack>
                </DialogActions>
            </Dialog>

            <ItemSingleEditDialog
                Entity={Entity}
                editDialogIsOpen={internalEditDialogIsOpen}
                editDialogItem={internalEditDialogItem}
                refreshAllItems={refreshAllItems}
                setEditDialogIsOpen={setInternalEditDialogIsOpen}
            />

            <ItemSingleDeleteDialog
                Entity={Entity}
                allItems={dialogItemsCombinedState.items}
                deleteDialogIsOpen={internalDeleteDialogIsOpen}
                deleteDialogItem={internalDeleteDialogItem}
                dialogTitle={`Delete ${Entity.singular[0].toUpperCase()}${Entity.singular.substring(1)}`}
                setAllItems={setDialogItems}
                setDeleteDialogIsOpen={setInternalDeleteDialogIsOpen}
            />

        </ManagementPageProvider>
    );
};

EntityManageDialog.propTypes = {
    Entity: PropTypes.node.isRequired,
    dialogIsOpen: PropTypes.bool.isRequired,
    dialogItemsCombinedState: PropTypes.exact(itemsCombinedStatePropTypeShape).isRequired,
    filterDialogItems: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    refreshAllItems: PropTypes.func.isRequired,
    searchBoxPlaceholder: PropTypes.string.isRequired,
    setDialogIsOpen: PropTypes.func.isRequired,
    setDialogItems: PropTypes.func.isRequired
};
