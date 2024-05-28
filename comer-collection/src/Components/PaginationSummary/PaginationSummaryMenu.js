import React, { useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Button, Menu, Stack, Typography } from "@mui/material";
import PaginationSummaryMenuItem from "./PaginationSummaryMenuItem.js";

const PaginationSummaryMenu = ({ visibleItemCount, paginationStatus }) => {
    const [anchorElement, setAnchorElement] = useState(null);

    const textWidth = useMemo(() => (
        `${50 + (Math.floor(Math.log10(visibleItemCount)) + 1) * 20}px`
    ), [visibleItemCount]);

    const handleMenuOpen = useCallback((event) => {
        setAnchorElement(event.currentTarget);
    }, []);

    const handleMenuClose = useCallback(() => {
        setAnchorElement(null);
    }, []);

    const indicesArray = [...Array(Math.ceil(visibleItemCount / paginationStatus.itemsPerPage)).keys()].map((page) => (page * paginationStatus.itemsPerPage));

    return (
        <>

            <Button
                aria-expanded={Boolean(anchorElement)}
                aria-haspopup={Boolean(anchorElement)}
                color="inherit"
                disabled={paginationStatus.itemsPerPage >= visibleItemCount}
                onClick={handleMenuOpen}
                size="small"
                sx={{ textTransform: "unset" }}
                variant="text"
            >
                <Stack
                    direction="row"
                    justifyContent="center"
                    margin={1}
                    spacing={1}
                    width={textWidth}
                >

                    <Typography>

                        {paginationStatus.startIndex + 1}

                        {" - "}

                        {paginationStatus.endIndex + 1}

                    </Typography>

                    <Typography color="grey">

                        {" of "}

                        {visibleItemCount}

                    </Typography>
                </Stack>

            </Button>

            <Menu
                MenuListProps={{}}
                anchorEl={anchorElement}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center"
                }}
                onClose={handleMenuClose}
                open={Boolean(anchorElement)}
                sx={{ zIndex: 5000, maxHeight: "60vh" }}
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
            >
                {indicesArray.map((startIndex) => {
                    const endIndex = Math.min(visibleItemCount - 1, startIndex + paginationStatus.itemsPerPage - 1);
                    return (
                        <PaginationSummaryMenuItem
                            endIndex={endIndex}
                            handleMenuClose={handleMenuClose}
                            key={startIndex}
                            startIndex={startIndex}
                        />
                    );
                })}
            </Menu>
        </>
    );
};

PaginationSummaryMenu.propTypes = {
    paginationStatus: PropTypes.shape({
        startIndex: PropTypes.number,
        endIndex: PropTypes.number,
        itemsPerPage: PropTypes.number
    }),
    visibleItemCount: PropTypes.number
};

export default PaginationSummaryMenu;
