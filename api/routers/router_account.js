import { Router } from "express";
import { changePassword, getCurrentUser, signIn } from "../controllers/users.js";

const routerAccountPublic = Router();
const routerAccountTempPw = Router();

routerAccountPublic.put("/signin", signIn);

routerAccountTempPw.get("/profile", getCurrentUser);
routerAccountTempPw.put("/password", changePassword);

export { routerAccountPublic, routerAccountTempPw };
