import { User } from "@/domain/entities/user";

export interface UserFindByEmailRepository {
  findByEmail: (email: string) => Promise<User | undefined>
}
