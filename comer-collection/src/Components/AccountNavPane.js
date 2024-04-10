import React from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, Typography, Stack, Divider } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { AccountCircleIcon, GroupsIcon, PhotoCameraBackIcon, ImageIcon, SchoolIcon, LockIcon } from "../Imports/Icons.js";
import { useAppUser } from "../ContextProviders/AppUser.js";
import { useAccountNav } from "../ContextProviders/AccountNavProvider.js";
import PropTypes from "prop-types";

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
    },
];

const collectionManagerNavLinks = [
    {
        displayText: "Images",
        title: "Image Management",
        Icon: ImageIcon,
        link: "/Account/ImageManagement",
        requirePermanentPassword: true
    }
];

const adminNavLinks = [
    {
        displayText: "Users",
        title: "User Management",
        Icon: GroupsIcon,
        link: "/Account/UserManagement",
        requirePermanentPassword: true
    },
    {
        displayText: "Exhibitions",
        title: "Exhibition Management",
        Icon: PhotoCameraBackIcon,
        link: "/Account/ExhibitionManagement",
        requirePermanentPassword: true
    },
    {
        displayText: "Courses",
        title: "Course Management",
        Icon: SchoolIcon,
        link: "/Account/CourseManagement",
        requirePermanentPassword: true
    }

];


const AccountNavSection = ({ sectionTitle, linkDefinitions }) => {
    const [selectedNavItem, setSelectedNavItem] = useAccountNav();

    const navigate = useNavigate();
    const location = useLocation();
    const [appUser] = useAppUser();
    const theme = useTheme();
    return (
        <>
            <Typography variant="h5" alignSelf="center" paddingTop="10px">{sectionTitle}</Typography>
            <List>
                {linkDefinitions.map((item) => (
                    <ListItemButton disabled={Boolean(item.requirePermanentPassword && appUser.pw_change_required)}
                        key={item.title}
                        onClick={() => {
                            setSelectedNavItem(item.title);
                            navigate(item.link);
                        }}
                        sx={{
                            backgroundColor:
                                selectedNavItem == item.title
                                    ? theme.palette.secondary.main
                                    : "unset",
                            "&:hover": {
                                backgroundColor:
                                    selectedNavItem == item.title
                                        ? theme.palette.secondary.main
                                        : "#444",
                            },
                        }}
                    >
                        <ListItemIcon sx={{ color: "white" }}>
                            <item.Icon fontSize="large" />
                        </ListItemIcon>
                        <ListItemText
                            primary={item.displayText ?? item.title}
                            sx={{
                                textDecoration:
                                    location.pathname === item.link ? "underline" : "none",
                            }}
                        />
                    </ListItemButton>
                ))}
            </List>
        </>
    );
};

AccountNavSection.propTypes = {
    sectionTitle: PropTypes.string,
    linkDefinitions: PropTypes.arrayOf(PropTypes.objectOf({
        title: PropTypes.string.isRequired,
        link: PropTypes.string.isRequired
    })).isRequired
};



export const AccountNavPane = () => {

    const [appUser] = useAppUser();

    return (
        <Stack direction="column" sx={{ backgroundColor: "#222", height: "100%", color: "white" }}>
            <AccountNavSection sectionTitle={"Account"} linkDefinitions={navLinks} />
            {appUser.is_admin_or_collection_manager && (
                <>
                    <Divider />
                    <AccountNavSection sectionTitle={"Collection"} linkDefinitions={collectionManagerNavLinks} />
                </>
            )}
            {appUser.is_admin && (
                <>
                    <Divider />
                    <AccountNavSection sectionTitle={"Administration"} linkDefinitions={adminNavLinks }/>
                </>
            )}
        </Stack>
    );
};
