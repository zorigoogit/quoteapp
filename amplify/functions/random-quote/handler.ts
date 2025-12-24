import type { Handler } from "aws-lambda";
import type { Schema } from "../../data/resource";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";
import { env } from "$amplify/env/random-quote";

// Configure Amplify in Lambda using generated env + config
const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);
Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

export const handler: Handler = async (event) => {
  const category =
    (event as any)?.queryStringParameters?.category ||
    (event as any)?.arguments?.category ||
    null;

  // List quotes (optionally filter by category)
  const { data: quotes, errors } = await client.models.Quote.list({
    filter: category ? { category: { eq: category } } : undefined,
    limit: 200,
  });

  if (errors?.length) {
    return { statusCode: 500, body: JSON.stringify({ message: "Query failed", errors }) };
  }

  const items = quotes ?? [];
  if (!items.length) {
    return { statusCode: 404, body: JSON.stringify({ message: "No quotes found" }) };
  }

  const pick = items[Math.floor(Math.random() * items.length)];
  return {
    statusCode: 200,
    body: JSON.stringify({
      text: pick.text,
      author: pick.author ?? "Unknown",
      category: pick.category ?? "",
    }),
  };
};
