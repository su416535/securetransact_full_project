import React, { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { Button } from "./button";

export default function PlaidLinkButton({ userId }) {
  const [linkToken, setLinkToken] = useState(null);

  useEffect(() => {
    const createLinkToken = async () => {
      try {
        const res = await fetch("/api/create-link-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId })
        });
        const data = await res.json();
        setLinkToken(data.link_token);
      } catch (err) {
        console.error("Failed to fetch link token", err);
      }
    };

    if (userId) {
      createLinkToken();
    }
  }, [userId]);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
      await fetch("/api/exchange-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_token, user_id: userId })
      });
      alert("Plaid linked successfully!");
    },
  });

  if (!userId) {
    return <div>Please log in to link your bank account.</div>;
  }

  if (!linkToken) {
    return <div>Loading Plaid...</div>;
  }

  return (
    <Button onClick={() => open()} disabled={!ready}>
      {ready ? "Link Your Bank" : "Initializing..."}
    </Button>
  );
}
