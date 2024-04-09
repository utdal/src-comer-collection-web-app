import { Exhibition } from "../Entities/Exhibition.js";
import { User } from "../Entities/User.js";
import { Association } from "./Association.js";

class UserExhibition extends Association {
    static url = null;
    static primary = User;
    static secondary = Exhibition;

    static singular = "exhibition";
    static plural = "exhibitions";

}

export { UserExhibition };