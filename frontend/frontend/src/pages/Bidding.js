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
  Tag,
  Alert,
} from "antd";
import {
  DollarOutlined,
  TrophyOutlined,
  RiseOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const API_BASE = "http://localhost:4000/api/bidding";

const Bidding = () => {
  const [amount, setAmount] = useState(0);
  const [limits, setLimits] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bidLoading, setBidLoading] = useState(false);
  const [attendLoading, setAttendLoading] = useState(false);
  const [bidStatus, setBidStatus] = useState(null);

  const token = localStorage.getItem("token");

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

      setBidStatus(data.status || null);

      if (data.status === "WINNING") {
        message.success("You are currently WINNING the bid!");
      } else if (data.status === "LOSING") {
        message.warning(
          "Bid placed successfully, but you are currently LOSING. Increase your bid."
        );
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

  const attendEvent = async () => {
    try {
      setAttendLoading(true);

      const res = await fetch(`${API_BASE}/event-attended`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to register event");

      message.success("Event attendance recorded! Extra bidding chance unlocked.");
      fetchLimits();
    } catch (err) {
      console.error(err);
      message.error("Failed to record event attendance");
    } finally {
      setAttendLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <Card
        style={{
          borderRadius: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          border: "1px solid #f0f0f0",
          marginBottom: 24,
        }}
        bodyStyle={{ padding: 24 }}
      >
        <Space align="start" size="middle">
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "linear-gradient(135deg, #1677ff, #69b1ff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 28,
              boxShadow: "0 10px 24px rgba(22,119,255,0.2)",
            }}
          >
            <DollarOutlined />
          </div>

          <div>
            <Title level={3} style={{ margin: 0 }}>
              Daily Alumni Bidding
            </Title>
            <Text type="secondary">
              Place a blind bid to compete for the Featured Alumni spotlight
            </Text>
          </div>
        </Space>

        <div
          style={{
            marginTop: 20,
            padding: 16,
            borderRadius: 14,
            background: "#fafafa",
            border: "1px solid #f0f0f0",
          }}
        >
          <Paragraph style={{ margin: 0, color: "#595959" }}>
            This is a blind bidding system. You cannot view the highest bid amount.
            After placing your bid, the system only tells you whether you are
            currently winning or losing.
          </Paragraph>
        </div>
      </Card>

      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Card
            style={{ borderRadius: 18, boxShadow: "0 6px 18px rgba(0,0,0,0.04)" }}
          >
            <Statistic
              title="Monthly Wins"
              value={limits?.wins || 0}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            style={{ borderRadius: 18, boxShadow: "0 6px 18px rgba(0,0,0,0.04)" }}
          >
            <Statistic
              title="Remaining Slots"
              value={limits?.remaining || 0}
              prefix={<RiseOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            style={{ borderRadius: 18, boxShadow: "0 6px 18px rgba(0,0,0,0.04)" }}
          >
            <Statistic
              title="Max Allowed"
              value={limits?.maxWins || 3}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card
        style={{
          borderRadius: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          border: "1px solid #f0f0f0",
          marginBottom: 24,
        }}
        bodyStyle={{ padding: 24 }}
      >
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Title level={4} style={{ marginBottom: 6 }}>
              Alumni Event Bonus
            </Title>
            <Text type="secondary">
              Attend one university alumni event this month to unlock a 4th winning
              opportunity.
            </Text>

            <div style={{ marginTop: 14 }}>
              {limits?.attendedEvent ? (
                <Tag color="green" icon={<CheckCircleOutlined />}>
                  Event Attendance Recorded
                </Tag>
              ) : (
                <Tag color="gold">Not Marked Yet</Tag>
              )}
            </div>
          </Col>

          <Col xs={24} md={8} style={{ textAlign: "right" }}>
            <Button
              type="primary"
              size="large"
              loading={attendLoading}
              onClick={attendEvent}
              disabled={limits?.attendedEvent}
              style={{
                borderRadius: 10,
                fontWeight: 600,
              }}
            >
              Mark Event Attended
            </Button>
          </Col>
        </Row>
      </Card>

      <Card
        title="Place Your Blind Bid"
        style={{
          borderRadius: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          border: "1px solid #f0f0f0",
        }}
        bodyStyle={{ padding: 24 }}
      >
        {bidStatus && (
          <Alert
            style={{ marginBottom: 20, borderRadius: 12 }}
            type={bidStatus === "WINNING" ? "success" : "warning"}
            showIcon
            message={
              bidStatus === "WINNING"
                ? "You are currently winning this bidding round."
                : "You are currently losing this bidding round."
            }
          />
        )}

        <Text type="secondary">
          Submit your bid amount below. If you already have a bid for today,
          you may only update it by increasing the value.
        </Text>

        <Divider />

        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={10}>
            <InputNumber
              min={1}
              size="large"
              style={{ width: "100%", borderRadius: 10 }}
              placeholder="Enter bid amount (£)"
              value={amount}
              onChange={(value) => setAmount(value)}
            />
          </Col>

          <Col xs={24} md={8}>
            <Button
              type="primary"
              size="large"
              loading={bidLoading}
              onClick={placeBid}
              block
              icon={<DollarOutlined />}
              style={{
                borderRadius: 10,
                fontWeight: 600,
              }}
            >
              Place Bid
            </Button>
          </Col>
        </Row>

        <div
          style={{
            marginTop: 20,
            padding: 14,
            borderRadius: 12,
            background: "#fafafa",
            border: "1px solid #f0f0f0",
          }}
        >
          <Text type="secondary">
            Tip: The system never reveals the current highest bid. You only receive
            feedback on whether your latest bid is winning or losing.
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Bidding;