import React from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, Typography, Stack, Divider, styled } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@emotion/react";


import { AccountCircleIcon, GroupsIcon, PhotoCameraBackIcon, ImageIcon, SchoolIcon, LockIcon } from "../IconImports";
import { useAppUser } from "../App/AppUser";
import { useTitle } from "../App/AppTitle";


const navLinks = [
  {
      title: "Profile",
      icon: <AccountCircleIcon fontSize="large"/>,
      link: "/Account/Profile",
      requirePermanentPassword: true
  },
  {
      title: "My Exhibitions",
      icon: <PhotoCameraBackIcon fontSize="large"/>,
      link: "/Account/MyExhibitions",
      requirePermanentPassword: true
  },
  {
      title: "Change Password",
      icon: <LockIcon fontSize="large"/>,
      link: "/Account/ChangePassword"
  },
]
  
const adminNavLinks = [
  {
      title: "User Management",
      icon: <GroupsIcon fontSize="large"/>,
      link: "/Account/UserManagement",
      requirePermanentPassword: true
  },
  {
      title: "Exhibition Management",
      icon: <PhotoCameraBackIcon fontSize="large"/>,
      link: "/Account/ExhibitionManagement",
      requirePermanentPassword: true
  },
  {
      title: "Image Management",
      icon: <ImageIcon fontSize="large"/>,
      link: "/Account/ImageManagement",
      requirePermanentPassword: true
  },
  {
      title: "Course Management",
      icon: <SchoolIcon fontSize="large"/>,
      link: "/Account/CourseManagement",
      requirePermanentPassword: true
  }

]



const AccountNav = (props) => {

  const navigate = useNavigate();
  const location = useLocation();

  const { selectedNavItem, setSelectedNavItem } = props;

  const [appUser, setAppUser] = useAppUser();

  const theme = useTheme();


  return (
    <Stack direction="column" sx={{ backgroundColor: "#222", height: "100%", color: "white" }}>
      <Typography variant="h5" alignSelf="center" paddingTop="10px">Account</Typography>
        <List>
          {navLinks.map((item) => (
            <ListItemButton disabled={Boolean(item.requirePermanentPassword && appUser.password_change_required)}
              key={item.title}
              onClick={() => {
                setSelectedNavItem(item.title);
                navigate(item.link)
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
              <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.title}
                sx={{
                  textDecoration:
                    location.pathname === item.link ? "underline" : "none",
                }}
              />
            </ListItemButton>
          ))}
        </List>
        {appUser.is_admin && (
          <>
          <Divider />
          <Typography variant="h5" alignSelf="center" paddingTop="10px">Admin</Typography>
          <List>
            {adminNavLinks.map((item) => (
              <ListItemButton disabled={Boolean(item.requirePermanentPassword && appUser.password_change_required)}
                key={item.title}
                onClick={() => {
                  setSelectedNavItem(item.title);
                  navigate(item.link)
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
                <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.title}
                  sx={{
                    textDecoration:
                      location.pathname === item.link ? "underline" : "none",
                  }}
                />
              </ListItemButton>
            ))}
          </List>
          </>
        )}
      </Stack>
  );
}

export default AccountNav;
