import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router";
import { useAppUser } from "../../Hooks/useAppUser.js";

const RequirePermanentPassword = ({ component }) => {
    const appUser = useAppUser();
    return appUser?.pw_change_required === false
        ? component
        : (
            <Navigate
                replace
                to="/Account/ChangePassword"
            />
        );
};

RequirePermanentPassword.propTypes = {
    component: PropTypes.node
};

export default RequirePermanentPassword;
