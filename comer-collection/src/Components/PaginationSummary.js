import React from "react";
import { useEntity, useItemCounts, useItemsPagination } from "../ContextProviders/ManagementPageProvider.js";
import { Stack } from "@mui/material";

const PaginationSummary = () => {
    const { paginationStatus } = useItemsPagination();
    const itemCounts = useItemCounts();
    const Entity = useEntity();

    const endIndex = paginationStatus.startIndex + paginationStatus.itemsPerPage < itemCounts.visible
        ? paginationStatus.startIndex + paginationStatus.itemsPerPage - 1
        : itemCounts.visible - 1;

    return (
        <Stack
            alignItems="center"
            direction="row"
            spacing={2}
        >
            (TEST ONLY) Showing items
            {" "}

            {paginationStatus.startIndex}

            {" "}
            through

            {" "}

            {endIndex}

            {" "}

            {paginationStatus.itemsPerPage}

            {" "}
            of

            {" "}

            {itemCounts.visible}

            {" "}
            visible

            {" "}

            {Entity.plural}
        </Stack>
    );
};

export default PaginationSummary;
