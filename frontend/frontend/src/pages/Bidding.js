import React, { useEffect, useState } from "react";
import {
  Card,
  InputNumber,
  Button,
  Typography,
  message,
  Row,
  Col,
  Statistic,
  Space,
  Divider,
  Spin,
} from "antd";

const { Title, Text } = Typography;

const API_BASE = "http://localhost:4000/api/bidding";

const Bidding = () => {
  const [amount, setAmount] = useState(0);
  const [limits, setLimits] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bidLoading, setBidLoading] = useState(false);

  const token = localStorage.getItem("token");

  // 🔹 Fetch monthly bidding limits
  const fetchLimits = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/limits`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to load limits");

      const data = await res.json();
      setLimits(data);

    } catch (err) {
      console.error(err);
      message.error("Failed to load bidding limits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLimits();
  }, []);

  // 🔹 Place Bid
const placeBid = async () => {
  if (!amount || amount <= 0) {
    message.warning("Enter a valid bid amount");
    return;
  }

  try {
    setBidLoading(true);

    const res = await fetch(`${API_BASE}/bid`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Bid failed");

    // ✅ Win / Lose feedback
    if (data.status === "WINNING") {
      message.success("You are currently WINNING the bid!");
    } else if (data.status === "LOSING") {
      message.warning("Bid placed successfully! but You are currently LOSING. Increase your bid.");
    } else {
      message.success("Bid placed successfully!");
    }

    fetchLimits();

  } catch (err) {
    console.error(err);
    message.error(err.message);
  } finally {
    setBidLoading(false);
  }
};

  // 🔹 Event Attended
  const attendEvent = async () => {
    try {
      const res = await fetch(`${API_BASE}/event-attended`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to register event");

      message.success("Event attendance recorded! Extra bid unlocked.");

      fetchLimits();

    } catch (err) {
      console.error(err);
      message.error("Failed to record event attendance");
    }
  };

  if (loading)
    return <Spin size="large" style={{ display: "block", margin: "80px auto" }} />;

  return (
    <div style={{ maxWidth: 900, margin: "auto" }}>
      <Title level={3}>Daily Alumni Bidding</Title>

      {/* Limits Section */}
      <Card style={{ marginBottom: 20 }}>
        <Row gutter={20}>
          <Col span={8}>
            <Statistic
              title="Monthly Wins"
              value={limits?.wins || 0}
            />
          </Col>

          <Col span={8}>
            <Statistic
              title="Remaining Slots"
              value={limits?.remaining || 0}
            />
          </Col>

          <Col span={8}>
            <Statistic
              title="Max Allowed"
              value={limits?.max || 3}
            />
          </Col>
        </Row>

        <Divider />

        <Space>
          <Text>Attended Alumni Event?</Text>
          <Button type="primary" onClick={attendEvent}>
            Mark Event Attended
          </Button>
        </Space>
      </Card>

      {/* Bid Section */}
      <Card title="Place Your Blind Bid">
        <Text type="secondary">
          You cannot see the highest bid. The system will tell you if you're winning or losing.
        </Text>

        <Divider />

        <Space size="large">
          <InputNumber
            min={1}
            style={{ width: 200 }}
            placeholder="Enter bid amount (£)"
            value={amount}
            onChange={(value) => setAmount(value)}
          />

          <Button
            type="primary"
            size="large"
            loading={bidLoading}
            onClick={placeBid}
          >
            Place Bid
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default Bidding;