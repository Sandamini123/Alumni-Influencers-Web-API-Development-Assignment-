import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization header is not needed on login, token comes after login
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

      message.success("Login Successful");

      // Save token to localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Redirect to dashboard
      navigate("/dashboard/todaysWinner");
    } catch (error) {
      console.error("Login error:", error);
      message.error("Login failed. Please try again.");
    }
  };

  return (
    <AuthLayout title="Login">
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>

        <Button type="primary" block htmlType="submit">
          Login
        </Button>

        <div style={{ marginTop: 10 }}>
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>

        <div style={{ marginTop: 10 }}>
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </Form>
    </AuthLayout>
  );
};

export default Login;