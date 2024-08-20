import type { EntityFieldDefinition, Item } from "..";

/**
 * Given an Item, return a copy of the item with only a specific list of fields included
 * @param fields The definitions of the fields to include in the output
 * @param unfilteredItem The original Item
 * @returns The filtered Item
 */

const filterItemFields = (fields: EntityFieldDefinition[], unfilteredItem: Item): Item => {
    const output = {} as Item;
    for (const f of fields) {
        output[f.fieldName] = unfilteredItem[f.fieldName];
    }
    return output;
};

export default filterItemFields;
