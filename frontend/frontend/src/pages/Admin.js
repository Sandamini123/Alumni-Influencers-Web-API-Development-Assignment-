import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  message,
  Modal,
  Input,
  Form,
  Typography,
  Spin,
  Space,
  Tag,
  Alert,
  Popconfirm,
  Row,
  Col,
} from "antd";
import {
  KeyOutlined,
  PlusOutlined,
  StopOutlined,
  SafetyCertificateOutlined,
  CopyOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const ADMIN_API = "http://localhost:4000/api/admin/api-keys";

const Admin = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [createdToken, setCreatedToken] = useState("");
  const [creating, setCreating] = useState(false);
  const [revokingId, setRevokingId] = useState(null);
  const [form] = Form.useForm();

  const token = localStorage.getItem("token");

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

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch API keys");
      }

      if (Array.isArray(data?.keys)) {
        setApiKeys(data.keys);
      } else if (Array.isArray(data)) {
        setApiKeys(data);
      } else {
        setApiKeys([]);
      }
    } catch (err) {
      message.error(err.message || "Failed to fetch API keys");
      setApiKeys([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const createKey = async (values) => {
    setCreating(true);
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

      if (!res.ok) {
        throw new Error(data.message || "Failed to create API key");
      }

      setCreatedToken(data.bearerToken || "");
      message.success("API key created successfully");
      form.resetFields();
      fetchKeys();
    } catch (err) {
      message.error(err.message || "Failed to create API key");
    } finally {
      setCreating(false);
    }
  };

  const revokeKey = async (id) => {
    setRevokingId(id);
    try {
      const res = await fetch(`${ADMIN_API}/${id}/revoke`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to revoke key");
      }

      message.success("API key revoked successfully");
      fetchKeys();
    } catch (err) {
      message.error(err.message || "Failed to revoke key");
    } finally {
      setRevokingId(null);
    }
  };

  const copyToken = async () => {
    try {
      await navigator.clipboard.writeText(createdToken);
      message.success("Bearer token copied");
    } catch {
      message.error("Failed to copy token");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Client Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Scopes",
      dataIndex: "scopes",
      key: "scopes",
      render: (scopes) => {
        const scopeList = typeof scopes === "string" ? scopes.split(",") : [];
        return (
          <Space wrap>
            {scopeList.map((scope, index) => (
              <Tag color="blue" key={index}>
                {scope.trim()}
              </Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) =>
        record.revoked_at ? (
          <Tag color="red">Revoked</Tag>
        ) : (
          <Tag color="green">Active</Tag>
        ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (value) => value || "-",
    },
    {
      title: "Last Used",
      dataIndex: "last_used_at",
      key: "last_used_at",
      render: (value) => value || "-",
    },
    {
      title: "Actions",
      key: "actions",
      width: 140,
      render: (_, record) => (
        <Popconfirm
          title="Revoke API key"
          description="Are you sure you want to revoke this key?"
          onConfirm={() => revokeKey(record.id)}
          okText="Yes"
          cancelText="No"
          disabled={!!record.revoked_at}
        >
          <Button
            danger
            type="primary"
            icon={<StopOutlined />}
            loading={revokingId === record.id}
            disabled={!!record.revoked_at}
          >
            Revoke
          </Button>
        </Popconfirm>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <Card
        style={{
          borderRadius: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          border: "1px solid #f0f0f0",
        }}
        bodyStyle={{ padding: 24 }}
      >
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Space align="start">
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 16,
                  background: "linear-gradient(135deg, #1677ff, #69b1ff)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 24,
                  boxShadow: "0 8px 20px rgba(22,119,255,0.2)",
                }}
              >
                <KeyOutlined />
              </div>

              <div>
                <Title level={3} style={{ margin: 0 }}>
                  Admin API Keys
                </Title>
                <Text type="secondary">
                  Manage client access tokens for AR apps and external integrations
                </Text>
              </div>
            </Space>
          </Col>

          <Col xs={24} md={8} style={{ textAlign: "right" }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => {
                setCreatedToken("");
                setIsModalVisible(true);
              }}
              style={{
                borderRadius: 10,
                fontWeight: 600,
              }}
            >
              Create New API Key
            </Button>
          </Col>
        </Row>

        <div
          style={{
            marginTop: 24,
            marginBottom: 24,
            padding: 16,
            borderRadius: 14,
            background: "#fafafa",
            border: "1px solid #f0f0f0",
          }}
        >
          <Paragraph style={{ margin: 0, color: "#595959" }}>
            API keys are used by approved client applications to access protected
            public endpoints such as the featured alumni feed. Only admins can
            create, review, and revoke client tokens.
          </Paragraph>
        </div>

        <Table
          columns={columns}
          dataSource={apiKeys || []}
          rowKey="id"
          pagination={{ pageSize: 6 }}
          bordered={false}
        />
      </Card>

      <Modal
        title={
          <Space>
            <SafetyCertificateOutlined />
            Create API Key
          </Space>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setCreatedToken("");
          form.resetFields();
        }}
        footer={null}
        centered
      >
        <Form form={form} layout="vertical" onFinish={createKey} requiredMark={false}>
          <Form.Item
            name="name"
            label="Client Name"
            rules={[{ required: true, message: "Please enter client name" }]}
          >
            <Input placeholder="e.g. AR Client" size="large" />
          </Form.Item>

          <Form.Item
            name="scopes"
            label="Scopes"
            rules={[{ required: true, message: "Please enter scopes" }]}
            initialValue="PUBLIC_READ"
          >
            <Input placeholder="e.g. PUBLIC_READ" size="large" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={creating}
            icon={<PlusOutlined />}
            style={{
              height: 44,
              borderRadius: 10,
              fontWeight: 600,
            }}
          >
            Create API Key
          </Button>
        </Form>

        {createdToken && (
          <div style={{ marginTop: 20 }}>
            <Alert
              type="success"
              showIcon
              message="API key created successfully"
              description="Copy and store this bearer token now. It may not be shown again."
            />

            <div
              style={{
                marginTop: 16,
                padding: 14,
                borderRadius: 12,
                background: "#fafafa",
                border: "1px solid #f0f0f0",
                wordBreak: "break-all",
              }}
            >
              <Text strong>Bearer Token:</Text>
              <Paragraph style={{ marginTop: 8, marginBottom: 0 }}>
                {createdToken}
              </Paragraph>
            </div>

            <Button
              icon={<CopyOutlined />}
              style={{ marginTop: 12, borderRadius: 10 }}
              onClick={copyToken}
            >
              Copy Token
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Admin;