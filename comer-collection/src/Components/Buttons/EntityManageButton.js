import React from "react";
import PropTypes from "prop-types";
import { Button, Typography } from "@mui/material";

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
            <Typography variant="body1">
                {entity.plural}
            </Typography>
        </Button>
    );
};

EntityManageButton.propTypes = {
    entity: PropTypes.node.isRequired,
    handleOpenDialog: PropTypes.func.isRequired
};

export default EntityManageButton;
