import { Form, Input, Button, message } from "antd";
import AuthLayout from "../components/AuthLayout";

const ResetPassword = () => {

  const onFinish = (values) => {
    console.log(values);

    // reset password API
    message.success("Password reset success");
  };

  return (
    <AuthLayout title="Reset Password">

      <Form layout="vertical" onFinish={onFinish}>

        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="otp" label="OTP" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="newPassword" label="New Password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>

        <Button type="primary" block htmlType="submit">
          Reset Password
        </Button>

      </Form>

    </AuthLayout>
  );
};

export default ResetPassword;