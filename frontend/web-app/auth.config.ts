import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import { loginSchema } from "./app/lib/schemas/loginSchema"
import { getUserByEmail } from "./app/actions/authActions";
import { compare } from "bcryptjs";

export default {
    providers: [
        Credentials({
            name: 'credentials',
            async authorize(creds) {
              const validated = loginSchema.safeParse(creds);
      
              if (validated.success) {
                const { email, password } = validated.data;
                const user = await getUserByEmail(email);
      
                if (!user || !user.passwordHas || !(await compare(password, user.passwordHas))) return null;
      
                return user;
              }
      
              return null;
            }
          })
        ],
} satisfies NextAuthConfig