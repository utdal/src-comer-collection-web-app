import React, { createContext, useContext } from "react";
import PropTypes from "prop-types";
import { entityPropTypeShape } from "../Classes/Entity.js";

const TableRowContext = createContext();

export const TableRowProvider = ({ item, children }) => {
    return (
        <TableRowContext.Provider value={item}>
            {children}
        </TableRowContext.Provider>
    );
};

TableRowProvider.propTypes = {
    children: PropTypes.node.isRequired,
    item: PropTypes.shape(entityPropTypeShape).isRequired
};

/**
 * Access the item within the TableRowContext
 * @returns {Object} The item represented in the Table Row
 */
export const useTableRowItem = () => {
    return useContext(TableRowContext);
};
