import React, { useState } from "react";
import { Layout, Menu, theme, Typography, Button, Avatar, Space } from "antd";
import {
  UserOutlined,
  DollarOutlined,
  LogoutOutlined,
  CrownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      try {
        await fetch("http://localhost:4000/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.error("Logout API error:", err);
      }

      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  const menuItems = [
    {
      key: "/adminDashboard/admin",
      icon: <UserOutlined />,
      label: <Link to="/adminDashboard/admin">Admin</Link>,
    },
    // {
    //   key: "/adminDashboard/featuredDashboard",
    //   icon: <DollarOutlined />,
    //   label: <Link to="/adminDashboard/featuredDashboard">Features</Link>,
    // }
    
  ];

  return (
    <Layout style={{ minHeight: "90vh", background: "#f5f7fb" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={250}
        style={{
          boxShadow: "2px 0 12px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            height: 72,
            margin: "16px 12px 8px",
            borderRadius: 16,
            background: "linear-gradient(135deg, #1677ff, #69b1ff)",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            padding: collapsed ? 0 : "0 16px",
            color: "#fff",
            gap: 12,
            boxShadow: "0 10px 24px rgba(22,119,255,0.28)",
          }}
        >
          <Avatar
            size={collapsed ? 40 : 44}
            icon={<TrophyOutlined />}
            style={{
              background: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          />
          {!collapsed && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.2 }}>
                Alumni Hub
              </div>
            </div>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{
            marginTop: 8,
            borderInlineEnd: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: 12,
            right: 12,
          }}
        >
          <Button
            danger
            icon={<LogoutOutlined />}
            block
            size="large"
            onClick={handleLogout}
            style={{
              borderRadius: 12,
              height: 44,
              fontWeight: 600,
            }}
          >
            {!collapsed && "Logout"}
          </Button>
        </div>
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "0 20px",
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
          }}
        >
          <Space size="middle">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: 18,
                width: 42,
                height: 42,
              }}
            />
           
          </Space>

          
        </Header>

        <Content style={{ margin: "20px" }}>
          <div
            style={{
              minHeight: "calc(100vh - 120px)",
              padding: 20,
              background: colorBgContainer,
              borderRadius: borderRadiusLG || 16,
              boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;