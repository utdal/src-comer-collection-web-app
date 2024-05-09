import React, { createContext, useContext } from "react";
import PropTypes from "prop-types";

const TableRowContext = createContext();

export const TableRowProvider = ({ item, children }) => {
    return (
        <TableRowContext.Provider value={item}>
            {children}
        </TableRowContext.Provider>
    );
};

TableRowProvider.propTypes = {
    item: PropTypes.object,
    children: PropTypes.node
};

/**
 * Access the item within the TableRowContext
 * @returns {Object} The item represented in the Table Row
 */
export const useTableRowItem = () => {
    return useContext(TableRowContext);
};
