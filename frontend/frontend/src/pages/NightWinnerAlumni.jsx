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
} from "@ant-design/icons";
import axios from "axios";

const { Title, Paragraph, Text } = Typography;

const NightWinnerAlumni = () => {
  const [loading, setLoading] = useState(true);
  const [featured, setFeatured] = useState(null);
  const [error, setError] = useState(null);

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
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <Card
        style={{
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
          border: "1px solid #f0f0f0",
        }}
        bodyStyle={{ padding: 0 }}
      >
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
                fontSize: 30,
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

        <div style={{ padding: "32px" }}>
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} md={8} style={{ textAlign: "center" }}>
              <Avatar
                size={140}
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
                    padding: "6px 14px",
                    borderRadius: 20,
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  Winner
                </Tag>
              </div>
            </Col>

            <Col xs={24} md={16}>
              <Title level={2} style={{ marginBottom: 8 }}>
                {featured?.full_name}
              </Title>

              <Paragraph style={{ fontSize: 16, color: "#595959" }}>
                {featured?.bio || "No biography available."}
              </Paragraph>

              <Divider />

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

              <div style={{ marginTop: 24 }}>
                {featured?.linkedin_url ? (
                  <Button
                    type="primary"
                    icon={<LinkedinOutlined />}
                    size="large"
                    href={featured.linkedin_url}
                    target="_blank"
                    style={{
                      borderRadius: 10,
                      fontWeight: 600,
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