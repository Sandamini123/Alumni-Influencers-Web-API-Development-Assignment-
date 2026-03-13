import React from "react";
import { Form, Input, Button, message, Card, Typography, Space } from "antd";
import {
  MailOutlined,
  SafetyCertificateOutlined,
  LockOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation, Link } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const emailFromState = location.state?.email || "";

  const onFinish = async (values) => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/auth/password/reset",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
            otp: values.otp,
            newPassword: values.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        message.error(data.message || "Failed to reset password");
        return;
      }

      message.success(data.message || "Password reset successful");
      navigate("/");
    } catch (error) {
      console.error("Reset Password error:", error);
      message.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
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
          maxWidth: 480,
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
              Reset Password
            </Title>
            <Text type="secondary">
              Enter your email, OTP, and a new password
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
            Use the OTP sent to your email to securely reset your account
            password.
          </Paragraph>
        </div>

        <Form
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          initialValues={{ email: emailFromState }}
        >
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

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: "Please enter a new password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined style={{ color: "#8c8c8c" }} />}
              placeholder="Enter new password"
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
              For security, use the latest OTP sent to your email and choose a
              strong new password.
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
            Reset Password
          </Button>

          <div
            style={{
              marginTop: 20,
              textAlign: "center",
              color: "#595959",
            }}
          >
            Back to <Link to="/">Login</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPassword;