import React, { useEffect, useState } from "react";
import { Card, InputNumber, Button, message, Table, Spin, Typography } from "antd";

const { Title } = Typography;

const BIDDING_API = "http://localhost:4000/api/bidding/bid";
const LIMITS_API = "http://localhost:4000/api/bidding/limits";
const EVENT_API = "http://localhost:4000/api/bidding/event-attended";

const Bidding = () => {
  const [amount, setAmount] = useState(0);
  const [limits, setLimits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  const token = localStorage.getItem("token");

  // Fetch limits on mount
  useEffect(() => {
    fetch(LIMITS_API, {
      method: "GET",
      headers: {
        "Content-Type": "text/plain",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setLimits(data);
        setLoading(false);
      })
      .catch(() => {
        message.error("Failed to load bidding limits");
        setLoading(false);
      });
  }, [token]);

  const placeBid = async () => {
    if (amount <= 0) return message.warning("Enter a valid bid amount");

    try {
      const res = await fetch(BIDDING_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to place bid");

      message.success("Bid placed successfully");

      // Update bidding history
      setHistory((prev) => [...prev, { key: prev.length + 1, amount }]);
      setAmount(0);

    } catch (err) {
      message.error(err.message);
    }
  };

  const attendEvent = async () => {
    try {
      const res = await fetch(EVENT_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to mark event attended");
      message.success("Event attended recorded");
    } catch (err) {
      message.error(err.message);
    }
  };

  if (loading) return <Spin size="large" />;

  const columns = [
    {
      title: "Bid #",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amt) => `$${amt.toLocaleString()}`,
    },
  ];

  return (
    <div style={{ maxWidth: 800, margin: "auto" }}>
      <Card
        title={<Title level={3} style={{ color: "#FF7F50" }}>Place Your Bid</Title>}
        style={{ marginBottom: 20, borderTop: "5px solid #FF7F50" }} // orange accent
      >
        <InputNumber
          min={0}
          value={amount}
          onChange={setAmount}
          style={{ width: "60%", marginRight: 10 }}
        />
        <Button type="primary" style={{ backgroundColor: "#FF1493", borderColor: "#FF1493" }} onClick={placeBid}>
          Submit Bid
        </Button>
      </Card>

      {limits && (
        <Card
          title={<Title level={4} style={{ color: "#FF4500" }}>Your Bidding Limits</Title>}
          style={{ marginBottom: 20, borderTop: "5px solid #FF4500" }}
        >
          <p>Maximum allowed bid: ${limits.amount?.toLocaleString()}</p>
        </Card>
      )}

      <Card
        title={<Title level={4} style={{ color: "#FF69B4" }}>Bidding History</Title>}
        style={{ borderTop: "5px solid #FF69B4" }} // pink accent
      >
        <Table columns={columns} dataSource={history} pagination={false} />
        <Button
          style={{ marginTop: 10, backgroundColor: "#FF69B4", borderColor: "#FF69B4", color: "white" }}
          onClick={attendEvent}
        >
          Mark Event Attended
        </Button>
      </Card>
    </div>
  );
};

export default Bidding;