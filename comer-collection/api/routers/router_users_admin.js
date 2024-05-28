import { Router } from "express";
import { activateUser, changeUserAccess, createUser, deactivateUser, deleteUser, getUser, listUsers, resetUserPassword, updateUser } from "../controllers/users.js";

const router = Router();

router.get("/:userId(\\d+)", getUser);
router.get("/", listUsers);
router.post("/", createUser);
router.put("/:userId(\\d+)", updateUser);
router.delete("/:userId(\\d+)", deleteUser);

router.put("/:userId(\\d+)/deactivate", deactivateUser);
router.put("/:userId(\\d+)/activate", activateUser);

router.put("/:userId(\\d+)/access", changeUserAccess);

router.put("/:userId(\\d+)/password", resetUserPassword);

export default router;
