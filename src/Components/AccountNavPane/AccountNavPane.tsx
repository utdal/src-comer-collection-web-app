import React from "react";
import { Stack, Divider } from "@mui/material";
import { AccountCircleIcon, GroupsIcon, PhotoCameraBackIcon, ImageIcon, SchoolIcon, LockIcon } from "../../Imports/Icons.js";
import useAppUser from "../../Hooks/useAppUser.js";
import AccountNavSection from "./AccountNavSection.js";
import type { AppUser, NavPaneLinkDefinition } from "../../index.js";

const navLinks: NavPaneLinkDefinition[] = [
    {
        title: "Profile",
        Icon: AccountCircleIcon as React.ElementType,
        link: "/Account/Profile",
        requirePermanentPassword: true,
        displayText: "Profile"
    },
    {
        title: "My Exhibitions",
        Icon: PhotoCameraBackIcon as React.ElementType,
        link: "/Account/MyExhibitions",
        requirePermanentPassword: true,
        displayText: "My Exhibitions"
    },
    {
        title: "Change Password",
        Icon: LockIcon as React.ElementType,
        link: "/Account/ChangePassword",
        requirePermanentPassword: false,
        displayText: "Change Password"
    }
];

const collectionManagerNavLinks: NavPaneLinkDefinition[] = [
    {
        displayText: "Images",
        title: "Image Management",
        Icon: ImageIcon as React.ElementType,
        link: "/Account/Admin/Images",
        requirePermanentPassword: true
    }
];

const adminNavLinks: NavPaneLinkDefinition[] = [
    {
        displayText: "Users",
        title: "User Management",
        Icon: GroupsIcon as React.ElementType,
        link: "/Account/Admin/Users",
        requirePermanentPassword: true
    },
    {
        displayText: "Exhibitions",
        title: "Exhibition Management",
        Icon: PhotoCameraBackIcon as React.ElementType,
        link: "/Account/Admin/Exhibitions",
        requirePermanentPassword: true
    },
    {
        displayText: "Courses",
        title: "Course Management",
        Icon: SchoolIcon as React.ElementType,
        link: "/Account/Admin/Courses",
        requirePermanentPassword: true
    }

];

export const AccountNavPane = (): React.JSX.Element => {
    const appUser = useAppUser() as AppUser;

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
                        <Divider />

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
                        <Divider />

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
