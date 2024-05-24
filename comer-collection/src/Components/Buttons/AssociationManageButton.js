import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Button, styled } from "@mui/material";
import { useEntity, useItemCounts } from "../../ContextProviders/ManagementPageProvider.js";

const DisappearingButton = styled(Button)(({ itemCounts }) => ({
    display: itemCounts.selected === 0 ? "none" : ""
}));

const AssociationManageButton = ({ secondaryEntity, handleOpenDialog }) => {
    const primaryEntity = useEntity();
    const itemCounts = useItemCounts();
    const startIcon = useMemo(() => <secondaryEntity.DefaultIcon />, []);
    return (
        <DisappearingButton
            itemCounts={itemCounts}
            onClick={handleOpenDialog}
            startIcon={startIcon}
            variant="outlined"
        >
            {"Update "}

            {secondaryEntity.plural}

            {" for "}

            {itemCounts.selected}

            {" "}

            {itemCounts.selected === 1
                ? primaryEntity.singular
                : primaryEntity.plural}
        </DisappearingButton>
    );
};

AssociationManageButton.propTypes = {
    handleOpenDialog: PropTypes.func,
    secondaryEntity: PropTypes.node.isRequired
};

export default AssociationManageButton;
