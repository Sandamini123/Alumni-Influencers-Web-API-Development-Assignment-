import { Form, Input, Button, message } from "antd";
import AuthLayout from "../components/AuthLayout";

const ForgotPassword = () => {

  const onFinish = (values) => {
    console.log(values);

    // password request API
    message.success("Reset OTP sent");
  };

  return (
    <AuthLayout title="Forgot Password">

      <Form layout="vertical" onFinish={onFinish}>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Button type="primary" block htmlType="submit">
          Send Reset OTP
        </Button>

      </Form>

    </AuthLayout>
  );
};

export default ForgotPassword;