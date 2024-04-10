import React, { useMemo, useState } from "react";
import {
    Stack, Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography, DialogContentText, Divider, TextField, Box
} from "@mui/material";
import { AddIcon } from "../../Imports/IconImports.js";
import { getBlankItemFields } from "../../Helpers/fields.js";
import { DataTable } from "../DataTable.js";
import SearchBox from "../SearchBox.js";
import { searchItems } from "../../Helpers/SearchUtilities.js";
import { ItemSingleDeleteDialog } from "./ItemSingleDeleteDialog.js";
import { ItemSingleEditDialog } from "./ItemSingleEditDialog.js";
import PropTypes from "prop-types";
import { useSnackbar } from "../../ContextProviders/AppFeatures.js";

export const EntityManageDialog = ({ Entity,
    dialogItems, setDialogItems,
    dialogTableFields,
    dialogIsOpen, setDialogIsOpen,
    searchBoxFields, searchBoxPlaceholder, itemSearchQuery, setItemSearchQuery,

    internalDeleteDialogIsOpen, setInternalDeleteDialogIsOpen,
    internalDeleteDialogItem, 

    internalEditDialogIsOpen, setInternalEditDialogIsOpen,
    internalEditDialogItem, 

    refreshAllItems,

    onClose
}) => {

    const blankItem = getBlankItemFields(Entity.fieldDefinitions);
    const [itemToAdd, setItemToAdd] = useState(blankItem);
    const showSnackbar = useSnackbar();


    // const [internalEditDialogItem, setInternalEditDialogItem] = useState(null);
    // const [internalEditDialogIsOpen, setInternalEditDialogIsOpen] = useState(false);
    
    // const [internalDeleteDialogItem, setInternalDeleteDialogItem] = useState(null);
    // const [internalDeleteDialogIsOpen, setInternalDeleteDialogIsOpen] = useState(false);

    const visibleItems = useMemo(() => {
        return searchItems(itemSearchQuery, dialogItems, searchBoxFields);
    }, [dialogItems]);

    const entityDataTable = useMemo(() => {
        return (
            <DataTable tableFields={dialogTableFields} items={dialogItems} visibleItems={visibleItems} />
        );
    }, [dialogItems, visibleItems]);

    const singularCapitalized = Entity?.singular.substr(0, 1).toUpperCase() + Entity?.singular.substr(1).toLowerCase();
    const pluralCapitalized = Entity?.plural.substr(0, 1).toUpperCase() + Entity?.plural.substr(1).toLowerCase();

    return (
        <>
            <Dialog fullWidth={true} maxWidth="lg" sx={{ zIndex: 10000 }}
                open={dialogIsOpen} disableEscapeKeyDown
                onClose={(event, reason) => {
                    if (reason == "backdropClick")
                        return;
                    setDialogIsOpen(false);
                }}
            >
                <DialogTitle textAlign="center" variant="h4">Manage {pluralCapitalized}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2}
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr",
                            gridTemplateRows: "auto auto",
                            gridTemplateAreas: `
            "update"
            "create"
            `
                        }}>
                        {dialogItems.length > 0 && (
                            <>
                                <Box sx={{ gridArea: "update" }}>
                                    <Stack spacing={2} sx={{ height: "300px" }}>
                                        <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
                                            <DialogContentText textAlign="left" variant="h6">Edit or delete existing {Entity.plural}</DialogContentText>
                                            <SearchBox searchQuery={itemSearchQuery} setSearchQuery={setItemSearchQuery}
                                                placeholder={searchBoxPlaceholder} width="40%"
                                            />
                                        </Stack>

                                        {entityDataTable}

                                    </Stack>
                                </Box>
                                <Divider />
                            </>
                        )}
                        <Box sx={{ gridArea: "create" }}>
                            <Stack spacing={2}>
                                <DialogContentText textAlign="left" variant="h6">Create a new {Entity.singular}</DialogContentText>
                                <Stack component="form"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        Entity.handleMultiCreate([itemToAdd]).then(([{status}]) => {
                                            if(status == "fulfilled") {
                                                refreshAllItems();
                                                showSnackbar(`${singularCapitalized} created`, "success");
                                            } else {
                                                showSnackbar(`Failed to create ${Entity.singular}`, "error");
                                            }
                                        });
                                        setItemToAdd(getBlankItemFields(Entity.fieldDefinitions));
                                    }}
                                    direction="row" alignItems="center" spacing={2} justifyContent="space-around">
                                    <Stack direction="row" useFlexGap flexWrap="wrap" alignItems="center" spacing={2} >
                                        {Entity.fieldDefinitions.map((f, fi) => (
                                            <TextField key={f.fieldName}
                                                name={f.fieldName}
                                                label={f.displayName}
                                                autoFocus={fi == 0}
                                                value={itemToAdd[f.fieldName]}
                                                sx={{
                                                    minWidth: "200px"
                                                }}
                                                multiline={f.multiline}
                                                minRows={2}
                                                inputProps={{
                                                    type: f.inputType ?? "text",
                                                    sx: {
                                                        ...{
                                                            textAlign: f.inputType == "datetime-local" ? "center" : ""
                                                        }
                                                    }
                                                }}
                                                required={Boolean(f.isRequired)}
                                                onChange={(e) => {
                                                    setItemToAdd({
                                                        ...itemToAdd,
                                                        [f.fieldName]: e.target.value
                                                    });
                                                }} />
                                        ))}

                                    </Stack>
                                    <Button type="submit" variant="contained"
                                        startIcon={<AddIcon />}
                                        sx={{ minWidth: "200px", height: "100%" }}
                                    >
                                        <Typography variant="body1">{`Create ${Entity.singular}`}</Typography>
                                    </Button>
                                </Stack>
                            </Stack>
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Stack direction="row" justifyContent="space-between" width="100%">
                        <Typography paddingLeft={4} variant="h6" sx={{ opacity: 0.5 }}>{dialogItems.length} {dialogItems.length == 1 ? Entity.singular : Entity.plural}</Typography>
                        <Button sx={{
                            width: "30%"
                        }} color="primary" variant="contained" size="large"
                        onClick={() => {
                            if (onClose)
                                onClose();
                            setDialogIsOpen(false);
                        }}
                        >
                            <Typography variant="body1">Close</Typography>
                        </Button>
                    </Stack>
                </DialogActions>
            </Dialog>


            <ItemSingleEditDialog
                {...{Entity, refreshAllItems}}
                editDialogIsOpen={internalEditDialogIsOpen}
                setEditDialogIsOpen={setInternalEditDialogIsOpen}
                editDialogItem={internalEditDialogItem}
            />


            <ItemSingleDeleteDialog
                allItems={dialogItems}
                setAllItems={setDialogItems}
                deleteDialogIsOpen={internalDeleteDialogIsOpen}
                setDeleteDialogIsOpen={setInternalDeleteDialogIsOpen}
                deleteDialogItem={internalDeleteDialogItem}
                dialogTitle={`Delete ${Entity.singular[0].toUpperCase()}${Entity.singular.substring(1)}`}
                {...{Entity}}
            />

        </>
    );
};


EntityManageDialog.propTypes = {
    Entity: PropTypes.any,
    dialogItems: PropTypes.arrayOf(PropTypes.object),
    setDialogItems: PropTypes.func,
    dialogTableFields: PropTypes.PropTypes.arrayOf(PropTypes.object),
    dialogIsOpen: PropTypes.bool,
    setDialogIsOpen: PropTypes.func,
    searchBoxFields: PropTypes.arrayOf(PropTypes.string),
    searchBoxPlaceholder: PropTypes.string,
    itemSearchQuery: PropTypes.string,
    setItemSearchQuery: PropTypes.func,
    internalDeleteDialogIsOpen: PropTypes.bool,
    setInternalDeleteDialogIsOpen: PropTypes.func,
    internalDeleteDialogItem: PropTypes.object,
    internalEditDialogIsOpen: PropTypes.bool,
    setInternalEditDialogIsOpen: PropTypes.func,
    internalEditDialogItem: PropTypes.object,
    refreshAllItems: PropTypes.func,
    onClose: PropTypes.func
};