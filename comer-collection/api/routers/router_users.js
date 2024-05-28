import { Router } from "express";
import { activateUser, changeUserAccess, createUser, deactivateUser, deleteUser, getUser, listUsers, resetUserPassword, updateUser } from "../controllers/users.js";

const routerUsersAdmin = Router();

routerUsersAdmin.get("/:userId(\\d+)", getUser);
routerUsersAdmin.get("/", listUsers);
routerUsersAdmin.post("/", createUser);
routerUsersAdmin.put("/:userId(\\d+)", updateUser);
routerUsersAdmin.delete("/:userId(\\d+)", deleteUser);

routerUsersAdmin.put("/:userId(\\d+)/deactivate", deactivateUser);
routerUsersAdmin.put("/:userId(\\d+)/activate", activateUser);

routerUsersAdmin.put("/:userId(\\d+)/access", changeUserAccess);

routerUsersAdmin.put("/:userId(\\d+)/password", resetUserPassword);

export { routerUsersAdmin };
