import React, { useCallback, useMemo, useState } from "react";
import {
    Stack, Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography, DialogContentText, Divider, Box
} from "@mui/material";
import { CheckIcon, InfoIcon, SearchIcon } from "../../Imports/Icons.js";
import { DataTable } from "../DataTable.js";
import SearchBox from "../SearchBox.js";
import { searchItems } from "../../Helpers/SearchUtilities.js";
import PropTypes from "prop-types";
import { useSnackbar } from "../../ContextProviders/AppFeatures.js";
import { capitalized } from "../../Classes/Entity.js";
import { User } from "../../Classes/Entities/User.js";

const computeSecondaryItemsAssigned = (secondaryItemsAll, secondariesByPrimary, primaryItems) => {
    if (primaryItems?.length == 0)
        return [];
    return secondaryItemsAll.filter((si) => {
        return (
            Object.entries(secondariesByPrimary)
                .filter((entry) => primaryItems.map((pi) => pi.id).includes(parseInt(entry[0])))
                .map((entry) => entry[1]).filter((secondaries) => secondaries.map(s => s.id).includes(parseInt(si.id))).length > 0
        );
    });
};

export const AssociationManagementDialog = ({
    Association, editMode, primaryItems,
    secondaryItemsAll, secondariesByPrimary,
    secondaryTableFields,
    dialogInstructions, dialogButtonForSecondaryManagement,
    dialogIsOpen, setDialogIsOpen,
    secondarySearchFields, secondarySearchBoxPlaceholder,
    defaultSortColumn, defaultSortAscending,
    refreshAllItems
}) => {

    const showSnackbar = useSnackbar();

    const assignButtonColumnDefinition = {
        generateTableCell: (secondaryItem) => {
            const buttonColor = Association.secondary == User && secondaryItem.is_admin_or_collection_manager ? "secondary" : "primary";
            const quantity = secondaryItem.quantity_assigned;
            if (quantity == primaryItems.length) {
                const buttonText = (
                    primaryItems.length == 1 ?
                        `${Association.assignPast} ${Association.primary.singular}` :
                        quantity == 2 ?
                            `${Association.assignPast} both ${Association.primary.plural}` :
                            `${Association.assignPast} all ${quantity} ${Association.primary.plural}`
                );
                return (
                    <Button variant="text" color={buttonColor} disabled startIcon={<CheckIcon />}>
                        <Typography variant="body1">{buttonText}</Typography>
                    </Button>
                );
            } else if (quantity < primaryItems.length) {
                const buttonText = (
                    primaryItems.length == 1 ?
                        `${Association.assignPresent} ${Association.primary.singular}` :
                        quantity > 0 ?
                            `${Association.assignPresent} ${primaryItems.length - quantity} more ${primaryItems.length - quantity != 1 ? Association.primary.plural : Association.primary.singular}` :
                            `${Association.assignPresent} ${primaryItems.length - quantity} ${primaryItems.length - quantity != 1 ? Association.primary.plural : Association.primary.singular}`
                );
                return (
                    <Button variant="outlined" color={buttonColor} startIcon={<Association.AssignIcon />} onClick={() => {
                        const primaryIds = primaryItems.map((p) => p.id);
                        Association.handleAssign(primaryIds, [secondaryItem.id]).then((msg) => {
                            showSnackbar(msg, "success");
                            refreshAllItems();
                        }).catch((err) => {
                            showSnackbar(err, "error");
                        });
                    }}>
                        <Typography variant="body1">
                            {buttonText}
                        </Typography>
                    </Button>
                );
            }
        }
    };

    const unassignButtonColumnDefinition = {
        generateTableCell: (secondaryItem) => {
            const buttonColor = Association.secondary == User && secondaryItem.is_admin_or_collection_manager ? "secondary" : "primary";
            const quantity = secondaryItem.quantity_assigned;
            const buttonText = (
                primaryItems.length == 1 ?
                    `${capitalized(Association.unassignPresent)} ${Association.primary.singular}` :
                    `${capitalized(Association.unassignPresent)} ${quantity} ${quantity == 1 ? Association.primary.singular : Association.primary.plural}`
            );
            return (
                <Button variant="outlined" color={buttonColor} startIcon={<Association.UnassignIcon />} onClick={() => {
                    const primaryIds = primaryItems.map((p) => p.id);
                    Association.handleUnassign(primaryIds, [secondaryItem.id]).then((msg) => {
                        showSnackbar(msg, "success");
                        refreshAllItems();
                    }).catch((err) => {
                        showSnackbar(err, "error");
                    });
                }}>
                    <Typography variant="body1">{buttonText}</Typography>
                </Button>
            );
        }
    };

    const secondaryTableFieldsAll = editMode ? [...secondaryTableFields, assignButtonColumnDefinition] : secondaryTableFields;
    const secondaryTableFieldsAssignedOnly = editMode ? [...secondaryTableFields, unassignButtonColumnDefinition] : secondaryTableFields;

    const [secondarySearchQuery, setSecondarySearchQuery] = useState("");

    const getQuantityAssigned = useCallback((secondary) => {
        return Object.entries(secondariesByPrimary)
            .filter(([primaryId]) => (
                primaryItems.map((pi) => pi.id).includes(parseInt(primaryId))
            ))
            .filter(([, secondaries]) => (
                secondaries.map((si) => si.id).includes(secondary.id)
            )).length;
    }, [secondariesByPrimary, primaryItems]);


    const secondaryItemsAssigned = useMemo(() => {
        return computeSecondaryItemsAssigned(secondaryItemsAll, secondariesByPrimary, primaryItems);
    }, [secondaryItemsAll, secondariesByPrimary, primaryItems]);

    const secondaryItemsAllWithQuantities = secondaryItemsAll.map((si) => {
        return { ...si, quantity_assigned: getQuantityAssigned(si) };
    });

    const secondaryItemsAssignedWithQuantities = secondaryItemsAssigned.map((si) => {
        return { ...si, quantity_assigned: getQuantityAssigned(si) };
    });

    const secondaryItemsAllResults = useMemo(() => searchItems(secondarySearchQuery, secondaryItemsAllWithQuantities, secondarySearchFields ?? []), [secondarySearchQuery, secondaryItemsAllWithQuantities]);

    const secondaryItemsAssignedResults = useMemo(() => searchItems(secondarySearchQuery, secondaryItemsAssignedWithQuantities, secondarySearchFields ?? []), [secondarySearchQuery, secondaryItemsAssigned]);

    const allTable = useMemo(() => {
        return <DataTable
            nonEmptyHeight="300px"
            tableFields={secondaryTableFieldsAll}
            items={secondaryItemsAllWithQuantities}
            visibleItems={secondaryItemsAllResults}
            defaultSortColumn={defaultSortColumn}
            defaultSortAscending={defaultSortAscending}
        />;
    }, [secondaryItemsAllResults, primaryItems, secondariesByPrimary]);

    const assignedTable = useMemo(() => {
        return <DataTable
            nonEmptyHeight="300px"
            tableFields={secondaryTableFieldsAssignedOnly}
            items={secondaryItemsAssignedWithQuantities}
            visibleItems={secondaryItemsAssignedResults}
            defaultSortColumn={defaultSortColumn}
            defaultSortAscending={defaultSortAscending}
        />;
    }, [secondaryItemsAssignedResults, primaryItems, secondariesByPrimary]);

    const associationPluralCapitalized = Association.plural.substr(0, 1).toUpperCase() + Association.plural.substr(1);
    const primaryPluralCapitalized = Association.primary.plural.substr(0, 1).toUpperCase() + Association.primary.plural.substr(1);
    const secondaryPluralCapitalized = Association.secondary.plural.substr(0, 1).toUpperCase() + Association.secondary.plural.substr(1);

    return (
        <Dialog fullWidth={true} maxWidth={editMode ? "lg" : "md"} sx={{ zIndex: 10000 }}
            open={dialogIsOpen} disableEscapeKeyDown
            onClose={(event, reason) => {
                if (reason == "backdropClick")
                    return;
                setDialogIsOpen(false);
            }}
        >
            <DialogTitle textAlign="center" variant="h4" sx={{ textOverflow: "ellipsis", wordWrap: "break-word" }}>
                {primaryItems.length == 1 ?
                    `${editMode ? "Manage" : "View"} ${associationPluralCapitalized} for ${primaryItems[0].safe_display_name}` :
                    `${editMode ? "Manage" : "View"} ${associationPluralCapitalized} for ${primaryItems.length} Selected ${primaryPluralCapitalized}`}
            </DialogTitle>
            <DialogContent>
                <DialogContentText variant="body1">{dialogInstructions}</DialogContentText>
                <Stack direction="column" padding={1}>
                    {secondarySearchFields?.length > 0 && (
                        <SearchBox width="100%" placeholder={secondarySearchBoxPlaceholder ?? "Search"}
                            searchQuery={secondarySearchQuery}
                            setSearchQuery={setSecondarySearchQuery}
                        />
                    )}
                </Stack>
                <Stack spacing={2} direction="row" padding={2}>
                    {
                        editMode && (
                            <>
                                <Stack sx={{ width: "50%", wordWrap: "break-word" }} spacing={2} textAlign="center">
                                    <Typography variant="h5">All {secondaryPluralCapitalized}</Typography>
                                    <Box maxHeight="350px">
                                        {secondaryItemsAll.length > 0 && secondaryItemsAllResults.length > 0 &&
                                allTable
                                || secondaryItemsAll.length > 0 && secondaryItemsAllResults.length == 0 && (
                                    <Box sx={{ width: "100%", height: "100%" }}>
                                        <Stack direction="column" alignItems="center" justifyContent="center" paddingTop={2} spacing={2} sx={{ height: "100%", opacity: 0.5 }}>
                                            <SearchIcon sx={{ fontSize: "150pt" }} />
                                            <Typography variant="h4">No results</Typography>
                                        </Stack>
                                    </Box>
                                ) || secondaryItemsAll.length == 0 && (
                                            <Box sx={{ width: "100%", height: "100%" }}>
                                                <Stack direction="column" alignItems="center" justifyContent="center" paddingTop={2} spacing={2} sx={{ height: "100%", opacity: 0.5 }}>
                                                    <InfoIcon sx={{ fontSize: "150pt" }} />
                                                    <Typography variant="h4">This list is empty</Typography>
                                                </Stack>
                                            </Box>
                                        )}
                                    </Box>
                                </Stack>
                                <Divider sx={{ borderWidth: "2px" }} />
                            </>
                        )
                    }
                    <Stack sx={{ width: editMode ? "50%" : "100%", wordWrap: "break-word" }} spacing={2} textAlign="center">
                        {editMode && <Typography variant="h5">Current {secondaryPluralCapitalized} for Selected {primaryPluralCapitalized}</Typography>}
                        <Box maxHeight="350px">
                            {secondaryItemsAssigned.length > 0 && secondaryItemsAssignedResults.length > 0 && assignedTable
                                || secondaryItemsAssigned.length > 0 && secondaryItemsAssignedResults.length == 0 && (
                                    <Box sx={{ width: "100%", height: "100%" }}>
                                        <Stack direction="column" alignItems="center" justifyContent="center" paddingTop={2} spacing={2} sx={{ height: "100%", opacity: 0.5 }}>
                                            <SearchIcon sx={{ fontSize: "150pt" }} />
                                            <Typography variant="h4">No results</Typography>
                                        </Stack>
                                    </Box>
                                ) || secondaryItemsAssigned.length == 0 && (
                                <Box sx={{ width: "100%", height: "100%" }}>
                                    <Stack direction="column" alignItems="center" justifyContent="center" paddingTop={2} spacing={2} sx={{ height: "100%", opacity: 0.5 }}>
                                        <InfoIcon sx={{ fontSize: "150pt" }} />
                                        <Typography variant="h4">This list is empty</Typography>
                                    </Stack>
                                </Box>
                            )}
                        </Box>
                    </Stack>

                </Stack>
            </DialogContent>
            <DialogActions>
                <Stack direction="row" spacing={1} justifyContent="space-between" width="100%">
                    {dialogButtonForSecondaryManagement}
                    <Button type="submit" sx={{
                        width: "30%"
                    }} color="primary" variant="contained" size="large"
                    onClick={() => {
                        setDialogIsOpen(false);
                    }}
                    >
                        <Typography variant="body1">Close</Typography>
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
};

AssociationManagementDialog.propTypes = {
    Association: PropTypes.any,
    editMode: PropTypes.bool.isRequired,
    primaryItems: PropTypes.arrayOf(PropTypes.object).isRequired,
    secondaryItemsAll: PropTypes.arrayOf(PropTypes.object).isRequired,
    secondariesByPrimary: PropTypes.object.isRequired,
    secondaryTableFields: PropTypes.arrayOf(PropTypes.object).isRequired,
    dialogInstructions: PropTypes.string,
    dialogButtonForSecondaryManagement: PropTypes.element.isRequired,
    dialogIsOpen: PropTypes.bool.isRequired,
    setDialogIsOpen: PropTypes.func.isRequired,
    secondarySearchFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    secondarySearchBoxPlaceholder: PropTypes.string,
    defaultSortAscending: PropTypes.bool,
    defaultSortColumn: PropTypes.string,
    refreshAllItems: PropTypes.func
};
