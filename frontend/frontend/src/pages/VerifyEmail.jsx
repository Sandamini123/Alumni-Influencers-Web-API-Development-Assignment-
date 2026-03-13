import React from "react";
import { Form, Input, Button, message, Card, Typography, Space } from "antd";
import {
  MailOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

const VerifyEmail = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await fetch("http://localhost:4000/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          otp: values.otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        message.error(data.message || "OTP verification failed");
        return;
      }

      message.success(data.message || "Email verified successfully!");
      navigate("/");
    } catch (error) {
      console.error("Verify email error:", error);
      message.error("Verification failed. Please try again.");
    }
  };

  return (
    <div
      style={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background:
          "linear-gradient(135deg, #f0f5ff 0%, #ffffff 50%, #e6f4ff 100%)",
      }}
    >
      <Card
        style={{
          width: "100%",
          height: "auto",
          maxWidth: 460,
          borderRadius: 20,
          boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
          border: "1px solid #f0f0f0",
        }}
        styles={{
          body: {
            padding: "36px 32px",
          },
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          

          <Space direction="vertical" size={4}>
            <Title level={2} style={{ margin: 0 }}>
              Verify Your Email
            </Title>
            <Text type="secondary">
              Enter your email and the 6-digit OTP sent to your inbox
            </Text>
          </Space>
        </div>

        <div
          style={{
            marginBottom: 24,
            padding: 16,
            borderRadius: 12,
            background: "#fafafa",
            border: "1px solid #f0f0f0",
          }}
        >
          <Paragraph style={{ margin: 0, textAlign: "center", color: "#595959" }}>
            Complete your account verification to activate your alumni profile
            and access the platform.
          </Paragraph>
        </div>

        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              size="large"
              prefix={<MailOutlined style={{ color: "#8c8c8c" }} />}
              placeholder="Enter your email"
              style={{ borderRadius: 10, height: 46 }}
            />
          </Form.Item>

          <Form.Item
            name="otp"
            label="OTP Code"
            rules={[
              { required: true, message: "Please enter the OTP" },
              { len: 6, message: "OTP must be 6 digits" },
            ]}
          >
            <Input
              size="large"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              style={{
                borderRadius: 10,
                height: 46,
                textAlign: "center",
                letterSpacing: "6px",
                fontSize: "18px",
                fontWeight: 600,
              }}
            />
          </Form.Item>

          <div
            style={{
              marginBottom: 20,
              padding: 12,
              borderRadius: 10,
              background: "#f6ffed",
              border: "1px solid #b7eb8f",
              color: "#389e0d",
              fontSize: 13,
              display: "flex",
              gap: 8,
              alignItems: "flex-start",
            }}
          >
            <SafetyCertificateOutlined style={{ marginTop: 2 }} />
            <span>
              Use the latest OTP sent to your email. OTP codes are time-limited
              for security.
            </span>
          </div>

          <Button
            type="primary"
            block
            htmlType="submit"
            size="large"
            icon={<CheckCircleOutlined />}
            style={{
              height: 46,
              borderRadius: 10,
              fontWeight: 600,
            }}
          >
            Verify Email
          </Button>

          <div
            style={{
              marginTop: 20,
              textAlign: "center",
              color: "#595959",
            }}
          >
            Already verified? <Link to="/">Go to Login</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default VerifyEmail;