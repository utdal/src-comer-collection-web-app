import React, { useCallback, useMemo, useState } from "react";
import { Button, Menu, Stack, Typography } from "@mui/material";
import PaginationSummaryMenuItem from "./PaginationSummaryMenuItem";
import type { PaginationStatus } from "../../index.js";

const PaginationSummaryMenu = ({ visibleItemCount, paginationStatus }: {
    readonly visibleItemCount: number;
    readonly paginationStatus: PaginationStatus;
}): React.JSX.Element => {
    const [anchorElement, setAnchorElement] = useState((null as unknown) as Element | null);

    const textWidth = useMemo(() => (
        `${55 + (Math.floor(Math.log10(visibleItemCount)) + 1) * 20}px`
    ), [visibleItemCount]);

    const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
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

export default PaginationSummaryMenu;
