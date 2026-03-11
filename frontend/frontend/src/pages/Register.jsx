import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

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
        // API returned an error
        message.error(data.message || "Registration failed");
        return;
      }

      message.success(data.message || "Registered successfully! OTP sent to email.");

      // Redirect to verify email page
      navigate("/verify-email");
    } catch (error) {
      console.error("Registration error:", error);
      message.error("Registration failed. Please try again.");
    }
  };

  return (
    <AuthLayout title="Register">
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please enter your password" },
            { min: 8, message: "Password must be at least 8 characters" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Button type="primary" block htmlType="submit">
          Register
        </Button>

        <div style={{ marginTop: 10 }}>
          Already have an account? <Link to="/">Login</Link>
        </div>
      </Form>
    </AuthLayout>
  );
};

export default Register;