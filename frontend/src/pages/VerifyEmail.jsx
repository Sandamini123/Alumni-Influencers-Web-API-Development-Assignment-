import { Form, Input, Button, message } from "antd";
import AuthLayout from "../components/AuthLayout";

const VerifyEmail = () => {

  const onFinish = (values) => {
    console.log(values);

    // verify API
    message.success("Verify API ready");
  };

  return (
    <AuthLayout title="Verify Email">

      <Form layout="vertical" onFinish={onFinish}>

        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="otp" label="OTP" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Button type="primary" block htmlType="submit">
          Verify Email
        </Button>

      </Form>

    </AuthLayout>
  );
};

export default VerifyEmail;