import React, { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom'; // Import Route from react-router-dom
import AdminNav from './AccountNav';
import UserManagement from './Admin/UserManagement';
import ExhibitionList from './Admin/ExhibitionList';
import ImageManagement from './Admin/ImageManagement';
import ImageEdit from './Admin/ImageEdit';
import InviteForm from './Admin/InviteForm';
import Profile from './Profile';
import { Box } from '@mui/material';
import Unauthorized from '../ErrorPages/Unauthorized';
import ChangePassword from './ChangePassword';
import CourseManagement from './Admin/CourseManagement';


const Account = (props) => {

  const { appUser, setAppUser, 
    snackbarOpen, snackbarText, snackbarSeverity,
    setSnackbarOpen, setSnackbarText, setSnackbarSeverity
  } = props; 

  const [selectedNavItem, setSelectedNavItem] = useState("");

  return appUser && (
    <>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: '250px auto',
        gridTemplateAreas: `
          "sidebar main"
        `,
        height: "100%"
      }}>


        <AdminNav sx={{gridArea: 'sidebar'}} {...{appUser, selectedNavItem, setSelectedNavItem}} />
        
        <Box sx={{gridArea: 'main', position: 'relative', overflowY: "hidden", height: '100%'}}>
          
          <Routes>
            <Route index element={<Navigate to='Profile' replace />} />
            <Route path="Profile" element={<Profile {...{appUser, setAppUser, selectedNavItem, setSelectedNavItem}} />} />
            <Route path="ChangePassword" element={<ChangePassword {...{appUser, setAppUser, selectedNavItem, setSelectedNavItem}} />} />
            <Route path="UserManagement" element={<UserManagement {
              ...{appUser, setAppUser, selectedNavItem, setSelectedNavItem, 
                snackbarOpen, snackbarText, snackbarSeverity,
                setSnackbarOpen, setSnackbarText, setSnackbarSeverity
                }
              } />} />
            <Route path="ExhibitionList" element={<ExhibitionList {...{appUser, setAppUser, selectedNavItem, setSelectedNavItem}} />} />
            <Route path="ImageManagement" element={<ImageManagement {...{appUser, setAppUser, selectedNavItem, setSelectedNavItem}} />} />
            <Route path="CourseManagement" element={<CourseManagement {
              ...{appUser, setAppUser, selectedNavItem, setSelectedNavItem, 
                snackbarOpen, snackbarText, snackbarSeverity,
                setSnackbarOpen, setSnackbarText, setSnackbarSeverity}
              } />} />
            <Route path="Invite" user={appUser} element={<InviteForm {...{appUser, setAppUser, selectedNavItem, setSelectedNavItem}} />} />
            <Route path="ImageEdit/:id" user={appUser} element={<ImageEdit />} />

          </Routes>

        </Box>
      
      </Box>
    </>
  ) || !appUser && (
    <Unauthorized />
  );
}

export default Account;
