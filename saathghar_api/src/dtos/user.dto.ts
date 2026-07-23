import { z } from "zod";
import { UserSchema } from "../types/user.types";

export const CreateUserDTO = UserSchema.pick({
    fullName: true, 
    email: true,
    username: true,
    password: true,
    phoneNumber: true
});
export type CreateUserDTO = z.infer<typeof CreateUserDTO>;

export const LoginUserDTO = UserSchema.pick({
    email: true,
    password: true
});
export type LoginUserDTO = z.infer<typeof LoginUserDTO>;