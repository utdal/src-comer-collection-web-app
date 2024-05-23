import React from "react";
import PropTypes from "prop-types";
import { Button, Typography } from "@mui/material";
import { useEntity, useSelectedItems } from "../../ContextProviders/ManagementPageProvider.js";

const AssociationManageButton = ({ secondaryEntity, handleOpenDialog }) => {
    const primaryEntity = useEntity();
    const [selectedItems] = useSelectedItems();
    return (
        <Button
            onClick={handleOpenDialog}
            startIcon={<secondaryEntity.DefaultIcon />}
            sx={{
                display: selectedItems.length === 0 ? "none" : ""
            }}
            variant="outlined"
        >
            <Typography variant="body1">

                {"Update "}

                {secondaryEntity.plural}

                {" for "}

                {selectedItems.length}

                {" "}

                {selectedItems.length === 1
                    ? primaryEntity.singular
                    : primaryEntity.plural}
            </Typography>
        </Button>
    );
};

AssociationManageButton.propTypes = {
    handleOpenDialog: PropTypes.func,
    secondaryEntity: PropTypes.node.isRequired
};

export default AssociationManageButton;
