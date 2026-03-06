import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

const Login = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log(values);

    // TODO: call login API here
    message.success("Login API ready");

  };

  return (
    <AuthLayout title="Login">

      <Form layout="vertical" onFinish={onFinish}>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true }]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true }]}
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
          Don't have account? <Link to="/register">Register</Link>
        </div>

      </Form>

    </AuthLayout>
  );
};

export default Login;