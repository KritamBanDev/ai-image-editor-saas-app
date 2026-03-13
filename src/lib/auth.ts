import { betterAuth, type BetterAuthPlugin } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { Polar } from "@polar-sh/sdk";
import { env } from "~/env";
import { checkout, polar, portal, webhooks } from "@polar-sh/better-auth";
import { db } from "~/server/db";

const polarAccessToken = env.POLAR_ACCESS_TOKEN;
const polarWebhookSecret = env.POLAR_WEBHOOK_SECRET;

const billingPlugins: BetterAuthPlugin[] = [];

if (polarAccessToken && polarWebhookSecret) {
  const polarBillingPlugin = polar({
    client: new Polar({
      accessToken: polarAccessToken,
      server: "sandbox",
    }),
    createCustomerOnSignUp: true,
    use: [
      checkout({
        products: [
          {
            productId: "43585d8b-a849-485c-a359-7773d185d8ef",
            slug: "small",
          },
          {
            productId: "ba9b9094-3f22-4933-86f2-7d74cdcfbf52",
            slug: "medium",
          },
          {
            productId: "2c7735ec-5758-4c6a-8907-da76dced50b6",
            slug: "large",
          },
        ],
        successUrl: "/dashboard",
        authenticatedUsersOnly: true,
      }),
      portal(),
      webhooks({
        secret: polarWebhookSecret,
        onOrderPaid: async (order) => {
          const externalCustomerId = order.data.customer.externalId;

          if (!externalCustomerId) {
            console.error("No external customer ID found.");
            throw new Error("No external customer id found.");
          }

          const productId = order.data.productId;

          let creditsToAdd = 0;

          switch (productId) {
            case "43585d8b-a849-485c-a359-7773d185d8ef":
              creditsToAdd = 50;
              break;
            case "ba9b9094-3f22-4933-86f2-7d74cdcfbf52":
              creditsToAdd = 200;
              break;
            case "2c7735ec-5758-4c6a-8907-da76dced50b6":
              creditsToAdd = 400;
              break;
          }

          if (creditsToAdd <= 0) {
            console.warn("Ignoring unknown or non-credit product:", productId);
            return;
          }

          const updated = await db.user.updateMany({
            where: { id: externalCustomerId },
            data: {
              credit: {
                increment: creditsToAdd,
              },
            },
          });

          if (updated.count === 0) {
            console.error(
              "Could not apply credits because no matching user was found:",
              externalCustomerId,
            );
          }
        },
      }),
    ],
  });

  // Compatibility bridge for current upstream plugin typing mismatch.
  billingPlugins.push(
    polarBillingPlugin as unknown as BetterAuthPlugin,
  );
}

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: billingPlugins,
});