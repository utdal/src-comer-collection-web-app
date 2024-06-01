import React from "react";
import type { ReactElementLike } from "prop-types";
import useAppUser from "../../Hooks/useAppUser";
import { FullPageMessage } from "../FullPageMessage";
import { LockIcon } from "../../Imports/Icons.js";
import RequirePermanentPassword from "./RequirePermanentPassword";
import type { AppUser } from "../../index.js";

const RequireAdmin = ({ component, allowCollectionManager }: {
    readonly component: Readonly<ReactElementLike>;
    readonly allowCollectionManager?: boolean;
}): React.JSX.Element => {
    const appUser = useAppUser() as AppUser;
    return appUser.is_admin || (appUser.is_collection_manager && (allowCollectionManager === true))
        ? (
            <RequirePermanentPassword component={component} />
        )
        : (
            <FullPageMessage
                Icon={LockIcon as React.FunctionComponent}
                buttonDestination="/Account/Profile"
                buttonText="Return to Profile"
                message="Insufficient Privileges"
            />
        );
};

export default RequireAdmin;
