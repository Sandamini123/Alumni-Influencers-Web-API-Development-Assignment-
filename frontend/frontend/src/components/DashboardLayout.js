import React, { useState } from "react";
import { Layout, Menu, theme } from "antd";
import {
  UserOutlined,
  DollarOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // ✅ Logout handler
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token"); // get stored JWT

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:4000/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Logout failed", await response.json());
      }

      localStorage.removeItem("token"); // remove token from localStorage
      navigate("/"); // redirect to login page
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/login");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          style={{
            height: 32,
            margin: 16,
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Dashboard
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: <Link to="/dashboard/profile">Profile</Link>,
            },
            {
              key: "2",
              icon: <DollarOutlined />,
              label: <Link to="/dashboard/bidding">Bidding</Link>,
            },
            {
              key: "3",
              icon: <SettingOutlined />,
              label: <Link to="/dashboard/admin">Admin</Link>,
            },
            {
              key: "4",
              icon: <SettingOutlined />,
              label: <Link to="/dashboard/todaysWinner">Todays Winner</Link>,
            },
            {
              key: "5",
              icon: <LogoutOutlined />,
              label: (
                <span onClick={handleLogout} style={{ cursor: "pointer" }}>
                  Logout
                </span>
              ),
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "16px" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;