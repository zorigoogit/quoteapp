import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";

const client = generateClient();

export default function App() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadRandomQuote(category = null) {
    setLoading(true);

    const { data, errors } = await client.models.Quote.list({
      filter: category ? { category: { eq: category } } : undefined,
      limit: 200,
    });

    if (errors?.length) {
      console.error(errors);
      setQuote({ text: "Failed to load quotes.", author: "" });
      setLoading(false);
      return;
    }

    const items = data ?? [];
    if (!items.length) {
      setQuote({ text: "No quotes yet. Add some to DynamoDB!", author: "" });
      setLoading(false);
      return;
    }

    const pick = items[Math.floor(Math.random() * items.length)];
    setQuote({ text: pick.text, author: pick.author || "Unknown", category: pick.category || "" });
    setLoading(false);
  }

  useEffect(() => {
    loadRandomQuote();
  }, []);

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1>Daily Quote App</h1>

      <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 12, marginTop: 16 }}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <p style={{ fontSize: 22, lineHeight: 1.4 }}>"{quote?.text}"</p>
            <p style={{ opacity: 0.8, marginTop: 8 }}>
              — {quote?.author} {quote?.category ? `(${quote.category})` : ""}
            </p>
          </>
        )}
      </div>

      <button onClick={() => loadRandomQuote()} style={{ marginTop: 16, padding: "10px 14px" }}>
        New Quote
      </button>
    </div>
  );
}
