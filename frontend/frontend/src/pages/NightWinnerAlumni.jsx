import React, { useEffect, useState } from "react";
import {
  Card,
  Spin,
  Alert,
  Avatar,
  Typography,
  Button,
  Space,
  Tag,
  Row,
  Col,
  Divider,
} from "antd";
import {
  CrownOutlined,
  TrophyOutlined,
  LinkedinOutlined,
  CalendarOutlined,
  DollarOutlined,
  UserOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title, Paragraph, Text } = Typography;

const NightWinnerAlumni = () => {
  const [loading, setLoading] = useState(true);
  const [featured, setFeatured] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchFeatured = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        "http://localhost:4000/api/alumni/featured/today",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFeatured(res.data.featured);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load featured alumnus"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 720, margin: "40px auto" }}>
        <Alert
          message="Featured Alumni Unavailable"
          description={error}
          type="warning"
          showIcon
          style={{ borderRadius: 14 }}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto", padding: "0 16px" }}>
      {/* Top Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 24,
        }}
      >
        <Button
          type="primary"
          icon={<LoginOutlined />}
          onClick={() => navigate("/login")}
          style={{
            borderRadius: 12,
            fontWeight: 600,
            background: "linear-gradient(135deg, #69b1ff 0%, #4a90e2 100%)",
            border: "none",
          }}
        >
          Login
        </Button>
      </div>

      {/* Featured Card */}
      <Card
        style={{
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
          border: "none",
        }}
        bodyStyle={{ padding: 0 }}
      >
        {/* Header Gradient */}
        <div
          style={{
            background: "linear-gradient(135deg, #a9c7f1 0%, #69b1ff 100%)",
            padding: "36px 32px",
            color: "#fff",
          }}
        >
          <Space align="center" size="middle">
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: "rgba(255,255,255,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
              }}
            >
              <CrownOutlined />
            </div>

            <div>
              <Title level={2} style={{ color: "#fff", margin: 0 }}>
                Featured Alumni of the Day
              </Title>
              <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 16 }}>
                Today’s spotlight winner from the alumni bidding platform
              </Text>
            </div>
          </Space>
        </div>

        {/* Body */}
        <div style={{ padding: "32px" }}>
          <Row gutter={[32, 32]} align="middle">
            {/* Avatar + Badge */}
            <Col xs={24} md={8} style={{ textAlign: "center" }}>
              <Avatar
                size={160}
                src={featured?.avatar_url}
                icon={<UserOutlined />}
                style={{
                  boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
                  border: "4px solid #fff",
                  backgroundColor: "#1677ff",
                }}
              />
              <div style={{ marginTop: 18 }}>
                <Tag
                  color="gold"
                  icon={<TrophyOutlined />}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 24,
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  Winner
                </Tag>
              </div>
            </Col>

            {/* Details */}
            <Col xs={24} md={16}>
              <Title level={2} style={{ marginBottom: 8 }}>
                {featured?.full_name}
              </Title>

              <Paragraph style={{ fontSize: 16, color: "#595959" }}>
                {featured?.bio || "No biography available."}
              </Paragraph>

              <Divider />

              {/* Stats */}
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Card
                    size="small"
                    style={{
                      borderRadius: 14,
                      background: "#fafafa",
                      border: "1px solid #f0f0f0",
                    }}
                  >
                    <Space>
                      <DollarOutlined style={{ color: "#1677ff" }} />
                      <div>
                        <Text type="secondary">Winning Bid</Text>
                        <br />
                        <Text strong style={{ fontSize: 18 }}>
                          £{featured?.bid_amount}
                        </Text>
                      </div>
                    </Space>
                  </Card>
                </Col>

                <Col xs={24} sm={12}>
                  <Card
                    size="small"
                    style={{
                      borderRadius: 14,
                      background: "#fafafa",
                      border: "1px solid #f0f0f0",
                    }}
                  >
                    <Space>
                      <CalendarOutlined style={{ color: "#1677ff" }} />
                      <div>
                        <Text type="secondary">Featured Date</Text>
                        <br />
                        <Text strong style={{ fontSize: 16 }}>
                          {featured?.featured_date}
                        </Text>
                      </div>
                    </Space>
                  </Card>
                </Col>
              </Row>

              {/* LinkedIn Button */}
              <div style={{ marginTop: 24 }}>
                {featured?.linkedin_url ? (
                  <Button
                    type="primary"
                    icon={<LinkedinOutlined />}
                    size="large"
                    href={featured.linkedin_url}
                    target="_blank"
                    style={{
                      borderRadius: 12,
                      fontWeight: 600,
                      background: "linear-gradient(135deg, #69b1ff 0%, #4a90e2 100%)",
                      border: "none",
                    }}
                  >
                    View LinkedIn Profile
                  </Button>
                ) : (
                  <Text type="secondary">No LinkedIn profile available.</Text>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
};

export default NightWinnerAlumni;