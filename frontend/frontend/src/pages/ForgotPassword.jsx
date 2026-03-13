import React from "react";
import { Form, Input, Button, message, Card, Typography, Space } from "antd";
import {
  MailOutlined,
  KeyOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

const ForgotPassword = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/auth/password/request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        message.error(data.message || "Failed to send reset OTP");
        return;
      }

      message.success(data.message || "Reset OTP sent successfully");

      navigate("/reset-password", { state: { email: values.email } });
    } catch (error) {
      console.error("Forgot Password error:", error);
      message.error("Something went wrong. Please try again.");
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
              Forgot Password
            </Title>
            <Text type="secondary">
              Enter your email to receive a password reset OTP
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
            We will send a secure OTP to your registered email address so you
            can reset your password.
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
              A 6-digit OTP will be sent to your email. Use it to reset your
              password securely.
            </span>
          </div>

          <Button
            type="primary"
            block
            htmlType="submit"
            size="large"
            icon={<KeyOutlined />}
            style={{
              height: 46,
              borderRadius: 10,
              fontWeight: 600,
            }}
          >
            Send Reset OTP
          </Button>

          <div
            style={{
              marginTop: 20,
              textAlign: "center",
              color: "#595959",
            }}
          >
            Remember your password? <Link to="/">Back to Login</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ForgotPassword;