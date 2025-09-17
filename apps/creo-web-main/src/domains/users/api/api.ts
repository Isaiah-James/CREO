import { Option } from "@/shared/classes/option";
import APIRequest from "@/shared/utils/api";
import { User } from "@/types/api/user";

export default class UsersAPI {

    public static Current = class {
        public static async Get(): Promise<Option<User>> {
            return await APIRequest(`/users/@me`);
        }
    }
}