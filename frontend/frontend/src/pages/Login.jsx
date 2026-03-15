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
  LoginOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
  try {
    const response = await fetch("http://localhost:4000/api/auth/login", {
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
      message.error(data.message || "Login failed");
      return;
    }

    // Save token
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    // Save role
    if (data.user?.role) {
      localStorage.setItem("role", data.user.role);
    }

    message.success("Login successful");

    // ⭐ Role-based navigation
    if (data.user?.role === "ADMIN") {
      navigate("/adminDashboard/admin");
    } else if (data.user?.role === "ALUMNI") {
      navigate("/dashboard/profile");
    } else {
      message.error("Unknown user role");
    }

  } catch (error) {
    console.error("Login error:", error);
    message.error("Login failed. Please try again.");
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
              Welcome Back
            </Title>
            <Text type="secondary">
              Sign in to the Alumni Influencer Platform
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
            Access your alumni profile, manage bidding activity, and view platform
            updates securely.
          </Paragraph>
        </div>

        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            label="Email Address"
            name="email"
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
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined style={{ color: "#8c8c8c" }} />}
              placeholder="Enter your password"
              style={{ borderRadius: 10, height: 46 }}
            />
          </Form.Item>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 20,
            }}
          >
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            icon={<LoginOutlined />}
            style={{
              height: 46,
              borderRadius: 10,
              fontWeight: 600,
            }}
          >
            Login
          </Button>

          <div
            style={{
              marginTop: 20,
              textAlign: "center",
              color: "#595959",
            }}
          >
            Don&apos;t have an account? <Link to="/register">Register</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;