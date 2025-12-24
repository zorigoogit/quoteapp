import { a, defineData, type ClientSchema } from "@aws-amplify/backend";
import { randomQuote } from "../functions/random-quote/resource";

const schema = a
  .schema({
    Quote: a.model({
      text: a.string().required(),
      author: a.string(),
      category: a.string(),
    })
    // Public read access via API key (no login)
    .authorization((allow) => [allow.publicApiKey()]),
  })
  // Allow the Lambda to call the GraphQL API (Query only)
  .authorization((allow) => [allow.resource(randomQuote).to(["query"])]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: { expiresInDays: 30 },
  },
});
