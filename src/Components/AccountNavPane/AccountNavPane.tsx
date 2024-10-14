import React from "react";
import type { Theme, DividerOwnProps } from "@mui/material";
import { Stack, Divider, styled } from "@mui/material";
import { AccountCircleIcon, GroupsIcon, PhotoCameraBackIcon, ImageIcon, SchoolIcon, LockIcon } from "../../Imports/Icons";
import useAppUser from "../../Hooks/useAppUser";
import AccountNavSection from "./AccountNavSection";
import type { AppUser, NavPaneLinkDefinition } from "../../index";

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

interface ColoredDividerProps extends DividerOwnProps {
    theme: Theme;
}

const ColoredDivider = styled(Divider, {
    shouldForwardProp: () => true
})(({ theme }: ColoredDividerProps) => ({
    borderImage: `linear-gradient(180deg, ${theme.palette.neutral.main} 0%, ${theme.palette.neutral.translucent} 100%) 1`,
    borderWidth: "0px",
    borderStyle: "solid"
}));

const AccountNavPane = (): React.JSX.Element => {
    const appUser = useAppUser() as AppUser;

    return (
        <Stack
            direction="column"
            sx={{ gridArea: "sidebar", backgroundColor: "#222", height: "100%", color: "white", overflowY: "auto" }}
        >
            <AccountNavSection
                linkDefinitions={navLinks}
                sectionTitle="Account"
            />

            {appUser.is_admin_or_collection_manager
                ? (
                    <>
                        <ColoredDivider />

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
                        <ColoredDivider />

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

export default AccountNavPane;
