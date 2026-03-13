import React from "react";
import {
  Form,
  Input,
  Button,
  message,
  Card,
  Typography,
  Space,
} from "antd";
import {
  MailOutlined,
  LockOutlined,
  UserAddOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

const Register = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        message.error(data.message || "Registration failed");
        return;
      }

      message.success(data.message || "Registered successfully! OTP sent to email.");
      navigate("/verify-email");
    } catch (error) {
      console.error("Registration error:", error);
      message.error("Registration failed. Please try again.");
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
              Create Account
            </Title>
            <Text type="secondary">
              Join the Alumni Influencer Platform
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
            Register using your university email address to create your alumni
            profile and participate in the featured alumni bidding platform.
          </Paragraph>
        </div>

        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            label="University Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              size="large"
              prefix={<MailOutlined style={{ color: "#8c8c8c" }} />}
              placeholder="Enter your university email"
              style={{ borderRadius: 10, height: 46 }}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter your password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined style={{ color: "#8c8c8c" }} />}
              placeholder="Create a strong password"
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
              Use your official university email. After registration, an OTP
              will be sent to verify your account.
            </span>
          </div>

          <Button
            type="primary"
            block
            htmlType="submit"
            size="large"
            icon={<UserAddOutlined />}
            style={{
              height: 46,
              borderRadius: 10,
              fontWeight: 600,
            }}
          >
            Register
          </Button>

          <div
            style={{
              marginTop: 20,
              textAlign: "center",
              color: "#595959",
            }}
          >
            Already have an account? <Link to="/">Login</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;