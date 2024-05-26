import React from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";

/**
 * @param {{
 *  entity: Class
 * }} props
 */
const EntityManageButton = ({ entity, handleOpenDialog }) => {
    return (
        <Button
            color="primary"
            onClick={handleOpenDialog}
            startIcon={<entity.DefaultIcon />}
            variant="outlined"
        >
            {entity.plural}
        </Button>
    );
};

EntityManageButton.propTypes = {
    entity: PropTypes.func.isRequired,
    handleOpenDialog: PropTypes.func.isRequired
};

export default EntityManageButton;
