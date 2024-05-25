import React from "react";
import PropTypes from "prop-types";
import { useAppUser } from "../../ContextProviders/AppUser.js";
import { FullPageMessage } from "../FullPageMessage.js";
import { LockIcon } from "../../Imports/Icons.js";
import RequirePermanentPassword from "./RequirePermanentPassword.js";

const RequireAdmin = ({ component, allowCollectionManager }) => {
    const [appUser] = useAppUser();
    return appUser?.is_admin || (appUser?.is_collection_manager && allowCollectionManager)
        ? (
            <RequirePermanentPassword component={component} />
        )
        : (
            <FullPageMessage
                Icon={LockIcon}
                buttonDestination="/Account/Profile"
                buttonText="Return to Profile"
                message="Insufficient Privileges"
            />
        );
};

RequireAdmin.propTypes = {
    allowCollectionManager: PropTypes.bool,
    component: PropTypes.node
};

export default RequireAdmin;
