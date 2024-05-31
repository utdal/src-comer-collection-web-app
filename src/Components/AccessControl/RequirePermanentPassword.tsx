import React from "react";
import type { ReactElementLike } from "prop-types";
import PropTypes from "prop-types";
import { Navigate } from "react-router";
import { useAppUser } from "../../Hooks/useAppUser";
import type { AppUser } from "../../index.js";

const RequirePermanentPassword = ({ component }: {
    readonly component: Readonly<ReactElementLike>;
}): React.JSX.Element => {
    const appUser = useAppUser() as AppUser;
    return !appUser.pw_change_required
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
