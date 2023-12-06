export const blankExhibitionData = {
    "main": {
        "exhibition_name": "Placeholder Exhibition Name",
        "curator": "Placeholder Curator Name",
        "date_created": "Placeholder Date Created"
    },
    "appearance": {
        "main_wall_color": "#ffffff",
        "side_wall_color": "#ffffff",
        "floor_color": "#ffffff",
        "ceiling_color": "#ffffff",
        "floor_texture": "parquet_wood.jpg",
        "moodiness": "moody dark",
        "ambient_light_color": "#ffffff"
    },
    "size": {
        "length_ft": 25,
        "width_ft": 25,
        "height_ft": 10
    },
    images: []
};

export const getBlankExhibitionImageData = (image_id) => {
    return {
        image_id,
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
            color: '#ffffff',
            weighted: false,
            weighted_value: 0
        },
        frame: {
            custom: false,
            width: 0,
            height: 0,
            color: '#000000'
        },
        light: {
            intensity: 0,
            color: '#ffffff'
        },
        metadata: {
            title: "",
            artist: "",
            description: "",
            year: 0,
            medium: "",
            additionalInformation: null,
            direction: 1
        }
    }
}

export const getImageStateById = (exhibitionData, image_id) => {
    for(const i of (exhibitionData.images ?? [])) {
        if(i.image_id == image_id)
            return i;
    }
    return null;
}


const width_ft_min = 10;
const height_ft_min = 4;
const length_ft_min = 10;


export const exhibitionEditReducer = (exhibitionData, action) => {
    switch (action.scope) {
        case "exhibition":
            
            switch (action.type) {
                case "set_everything":
                    return {
                        ...action.newExhibition
                    }
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
                            length_ft: action.newValue >= length_ft_min ? action.newValue : length_ft_min
                        }
                    };
                case "set_width":
                    return {
                        ...exhibitionData,
                        size: {
                            ...exhibitionData.size,
                            width_ft: action.newValue >= width_ft_min ? action.newValue : width_ft_min
                        }
                    };
                case "set_height":
                    return {
                        ...exhibitionData,
                        size: {
                            ...exhibitionData.size,
                            height_ft: action.newValue >= height_ft_min ? action.newValue : height_ft_min
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
                            return image.image_id != action.image_id;
                        })
                    };
                case "set_images":
                    return {
                        ...exhibitionData,
                        images: action.newImages
                    };
                default:
                    console.log("Unrecognized exhibition edit action: ", action.type, action);
                    return exhibitionData;
            }
        
        case "image":
            if(!action.image_id) {
                console.log(`image ID ${action.image_id} is not valid`);
                return exhibitionData;
            }
            return {
                ...exhibitionData,
                images: exhibitionData.images.map((image) => {
                    if(image.image_id != action.image_id)
                        return image;

                    switch (action.type) {
                        case 'set_position_custom_x':
                            return {
                                ...image,
                                position: {
                                    ...image.position,
                                    custom_x: action.newValue
                                }
                            }
                    
                        case 'set_position_custom_y':
                            return {
                                ...image,
                                position: {
                                    ...image.position,
                                    custom_y: action.newValue
                                }
                            }
                    
                        case 'set_position_custom_enabled':
                            return {
                                ...image,
                                position: {
                                    ...image.position,
                                    custom_position: action.isEnabled
                                }
                            }
                    
                        case 'set_matte_color':
                            return {
                                ...image,
                                matte: {
                                    ...image.matte,
                                    color: action.newColor
                                }
                            }
                    
                        case 'set_matte_weight_enabled':
                            return {
                                ...image,
                                matte: {
                                    ...image.matte,
                                    weighted: action.isEnabled
                                }
                            }
                    
                        case 'set_matte_weight_value':
                            return {
                                ...image,
                                matte: {
                                    ...image.matte,
                                    weighted_value: action.newValue
                                }
                            }
                    
                        case 'set_frame_custom_enabled':
                            return {
                                ...image,
                                frame: {
                                    ...image.frame,
                                    custom: action.isEnabled
                                }
                            }
                    
                        case 'set_frame_width':
                            return {
                                ...image,
                                frame: {
                                    ...image.frame,
                                    width: action.newValue
                                }
                            }
                    
                        case 'set_frame_height':
                            return {
                                ...image,
                                frame: {
                                    ...image.frame,
                                    height: action.newValue
                                }
                            }
                    
                        case 'set_frame_color':
                            return {
                                ...image,
                                frame: {
                                    ...image.frame,
                                    color: action.newColor
                                }
                            }
                    
                        case 'set_light_intensity':
                            return {
                                ...image,
                                light: {
                                    ...image.light,
                                    intensity: action.newValue
                                }
                            }
                    
                        case 'set_light_color':
                            return {
                                ...image,
                                light: {
                                    ...image.light,
                                    color: action.newColor
                                }
                            }
                    
                        case 'set_description':
                            return {
                                ...image,
                                metadata: {
                                    ...image.metadata,
                                    description: action.newValue
                                }
                            }
                    
                        case 'set_additional_information':
                            return {
                                ...image,
                                metadata: {
                                    ...image.metadata,
                                    additional_information: action.newValue
                                }
                            }
                    
                        case 'set_direction':
                            return {
                                ...image,
                                metadata: {
                                    ...image.metadata,
                                    direction: action.newValue
                                }
                            }
                    
                        default:
                            console.log("Unrecognized image edit action: ", action.type, action);
                            return exhibitionData;

                    }
                    
                })
            }
    
        default:
            console.log("Unrecognized exhibition edit scope: ", action.scope, action);
            return exhibitionData;
    }
};
