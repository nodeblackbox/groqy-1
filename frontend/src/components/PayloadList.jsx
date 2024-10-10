// components/PayloadList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const PayloadList = () => {
  const [payloads, setPayloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayloads = async () => {
      try {
        const response = await axios.get("/api/payloads");
        setPayloads(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching payloads");
        setLoading(false);
      }
    };

    fetchPayloads();
  }, []);

  if (loading) return <p>Loading Payloads...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Payloads</h2>
      <ul>
        {payloads.map((payload) => (
          <li key={payload.id}>
            <h3>{payload.name}</h3>
            <p>{payload.description}</p>
            <p>Method: {payload.method}</p>
            <p>URL: {payload.url}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PayloadList;
