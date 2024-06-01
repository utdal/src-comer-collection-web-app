/**
 * @file This file contains types for all the different
 * types of actions that can be dispatched to React
 * when editing an exhibition.
 */

export type ExhibitionImageDirectionIdentifier = 1 | 2 | 3 | 4;

export type ExhibitionPrivacyOptions = "PRIVATE" | "PUBLIC_ANONYMOUS" | "PUBLIC";

export type ExhibitionDataAsString = string;

export interface ExhibitionImageData {
    image_id: number;
    position: {
        custom_position: boolean;
        custom_x: number;
        custom_y: number;
    };
    size: {
        width: number;
        height: number;
    };
    matte: {
        color: string;
        weighted: boolean;
        weighted_value: number;
    };
    frame: {
        custom: boolean;
        width: number;
        height: number;
        color: string;
    };
    light: {
        intensity: number;
        color: string;
    };
    metadata: {
        title: string;
        artist: string;
        description: string;
        year: number;
        medium: string;
        additional_information: string | null;
        direction: ExhibitionImageDirectionIdentifier;
    };
}

export interface ExhibitionData {
    appearance: {
        main_wall_color: string;
        side_wall_color: string;
        floor_color: string;
        ceiling_color: string;
        floor_texture: string;
        moodiness: string;
        ambient_light_color: string;
    };
    size: {
        length_ft: number;
        width_ft: number;
        height_ft: number;
    };
    images: ExhibitionImageData[];
}

export interface ExhibitionMetadata {
    id: number;
    safe_display_name: string;
    title: string;
    date_created: string;
    date_modified: string;
    privacy: ExhibitionPrivacyOptions;
    exhibition_owner: number;
    curator: string;
    isEditable: boolean;
}

/**
 * @description Common fields for all actions with exhibition scope.
 */
interface ExhibitionScope {
    scope: "exhibition";
}

/**
 * @description Common fields for all actions with image scope.
 */
interface ImageScope {
    scope: "image";
    image_id: number;
}

/**
 * @description Dispatching an action of this type will overwrite the
 * state of the exhibition viewer.  (This is not the same thing
 * as saving the exhibition to the server.)  This is typically used
 * only once to set the exhibition viewer to the correct state
 * when it is opened, and an exhibition is downloaded from the server.
 */
export interface ExhibitionSetEverythingAction extends ExhibitionScope {
    type: "set_everything";
    newExhibition: ExhibitionData;
}

export interface ExhibitionSetMainWallColorAction extends ExhibitionScope {
    type: "set_main_wall_color";
    newColor: string;
}

export interface ExhibitionSetWideWallColorAction extends ExhibitionScope {
    type: "set_side_wall_color";
    newColor: string;
}

export interface ExhibitionSetFloorColorAction extends ExhibitionScope {
    type: "set_floor_color";
    newColor: string;
}

export interface ExhibitionSetCeilingColorAction extends ExhibitionScope {
    type: "set_ceiling_color";
    newColor: string;
}

export interface ExhibitionSetFloorTextureAction extends ExhibitionScope {
    type: "set_floor_texture";
    newTexture: string;
}

export interface ExhibitionSetMoodinessAction extends ExhibitionScope {
    type: "set_moodiness";
    newMoodiness: string;
}

export interface ExhibitionSetAmbientLightColorAction extends ExhibitionScope {
    type: "set_ambient_light_color";
    newColor: string;
}

export interface ExhibitionSetLengthAction extends ExhibitionScope {
    type: "set_length";
    newValue: number;
}

export interface ExhibitionSetWidthAction extends ExhibitionScope {
    type: "set_width";
    newValue: number;
}

export interface ExhibitionSetHeightAction extends ExhibitionScope {
    type: "set_height";
    newValue: number;
}

export interface ExhibitionAddImageAction extends ExhibitionScope {
    type: "add_image";
    image_id: number;
}

export interface ExhibitionRemoveImageAction extends ExhibitionScope {
    type: "remove_image";
    image_id: number;
}

export interface ExhibitionSetImageAction extends ExhibitionScope {
    type: "set_images";
    newImages: ExhibitionImageData[];
}

export interface ExhibitionImageCustomPositionSetXAction extends ImageScope {
    type: "set_position_custom_x";
    newValue: number;
}

export interface ExhibitionImageCustomPositionSetYAction extends ImageScope {
    type: "set_position_custom_y";
    newValue: number;
}

export interface ExhibitionImageCustomPositionEnablementAction extends ImageScope {
    type: "set_position_custom_enabled";
    isEnabled: boolean;
}

export interface ExhibitionImageSetMatteColorAction extends ImageScope {
    type: "set_matte_color";
    newColor: string;
}

export interface ExhibitionImageSetMatteWeightEnablementAction extends ImageScope {
    type: "set_matte_weight_enabled";
    isEnabled: boolean;
}

export interface ExhibitionImageSetMatteWeightValue extends ImageScope {
    type: "set_matte_weight_value";
    newValue: number;
}

export interface ExhibitionImageSetCustomFrameEnablementAction extends ImageScope {
    type: "set_frame_custom_enabled";
    isEnabled: boolean;
}

export interface ExhibitionImageSetCustomFrameWidthAction extends ImageScope {
    type: "set_frame_width";
    newValue: number;
}

export interface ExhibitionImageSetCustomFrameHeightAction extends ImageScope {
    type: "set_frame_height";
    newValue: number;
}

export interface ExhibitionImageSetCustomFrameColorAction extends ImageScope {
    type: "set_frame_color";
    newColor: string;
}

export interface ExhibitionImageSetLightIntensityAction extends ImageScope {
    type: "set_light_intensity";
    newValue: number;
}

export interface ExhibitionImageSetLightColorAction extends ImageScope {
    type: "set_light_color";
    newColor: string;
}

export interface ExhibitionImageSetDescriptionAction extends ImageScope {
    type: "set_description";
    newValue: string;
}

export interface ExhibitionImageSetAdditionalInfoAction extends ImageScope {
    type: "set_additional_information";
    newValue: string;
}

export interface ExhibitionImageSetDirectionAction extends ImageScope {
    type: "set_direction";
    newValue: ExhibitionImageDirectionIdentifier;
}

export type ExhibitionScopedAction = ExhibitionAddImageAction | ExhibitionImageSetAdditionalInfoAction | ExhibitionImageSetCustomFrameColorAction | ExhibitionImageSetDescriptionAction | ExhibitionImageSetDirectionAction | ExhibitionImageSetLightColorAction | ExhibitionImageSetLightIntensityAction | ExhibitionRemoveImageAction | ExhibitionSetAmbientLightColorAction | ExhibitionSetCeilingColorAction | ExhibitionSetEverythingAction | ExhibitionSetFloorColorAction | ExhibitionSetFloorTextureAction | ExhibitionSetHeightAction | ExhibitionSetImageAction | ExhibitionSetLengthAction | ExhibitionSetMainWallColorAction | ExhibitionSetMoodinessAction | ExhibitionSetWideWallColorAction | ExhibitionSetWidthAction;

export type ExhibitionImageScopedAction = ExhibitionImageCustomPositionEnablementAction | ExhibitionImageCustomPositionSetXAction | ExhibitionImageCustomPositionSetYAction | ExhibitionImageSetCustomFrameEnablementAction | ExhibitionImageSetCustomFrameHeightAction | ExhibitionImageSetCustomFrameWidthAction | ExhibitionImageSetMatteColorAction | ExhibitionImageSetMatteWeightEnablementAction | ExhibitionImageSetMatteWeightValue;

export type ExhibitionDispatchAction = ExhibitionImageScopedAction | ExhibitionScopedAction;
