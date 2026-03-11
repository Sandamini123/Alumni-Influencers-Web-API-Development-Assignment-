import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

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

      // ✅ Redirect to Reset Password page
      navigate("/reset-password", { state: { email: values.email } });

    } catch (error) {
      console.error("Forgot Password error:", error);
      message.error("Something went wrong. Please try again.");
    }
  };

  return (
    <AuthLayout title="Forgot Password">
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Button type="primary" block htmlType="submit">
          Send Reset OTP
        </Button>
      </Form>
    </AuthLayout>
  );
};

export default ForgotPassword;