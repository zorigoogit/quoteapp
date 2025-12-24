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
    <div className="app">
      <div className="main">
        <div className="card">
          <div className="quoteMark">“</div>

          <div className="quoteText">
            {loading ? "Loading..." : quote?.text}
          </div>

          <div className="author">
            {quote?.author ? `${quote.author} -` : ""}
          </div>

          <div className="actions">
            <button className="btn" onClick={() => loadRandomQuote()}>
              New Quote
            </button>
          </div>
        </div>
      </div>

      <div className="footer">
        <div className="footerLeft">
          <div>Sydney Polytechnic Institute</div>
          <div>Master of Data Science</div>
        </div>

        <div className="footerRight" style={{ textAlign: "right" }}>
          <div>MDS615 - Cloud Computing and Application Development</div>
          <div>StudentID: SPI240562</div>
        </div>
      </div>
    </div>
  );
}
