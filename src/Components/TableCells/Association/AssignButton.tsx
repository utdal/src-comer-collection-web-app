import React from "react";
import { useSnackbar } from "../../../ContextProviders/AppFeatures";
import { useAssociationType, useRelevantPrimaryItems } from "../../../ContextProviders/AssociationManagementPageProvider";
import { User } from "../../../Classes/Entities/User";
import { Button, Typography } from "@mui/material";
import { CheckIcon } from "../../../Imports/Icons";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { SecondaryItem, UserItem } from "../../..";

const AssignButton = (): React.JSX.Element => {
    const showSnackbar = useSnackbar();
    const secondaryItem = useTableCellItem() as SecondaryItem;
    const primaryItems = useRelevantPrimaryItems();
    const AssociationType = useAssociationType();
    const buttonColor = AssociationType.secondary === User && (secondaryItem as SecondaryItem & UserItem).is_admin_or_collection_manager ? "secondary" : "primary";
    const quantity = secondaryItem.quantity_assigned;
    if (quantity === primaryItems.length) {
        const buttonText = (
            primaryItems.length === 1
                ? `${AssociationType.assignPast} ${AssociationType.primary.singular}`
                : `${AssociationType.assignPast} ${quantity} ${AssociationType.primary.plural}`
        );
        return (
            <Button
                color={buttonColor}
                disabled
                startIcon={<CheckIcon />}
                variant="text"
            >
                <Typography variant="body1">
                    {buttonText}
                </Typography>
            </Button>
        );
    } else if (quantity < primaryItems.length) {
        const buttonText = (
            primaryItems.length === 1
                ? `${AssociationType.assignPresent} ${AssociationType.primary.singular}`
                : quantity > 0
                    ? `${AssociationType.assignPresent} ${primaryItems.length - quantity} more ${primaryItems.length - quantity !== 1 ? AssociationType.primary.plural : AssociationType.primary.singular}`
                    : `${AssociationType.assignPresent} ${primaryItems.length - quantity} ${primaryItems.length - quantity !== 1 ? AssociationType.primary.plural : AssociationType.primary.singular}`
        );
        return (
            <Button
                color={buttonColor}
                onClick={(): void => {
                    const primaryIds = primaryItems.map((p) => p.id);
                    AssociationType.handleAssign(primaryIds, [secondaryItem.id]).then((msg) => {
                        showSnackbar(msg, "success");
                    // refreshAllItems();
                    }).catch((err) => {
                        showSnackbar((err as Error).message, "error");
                    });
                }}
                startIcon={<AssociationType.AssignIcon />}
                variant="outlined"
            >
                <Typography variant="body1">
                    {buttonText}
                </Typography>
            </Button>
        );
    } else {
        return (
            <Typography>
                Error
            </Typography>
        );
    }
};

export default AssignButton;
