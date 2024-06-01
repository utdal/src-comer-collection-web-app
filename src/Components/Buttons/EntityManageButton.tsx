import React, { useCallback } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router";
import type { EntityType } from "../..";

/**
 * @param {{
 *  entity: Class
 * }} props
 */
const EntityManageButton = ({ entity }: {
    readonly entity: EntityType;
}): React.JSX.Element => {
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

export default EntityManageButton;
