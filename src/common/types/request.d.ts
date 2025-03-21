import { UserEntity } from "src/modules/user/entity/user.entity";
import { DeepPartial } from "typeorm";

declare global {
  namespace Express {
    interface Request {
      user?: DeepPartial<UserEntity>;
    }
  }
}
