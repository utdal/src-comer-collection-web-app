import type { EntityFieldDefinition, ItemGenericFieldValue } from "..";

/**
 * Given a list of field definitions, return an object with all the
 * fields set to the default values.  This is useful for Create dialogs.
 * @param fields The definitions of the fields
 * @returns An object containing the field names as keys and the default values for each field
 */
const getBlankItemFields = (fields: EntityFieldDefinition[]): Record<string, ItemGenericFieldValue> => {
    const output = {} as Record<string, ItemGenericFieldValue>;
    for (const f of fields) {
        output[f.fieldName] = f.blank ?? "";
    }
    return output;
};

export default getBlankItemFields;
