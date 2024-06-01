import React, { useMemo } from "react";
import type { ButtonOwnProps } from "@mui/material";
import { Button, styled } from "@mui/material";
import { useItemCounts } from "../../ContextProviders/ManagementPageProvider";
import type { EntityType, ItemCounts } from "../..";

interface DisappearingButtonProps extends ButtonOwnProps {
    itemCounts: ItemCounts;
}

const DisappearingButton = styled(Button, {
    shouldForwardProp: (prop) => prop !== "itemCounts"
})(({ itemCounts }: DisappearingButtonProps) => ({
    display: itemCounts.selected === 0 ? "none" : ""
}));

const AssociationManageButton = ({ secondaryEntity, handleOpenDialog }: {
    readonly secondaryEntity: EntityType;
    readonly handleOpenDialog: () => void;
}): React.JSX.Element => {
    const itemCounts = useItemCounts();
    const startIcon = useMemo(() => <secondaryEntity.DefaultIcon />, [secondaryEntity]);
    return (
        <DisappearingButton
            itemCounts={itemCounts}
            onClick={handleOpenDialog}
            startIcon={startIcon}
            variant="outlined"
        >
            {"Assign "}

            {secondaryEntity.plural}

            {" ("}

            {itemCounts.selected}

            )
        </DisappearingButton>
    );
};

export default AssociationManageButton;
