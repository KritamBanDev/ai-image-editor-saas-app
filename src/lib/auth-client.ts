import { createAuthClient } from "better-auth/react";
import { polarClient } from "@polar-sh/better-auth";

export const authClient = createAuthClient({
  plugins: [
    // @ts-expect-error Upstream type mismatch between better-auth and @polar-sh/better-auth plugin types.
    polarClient(),
  ],
});