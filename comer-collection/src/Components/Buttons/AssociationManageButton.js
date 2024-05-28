import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Button, styled } from "@mui/material";
import { useItemCounts } from "../../ContextProviders/ManagementPageProvider.js";

const DisappearingButton = styled(Button, {
    shouldForwardProp: (prop) => prop !== "itemCounts"
})(({ itemCounts }) => ({
    display: itemCounts.selected === 0 ? "none" : ""
}));

const AssociationManageButton = ({ secondaryEntity, handleOpenDialog }) => {
    const itemCounts = useItemCounts();
    const startIcon = useMemo(() => <secondaryEntity.DefaultIcon />, []);
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

AssociationManageButton.propTypes = {
    handleOpenDialog: PropTypes.func,
    secondaryEntity: PropTypes.func.isRequired
};

export default AssociationManageButton;
