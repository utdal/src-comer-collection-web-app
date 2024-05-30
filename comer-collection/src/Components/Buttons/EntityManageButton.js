import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { useNavigate } from "react-router";

/**
 * @param {{
 *  entity: Class
 * }} props
 */
const EntityManageButton = ({ entity, handleOpenDialog }) => {
    const navigate = useNavigate();

    const handleClick = useCallback(() => {
        navigate(entity.entityManageRelativeUrl);
    }, [entity.entityManageRelativeUrl, navigate]);
    return (
        <Button
            color="primary"
            onClick={handleClick}
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
