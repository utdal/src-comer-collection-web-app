import React from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { useItemsLoadStatus } from "../../ContextProviders/ManagementPageProvider.js";

/**
 * @param {{
 *  entity: Class
 * }} props
 */
const EntityManageButton = ({ entity, handleOpenDialog }) => {
    const [isLoaded, isError] = useItemsLoadStatus();
    return (
        <Button
            color="primary"
            disabled={!isLoaded || isError}
            onClick={handleOpenDialog}
            startIcon={<entity.DefaultIcon />}
            variant="outlined"
        >
            {entity.plural}
        </Button>
    );
};

EntityManageButton.propTypes = {
    entity: PropTypes.node.isRequired,
    handleOpenDialog: PropTypes.func.isRequired
};

export default EntityManageButton;
