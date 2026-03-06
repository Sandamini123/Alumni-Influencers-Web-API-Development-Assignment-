import { Layout, Typography } from "antd";

const { Content } = Layout;
const { Title } = Typography;

const AuthLayout = ({ children, title }) => {
  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#ff4d4f,#fa8c16,#eb2f96)"
      }}
    >
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <div
          style={{
            width: 420,
            padding: 40,
            background: "white",
            borderRadius: 10,
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
          }}
        >
          <Title level={3} style={{ textAlign: "center" }}>
            {title}
          </Title>

          {children}
        </div>
      </Content>
    </Layout>
  );
};

export default AuthLayout;