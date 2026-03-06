import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

const Register = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log(values);

    // TODO: register API
    message.success("Registration API ready");

    navigate("/verify-email");
  };

  return (
    <AuthLayout title="Register">

      <Form layout="vertical" onFinish={onFinish}>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>

        <Button type="primary" block htmlType="submit">
          Register
        </Button>

        <div style={{ marginTop: 10 }}>
          Already have account? <Link to="/">Login</Link>
        </div>

      </Form>

    </AuthLayout>
  );
};

export default Register;