import { Form, Input, Button, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Pre-fill email if passed via navigate state
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

      // ✅ Redirect to login page
      navigate("/");

    } catch (error) {
      console.error("Reset Password error:", error);
      message.error("Something went wrong. Please try again.");
    }
  };

  return (
    <AuthLayout title="Reset Password">
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ email: emailFromState }}
      >
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

        <Form.Item
          name="otp"
          label="OTP"
          rules={[{ required: true, message: "Please enter the OTP" }]}
        >
          <Input placeholder="Enter OTP" />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[{ required: true, message: "Please enter a new password" }]}
        >
          <Input.Password placeholder="Enter new password" />
        </Form.Item>

        <Button type="primary" block htmlType="submit">
          Reset Password
        </Button>
      </Form>
    </AuthLayout>
  );
};

export default ResetPassword;