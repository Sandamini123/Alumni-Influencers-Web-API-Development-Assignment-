import React, { useEffect, useState } from "react";
import { Card, Table, Button, message, Modal, Input, Form, Typography, Spin } from "antd";

const { Title } = Typography;

const ADMIN_API = "http://localhost:4000/api/admin/api-keys";

const Admin = () => {
  const [apiKeys, setApiKeys] = useState([]); // always an array
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const token = localStorage.getItem("token");

  // Fetch all API keys
  const fetchKeys = async () => {
    setLoading(true);
    try {
      const res = await fetch(ADMIN_API, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      // Ensure apiKeys is always an array
      if (Array.isArray(data)) {
        setApiKeys(data);
      } else if (data) {
        setApiKeys([data]);
      } else {
        setApiKeys([]);
      }
    } catch (err) {
      message.error("Failed to fetch API keys");
      setApiKeys([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  // Create new API key
  const createKey = async (values) => {
    try {
      const res = await fetch(ADMIN_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create API key");

      message.success("API key created");
      setIsModalVisible(false);
      form.resetFields();
      fetchKeys();
    } catch (err) {
      message.error(err.message);
    }
  };

  // Revoke API key
  const revokeKey = async (id) => {
    try {
      const res = await fetch(`${ADMIN_API}/${id}/revoke`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "text/plain",
        },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error("Failed to revoke key");
      message.success("API key revoked");
      fetchKeys();
    } catch (err) {
      message.error(err.message);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Scopes", dataIndex: "scopes", key: "scopes" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button danger type="primary" onClick={() => revokeKey(record.id)}>
          Revoke
        </Button>
      ),
    },
  ];

  if (loading) return <Spin size="large" style={{ display: "block", margin: "50px auto" }} />;

  return (
    <div style={{ maxWidth: 1000, margin: "auto" }}>
      <Card
        title={<Title level={3} style={{ color: "#FF7F50" }}>Admin API Keys</Title>}
        style={{ marginBottom: 20, borderTop: "5px solid #FF7F50" }}
      >
        <Button
          type="primary"
          style={{ backgroundColor: "#FF69B4", borderColor: "#FF69B4", marginBottom: 20 }}
          onClick={() => setIsModalVisible(true)}
        >
          Create New API Key
        </Button>

        {/* Ensure dataSource is always an array */}
        <Table columns={columns} dataSource={apiKeys || []} rowKey="id" />
      </Card>

      <Modal
        title="Create API Key"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={createKey}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="scopes"
            label="Scopes"
            rules={[{ required: true, message: "Please enter scopes" }]}
          >
            <Input placeholder="e.g. PUBLIC_READ" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: "#FF69B4", borderColor: "#FF69B4" }}
            >
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Admin;