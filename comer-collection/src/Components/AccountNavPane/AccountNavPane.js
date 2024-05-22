import React from "react";
import { Stack, Divider } from "@mui/material";
import { useTheme } from "@emotion/react";
import { AccountCircleIcon, GroupsIcon, PhotoCameraBackIcon, ImageIcon, SchoolIcon, LockIcon } from "../../Imports/Icons.js";
import { useAppUser } from "../../ContextProviders/AppUser.js";
import { AccountNavSection } from "./AccountNavSection.js";
import PropTypes from "prop-types";

export const navLinkDefinitionShape = {
    title: PropTypes.string.isRequired,
    displayText: PropTypes.string,
    Icon: PropTypes.elementType.isRequired,
    link: PropTypes.string.isRequired,
    requirePermanentPassword: PropTypes.bool
};

const navLinks = [
    {
        title: "Profile",
        Icon: AccountCircleIcon,
        link: "/Account/Profile",
        requirePermanentPassword: true
    },
    {
        title: "My Exhibitions",
        Icon: PhotoCameraBackIcon,
        link: "/Account/MyExhibitions",
        requirePermanentPassword: true
    },
    {
        title: "Change Password",
        Icon: LockIcon,
        link: "/Account/ChangePassword"
    }
];

const collectionManagerNavLinks = [
    {
        displayText: "Images",
        title: "Image Management",
        Icon: ImageIcon,
        link: "/Account/Admin/Images",
        requirePermanentPassword: true
    }
];

const adminNavLinks = [
    {
        displayText: "Users",
        title: "User Management",
        Icon: GroupsIcon,
        link: "/Account/Admin/Users",
        requirePermanentPassword: true
    },
    {
        displayText: "Exhibitions",
        title: "Exhibition Management",
        Icon: PhotoCameraBackIcon,
        link: "/Account/Admin/Exhibitions",
        requirePermanentPassword: true
    },
    {
        displayText: "Courses",
        title: "Course Management",
        Icon: SchoolIcon,
        link: "/Account/Admin/Courses",
        requirePermanentPassword: true
    }

];

export const AccountNavPane = () => {
    const [appUser] = useAppUser();
    const theme = useTheme();

    return (
        <Stack
            direction="column"
            sx={{ backgroundColor: "#222", height: "100%", color: "white", overflowY: "auto" }}
        >
            <AccountNavSection
                linkDefinitions={navLinks}
                sectionTitle="Account"
            />

            {appUser.is_admin_or_collection_manager
                ? (
                    <>
                        <Divider sx={{
                            borderColor: theme.palette.grey.main,
                            opacity: 0.5
                        }}
                        />

                        <AccountNavSection
                            linkDefinitions={collectionManagerNavLinks}
                            sectionTitle="Collection"
                        />
                    </>
                )
                : null}

            {appUser.is_admin
                ? (
                    <>
                        <Divider sx={{
                            borderColor: theme.palette.grey.main,
                            opacity: 0.5
                        }}
                        />

                        <AccountNavSection
                            linkDefinitions={adminNavLinks}
                            sectionTitle="Administration"
                        />
                    </>
                )
                : null}
        </Stack>
    );
};
