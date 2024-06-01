import React, { useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { MenuItem, Typography } from "@mui/material";
import { useItemsPagination } from "../../ContextProviders/ManagementPageProvider";

/**
 *
 * @param {{startIndex: number, endIndex: number, handleMenuClose: () => void}} param0
 * @returns
 */
const PaginationSummaryMenuItem = ({ startIndex, endIndex, handleMenuClose }: {
    readonly startIndex: number;
    readonly endIndex: number;
    readonly handleMenuClose: () => void;
}): React.JSX.Element => {
    const { paginationStatus, setPaginationStartIndex } = useItemsPagination();

    const ref = useRef((null as unknown) as Element);

    const handleClick: React.MouseEventHandler<HTMLAnchorElement> = useCallback(() => {
        handleMenuClose();
        setPaginationStartIndex(startIndex);
    }, [handleMenuClose, setPaginationStartIndex, startIndex]);

    const isCurrentPage = startIndex === paginationStatus.startIndex && endIndex === paginationStatus.endIndex;

    useEffect(() => {
        if (isCurrentPage) {
            ref.current.scrollIntoView({
                block: "center"
            });
        }
    }, [isCurrentPage]);

    return (
        <MenuItem
            disabled={isCurrentPage}
            onClick={handleClick}
            ref={ref}
        >

            <Typography
                align="center"
                width="100%"
            >

                {startIndex + 1}

                {" - "}

                {endIndex + 1}
            </Typography>

        </MenuItem>
    );
};

PaginationSummaryMenuItem.propTypes = {
    endIndex: PropTypes.number,
    handleMenuClose: PropTypes.func,
    startIndex: PropTypes.number
};

export default PaginationSummaryMenuItem;
