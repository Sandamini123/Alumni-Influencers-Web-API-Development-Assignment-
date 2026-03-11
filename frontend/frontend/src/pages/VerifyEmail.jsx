import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

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
        // API returned an error
        message.error(data.message || "OTP verification failed");
        return;
      }

      message.success(data.message || "Email verified successfully!");

      // Redirect to login page
      navigate("/");
    } catch (error) {
      console.error("Verify email error:", error);
      message.error("Verification failed. Please try again.");
    }
  };

  return (
    <AuthLayout title="Verify Email">
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="otp"
          label="OTP"
          rules={[
            { required: true, message: "Please enter the OTP" },
            { len: 6, message: "OTP must be 6 digits" },
          ]}
        >
          <Input maxLength={6} />
        </Form.Item>

        <Button type="primary" block htmlType="submit">
          Verify Email
        </Button>
      </Form>
    </AuthLayout>
  );
};

export default VerifyEmail;