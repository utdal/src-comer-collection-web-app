import React, { useCallback, useMemo, useState } from "react";
import {
    Stack, Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography, DialogContentText, Divider, Box
} from "@mui/material";
import { InfoIcon, SearchIcon } from "../../../IconImports";
import { DataTable } from "../DataTable";
import SearchBox from "../SearchBox";
import { searchItems } from "../SearchUtilities";
import PropTypes from "prop-types";

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
    primaryItems, 
    secondaryItemsAll, secondariesByPrimary,
    secondaryTableFieldsAll, secondaryTableFieldsAssignedOnly,
    tableTitleAssigned, tableTitleAll,
    dialogTitle, dialogInstructions, dialogButtonForSecondaryManagement,
    dialogIsOpen, setDialogIsOpen,
    secondarySearchFields, secondarySearchBoxPlaceholder,
    defaultSortColumn, defaultSortAscending
}) => {

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
        console.log("Runnign secondaryItemsAssigned");
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

    return (
        <Dialog fullWidth={true} maxWidth="lg" sx={{ zIndex: 10000 }}
            open={dialogIsOpen} disableEscapeKeyDown
            onClose={(event, reason) => {
                if (reason == "backdropClick")
                    return;
                setDialogIsOpen(false);
            }}
        >
            <DialogTitle textAlign="center" variant="h4" sx={{ textOverflow: "ellipsis", wordWrap: "break-word" }}>
                {dialogTitle}
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
                    <Stack sx={{ width: "50%", wordWrap: "break-word" }} spacing={2} textAlign="center">
                        <Typography variant="h5">{tableTitleAll}</Typography>
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
                    <Stack sx={{ width: "50%", wordWrap: "break-word" }} spacing={2} textAlign="center">
                        <Typography variant="h5">{tableTitleAssigned}</Typography>
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
    primaryItems: PropTypes.arrayOf(PropTypes.object).isRequired,
    secondaryItemsAll: PropTypes.arrayOf(PropTypes.object).isRequired,
    secondariesByPrimary: PropTypes.object.isRequired,
    secondaryTableFieldsAll: PropTypes.arrayOf(PropTypes.object).isRequired,
    secondaryTableFieldsAssignedOnly: PropTypes.arrayOf(PropTypes.object).isRequired,
    tableTitleAll: PropTypes.string.isRequired,
    tableTitleAssigned: PropTypes.string.isRequired,
    dialogTitle: PropTypes.string.isRequired,
    dialogInstructions: PropTypes.string.isRequired,
    dialogButtonForSecondaryManagement: PropTypes.element.isRequired,
    dialogIsOpen: PropTypes.bool.isRequired,
    setDialogIsOpen: PropTypes.func.isRequired,
    secondarySearchFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    secondarySearchBoxPlaceholder: PropTypes.string,
    defaultSortAscending: PropTypes.bool.isRequired,
    defaultSortColumn: PropTypes.string.isRequired
};
