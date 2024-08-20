import type { ExhibitionDispatchAction, ExhibitionData, ExhibitionImageData } from "./ExhibitionDispatchActionTypes";

export const blankExhibitionData: ExhibitionData = {
    appearance: {
        main_wall_color: "#ffffff",
        side_wall_color: "#ffffff",
        floor_color: "#ffffff",
        ceiling_color: "#ffffff",
        floor_texture: "parquet_wood.jpg",
        moodiness: "moody dark",
        ambient_light_color: "#ffffff"
    },
    size: {
        length_ft: 25,
        width_ft: 25,
        height_ft: 10
    },
    images: []
};

export const getBlankExhibitionImageData = (imageId: number): ExhibitionImageData => {
    return {
        image_id: imageId,
        position: {
            custom_position: false,
            custom_x: 0,
            custom_y: 0
        },
        size: {
            width: 0,
            height: 0
        },
        matte: {
            color: "#ffffff",
            weighted: false,
            weighted_value: 0
        },
        frame: {
            custom: false,
            width: 0,
            height: 0,
            color: "#000000"
        },
        light: {
            intensity: 0,
            color: "#ffffff"
        },
        metadata: {
            title: "",
            artist: "",
            description: "",
            year: 0,
            medium: "",
            additional_information: null,
            direction: 1
        }
    };
};

export const getImageStateById = (exhibitionData: ExhibitionData, imageId: number): ExhibitionImageData => {
    for (const i of (exhibitionData.images)) {
        if (i.image_id === imageId) {
            return i;
        }
    }
    throw new Error(`getImageStateById: imageId ${imageId} does not exist within the exhibition data`);
};

const widthFtMin = 10;
const heightFtMin = 4;
const lengthFtMin = 10;

export const exhibitionEditReducer = (exhibitionData: ExhibitionData, action: ExhibitionDispatchAction): ExhibitionData => {
    switch (action.scope) {
    case "exhibition":

        switch (action.type) {
        case "set_everything":
            return {
                ...action.newExhibition
            };
        case "set_main_wall_color":
            return {
                ...exhibitionData,
                appearance: {
                    ...exhibitionData.appearance,
                    main_wall_color: action.newColor
                }
            };
        case "set_side_wall_color":
            return {
                ...exhibitionData,
                appearance: {
                    ...exhibitionData.appearance,
                    side_wall_color: action.newColor
                }
            };
        case "set_floor_color":
            return {
                ...exhibitionData,
                appearance: {
                    ...exhibitionData.appearance,
                    floor_color: action.newColor
                }
            };
        case "set_ceiling_color":
            return {
                ...exhibitionData,
                appearance: {
                    ...exhibitionData.appearance,
                    ceiling_color: action.newColor
                }
            };
        case "set_floor_texture":
            return {
                ...exhibitionData,
                appearance: {
                    ...exhibitionData.appearance,
                    floor_texture: action.newTexture
                }
            };
        case "set_moodiness":
            return {
                ...exhibitionData,
                appearance: {
                    ...exhibitionData.appearance,
                    moodiness: action.newMoodiness
                }
            };
        case "set_ambient_light_color":
            return {
                ...exhibitionData,
                appearance: {
                    ...exhibitionData.appearance,
                    ambient_light_color: action.newColor
                }
            };
        case "set_length":
            return {
                ...exhibitionData,
                size: {
                    ...exhibitionData.size,
                    length_ft: action.newValue >= lengthFtMin ? action.newValue : lengthFtMin
                }
            };
        case "set_width":
            return {
                ...exhibitionData,
                size: {
                    ...exhibitionData.size,
                    width_ft: action.newValue >= widthFtMin ? action.newValue : widthFtMin
                }
            };
        case "set_height":
            return {
                ...exhibitionData,
                size: {
                    ...exhibitionData.size,
                    height_ft: action.newValue >= heightFtMin ? action.newValue : heightFtMin
                }
            };
        case "add_image":
            return {
                ...exhibitionData,
                images: [
                    ...exhibitionData.images,
                    getBlankExhibitionImageData(action.image_id)
                ]
            };
        case "remove_image":
            return {
                ...exhibitionData,
                images: exhibitionData.images.filter((image) => {
                    return image.image_id !== action.image_id;
                })
            };
        case "set_images":
            return {
                ...exhibitionData,
                images: action.newImages
            };
        default:
            return exhibitionData;
        }

    case "image":
        if (!action.image_id) {
            console.log(`image ID ${action.image_id} is not valid`);
            return exhibitionData;
        }
        return {
            ...exhibitionData,
            images: exhibitionData.images.map((imageData) => {
                if (imageData.image_id !== action.image_id) {
                    return imageData;
                }

                switch (action.type) {
                case "set_position_custom_x":
                    return {
                        ...imageData,
                        position: {
                            ...imageData.position,
                            custom_x: action.newValue
                        }
                    };

                case "set_position_custom_y":
                    return {
                        ...imageData,
                        position: {
                            ...imageData.position,
                            custom_y: action.newValue
                        }
                    };

                case "set_position_custom_enabled":
                    return {
                        ...imageData,
                        position: {
                            ...imageData.position,
                            custom_position: action.isEnabled
                        }
                    };

                case "set_matte_color":
                    return {
                        ...imageData,
                        matte: {
                            ...imageData.matte,
                            color: action.newColor
                        }
                    };

                case "set_matte_weight_enabled":
                    return {
                        ...imageData,
                        matte: {
                            ...imageData.matte,
                            weighted: action.isEnabled
                        }
                    };

                case "set_matte_weight_value":
                    return {
                        ...imageData,
                        matte: {
                            ...imageData.matte,
                            weighted_value: action.newValue
                        }
                    };

                case "set_frame_custom_enabled":
                    return {
                        ...imageData,
                        frame: {
                            ...imageData.frame,
                            custom: action.isEnabled
                        }
                    };

                case "set_frame_width":
                    return {
                        ...imageData,
                        frame: {
                            ...imageData.frame,
                            width: action.newValue
                        }
                    };

                case "set_frame_height":
                    return {
                        ...imageData,
                        frame: {
                            ...imageData.frame,
                            height: action.newValue
                        }
                    };

                case "set_frame_color":
                    return {
                        ...imageData,
                        frame: {
                            ...imageData.frame,
                            color: action.newColor
                        }
                    };

                case "set_light_intensity":
                    return {
                        ...imageData,
                        light: {
                            ...imageData.light,
                            intensity: action.newValue
                        }
                    };

                case "set_light_color":
                    return {
                        ...imageData,
                        light: {
                            ...imageData.light,
                            color: action.newColor
                        }
                    };

                case "set_description":
                    return {
                        ...imageData,
                        metadata: {
                            ...imageData.metadata,
                            description: action.newValue
                        }
                    };

                case "set_additional_information":
                    return {
                        ...imageData,
                        metadata: {
                            ...imageData.metadata,
                            additional_information: action.newValue
                        }
                    };

                case "set_direction":
                    return {
                        ...imageData,
                        metadata: {
                            ...imageData.metadata,
                            direction: action.newValue
                        }
                    };

                default:
                    return imageData;
                }
            })
        };

    default:
        return exhibitionData;
    }
};
