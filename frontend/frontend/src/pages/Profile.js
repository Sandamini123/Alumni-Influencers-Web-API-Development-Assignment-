import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  Avatar,
  message,
  Spin,
  Form,
  Input,
  Button,
  Space,
  Divider,
  Row,
  Col,
  Tooltip,
  Typography,
  Tag,
} from "antd";
import {
  CameraOutlined,
  UserOutlined,
  LinkedinOutlined,
  BookOutlined,
  SafetyCertificateOutlined,
  SaveOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const API_URL = "http://localhost:4000/api/profile/me";
const AVATAR_UPLOAD_URL = "http://localhost:4000/api/profile/me/avatar";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [form] = Form.useForm();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      message.error("User not logged in");
      setLoading(false);
      return;
    }

    fetch(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        const prof = data.profile || null;
        setProfile(prof);

        if (prof) {
          form.setFieldsValue({
            full_name: prof.full_name,
            bio: prof.bio,
            linkedin_url: prof.linkedin_url,
            degrees: prof.degrees?.length
              ? prof.degrees
              : [{ title: "", university_url: "", completed_at: "" }],
            certifications: prof.certifications?.length
              ? prof.certifications
              : [{ name: "", course_url: "", completed_at: "" }],
            employments: prof.employments?.length
              ? prof.employments
              : [{ company: "", role_title: "", start_date: "", end_date: "" }],
            short_courses: prof.short_courses?.length
              ? prof.short_courses
              : [{ name: "", course_url: "", completed_at: "" }],
            licenses: prof.licenses?.length
              ? prof.licenses
              : [{ name: "", awarding_body_url: "", completed_at: "" }],


          });
        } else {
          form.setFieldsValue({
            degrees: [{ title: "", university_url: "", completed_at: "" }],
            certifications: [{ name: "", course_url: "", completed_at: "" }],
            employments: [{ company: "", role_title: "", start_date: "", end_date: "" }],
            short_courses: [{ name: "", course_url: "", completed_at: "" }],
            licenses: [{ name: "", awarding_body_url: "", completed_at: "" }],
          });
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        message.error("Failed to load profile");
        setLoading(false);
      });
  }, [token, form]);

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error(await res.text());
      await res.json();

      message.success("Profile saved successfully!");
      setProfile((prev) => ({ ...prev, ...values }));
    } catch (err) {
      console.error(err);
      message.error("Failed to save profile");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setProfile((prev) => ({ ...prev, avatar_url: previewUrl }));

    const formData = new FormData();
    formData.append("avatar", file);

    setUploading(true);
    try {
      const res = await fetch(AVATAR_UPLOAD_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      const updatedUrl = data.avatar_url?.includes("http")
        ? data.avatar_url
        : `http://localhost:4000${data.avatar_url}`;

      setProfile((prev) => ({
        ...prev,
        avatar_url: `${updatedUrl}?t=${Date.now()}`,
      }));

      message.success("Profile picture updated!");
    } catch (err) {
      console.error(err);
      message.error("Failed to upload avatar");
    } finally {
      setUploading(false);
      event.target.value = null;
    }
  };

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
          borderRadius: 24,
          boxShadow: "0 12px 32px rgba(0,0,0,0.06)",
          border: "1px solid #f0f0f0",
          overflow: "hidden",
        }}
        bodyStyle={{ padding: 0 }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #1677ff 0%, #69b1ff 100%)",
            padding: "32px",
            color: "#fff",
          }}
        >
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={6} style={{ textAlign: "center" }}>
              <div style={{ position: "relative", display: "inline-block" }}>
                <Avatar
                  size={120}
                  src={profile?.avatar_url}
                  icon={<UserOutlined />}
                  style={{
                    boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
                    border: "4px solid rgba(255,255,255,0.9)",
                    backgroundColor: "#1677ff",
                  }}
                />
                <Tooltip title={uploading ? "Uploading..." : "Change Avatar"}>
                  <CameraOutlined
                    onClick={handleAvatarClick}
                    style={{
                      position: "absolute",
                      bottom: 6,
                      right: 2,
                      fontSize: 18,
                      color: "#fff",
                      backgroundColor: "rgba(0,0,0,0.65)",
                      borderRadius: "50%",
                      padding: 7,
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  disabled={uploading}
                />
              </div>
            </Col>

            <Col xs={24} md={18}>
              <Title level={2} style={{ color: "#fff", margin: 0 }}>
                {profile?.full_name || "Create Your Alumni Profile"}
              </Title>

              <Paragraph
                style={{
                  color: "rgba(255,255,255,0.92)",
                  marginTop: 10,
                  marginBottom: 14,
                  fontSize: 15,
                }}
              >
                {profile?.bio ||
                  "Build your alumni profile, add your qualifications, and strengthen your presence on the platform."}
              </Paragraph>

              <Space wrap>
                <Tag
                  color="blue"
                  style={{
                    background: "rgba(255,255,255,0.18)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.25)",
                    borderRadius: 20,
                    padding: "4px 10px",
                  }}
                >
                  Alumni Profile
                </Tag>

                {profile?.linkedin_url && (
                  <Tag
                    icon={<LinkedinOutlined />}
                    style={{
                      background: "rgba(255,255,255,0.18)",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.25)",
                      borderRadius: 20,
                      padding: "4px 10px",
                    }}
                  >
                    LinkedIn Added
                  </Tag>
                )}
              </Space>
            </Col>
          </Row>
        </div>

        <div style={{ padding: 32 }}>
          {!profile && (
            <Card
              style={{
                marginBottom: 24,
                borderRadius: 16,
                background: "#fafafa",
                border: "1px solid #f0f0f0",
              }}
            >
              <Text type="secondary">
                No profile found yet. Fill in the form below to create your alumni profile.
              </Text>
            </Card>
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              degrees: [{ title: "", university_url: "", completed_at: "" }],
              certifications: [{ name: "", course_url: "", completed_at: "" }],
            }}
          >
            <Card
              title="Basic Information"
              style={{ borderRadius: 18, marginBottom: 24 }}
              bodyStyle={{ paddingBottom: 8 }}
            >
              <Row gutter={20}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Full Name"
                    name="full_name"
                    rules={[{ required: true, message: "Please enter your full name" }]}
                  >
                    <Input size="large" placeholder="Full Name" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="LinkedIn URL"
                    name="linkedin_url"
                    rules={[{ type: "url", message: "Enter a valid URL" }]}
                  >
                    <Input
                      size="large"
                      placeholder="https://linkedin.com/in/yourname"
                      prefix={<LinkedinOutlined />}
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item label="Bio" name="bio">
                    <Input.TextArea rows={4} placeholder="Write a short professional bio" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card
              title={
                <Space>
                  Degrees
                </Space>
              }
              style={{ borderRadius: 18, marginBottom: 24 }}
            >
              <Form.List name="degrees">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Card
                        key={key}
                        size="small"
                        style={{
                          marginBottom: 16,
                          borderRadius: 14,
                          background: "#fafafa",
                        }}
                      >
                        <Row gutter={16} align="middle">
                          <Col xs={24} md={6}>
                            <Form.Item
                              {...restField}
                              label="Degree Title"
                              name={[name, "title"]}
                              rules={[{ required: true, message: "Enter degree title" }]}
                            >
                              <Input placeholder="Degree Title" />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={10}>
                            <Form.Item
                              {...restField}
                              label="University URL"
                              name={[name, "university_url"]}
                              rules={[
                                { required: true, type: "url", message: "Enter valid URL" },
                              ]}
                            >
                              <Input placeholder="University URL" />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={6}>
                            <Form.Item
                              {...restField}
                              label="Completed At"
                              name={[name, "completed_at"]}
                              rules={[{ required: true, message: "Enter completion date" }]}
                            >
                              <Input placeholder="YYYY-MM-DD" />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={2}>
                            <Button
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => remove(name)}
                              style={{ marginTop: 30 }}
                              block
                            >
                              Remove
                            </Button>
                          </Col>
                        </Row>
                      </Card>
                    ))}

                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => add()}
                      block
                      size="large"
                      style={{ borderRadius: 10 }}
                    >
                      Add Degree
                    </Button>
                  </>
                )}
              </Form.List>
            </Card>

            <Card
              title={
                <Space>
                  Certifications
                </Space>
              }
              style={{ borderRadius: 18, marginBottom: 24 }}
            >
              <Form.List name="certifications">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Card
                        key={key}
                        size="small"
                        style={{
                          marginBottom: 16,
                          borderRadius: 14,
                          background: "#fafafa",
                        }}
                      >
                        <Row gutter={16} align="middle">
                          <Col xs={24} md={8}>
                            <Form.Item
                              {...restField}
                              label="Certification Name"
                              name={[name, "name"]}
                              rules={[{ required: true, message: "Enter certification name" }]}
                            >
                              <Input placeholder="Certification Name" />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={10}>
                            <Form.Item
                              {...restField}
                              label="Course URL"
                              name={[name, "course_url"]}
                              rules={[
                                { required: true, type: "url", message: "Enter valid URL" },
                              ]}
                            >
                              <Input placeholder="Course URL" />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={4}>
                            <Form.Item
                              {...restField}
                              label="Completed At"
                              name={[name, "completed_at"]}
                              rules={[{ required: true, message: "Enter completion date" }]}
                            >
                              <Input placeholder="YYYY-MM-DD" />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={2}>
                            <Button
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => remove(name)}
                              style={{ marginTop: 30 }}
                              block
                            >
                              Remove
                            </Button>
                          </Col>
                        </Row>
                      </Card>
                      
                    ))}

                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => add()}
                      block
                      size="large"
                      style={{ borderRadius: 10 }}
                    >
                      Add Certification
                    </Button>
                  </>
                )}
              </Form.List>
            </Card>

             <Card
              title={
                <Space>
                  Licenses
                </Space>
              }
              style={{ borderRadius: 18, marginBottom: 24 }}
            >
              <Form.List name="licenses">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Card
                        key={key}
                        size="small"
                        style={{
                          marginBottom: 16,
                          borderRadius: 14,
                          background: "#fafafa",
                        }}
                      >
                        <Row gutter={16} align="middle">
                          <Col xs={24} md={8}>
                            <Form.Item
                              {...restField}
                              label="License Name"
                              name={[name, "name"]}
                              rules={[{ required: true, message: "Enter license name" }]}
                            >
                              <Input placeholder="License Name" />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={10}>
                            <Form.Item
                              {...restField}
                              label="License URL"
                              name={[name, "awarding_body_url"]}
                              rules={[
                                { required: true, type: "url", message: "Enter valid URL" },
                              ]}
                            >
                              <Input placeholder="License URL" />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={4}>
                            <Form.Item
                              {...restField}
                              label="Completed At"
                              name={[name, "completed_at"]}
                              rules={[{ required: true, message: "Enter completion date" }]}
                            >
                              <Input placeholder="YYYY-MM-DD" />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={2}>
                            <Button
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => remove(name)}
                              style={{ marginTop: 30 }}
                              block
                            >
                              Remove
                            </Button>
                          </Col>
                        </Row>
                      </Card>
                      
                    ))}

                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => add()}
                      block
                      size="large"
                      style={{ borderRadius: 10 }}
                    >
                      Add License
                    </Button>
                  </>
                )}
              </Form.List>
            </Card>

                         <Card
              title={
                <Space>
                 
                  Short Courses
                </Space>
              }
              style={{ borderRadius: 18, marginBottom: 24 }}
            >
              <Form.List name="short_courses">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Card
                        key={key}
                        size="small"
                        style={{
                          marginBottom: 16,
                          borderRadius: 14,
                          background: "#fafafa",
                        }}
                      >
                        <Row gutter={16} align="middle">
                          <Col xs={24} md={8}>
                            <Form.Item
                              {...restField}
                              label="Short Course"
                              name={[name, "name"]}
                              rules={[{ required: true, message: "Enter short course" }]}
                            >
                              <Input placeholder="Short Course" />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={10}>
                            <Form.Item
                              {...restField}
                              label="Short Course URL"
                              name={[name, "course_url"]}
                              rules={[
                                { required: true, type: "url", message: "Enter valid URL" },
                              ]}
                            >
                              <Input placeholder="Short Course URL" />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={4}>
                            <Form.Item
                              {...restField}
                              label="Completed At"
                              name={[name, "completed_at"]}
                              rules={[{ required: true, message: "Enter completion date" }]}
                            >
                              <Input placeholder="YYYY-MM-DD" />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={2}>
                            <Button
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => remove(name)}
                              style={{ marginTop: 30 }}
                              block
                            >
                              Remove
                            </Button>
                          </Col>
                        </Row>
                      </Card>
                      
                    ))}

                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => add()}
                      block
                      size="large"
                      style={{ borderRadius: 10 }}
                    >
                      Add Short Course
                    </Button>
                  </>
                )}
              </Form.List>
            </Card>

                         <Card
              title={
                <Space>
                  Employments
                </Space>
              }
              style={{ borderRadius: 18, marginBottom: 24 }}
            >
              <Form.List name="employments">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Card
                        key={key}
                        size="small"
                        style={{
                          marginBottom: 16,
                          borderRadius: 14,
                          background: "#fafafa",
                        }}
                      >
                        <Row gutter={16} align="middle">
                          <Col xs={24} md={8}>
                            <Form.Item
                              {...restField}
                              label="Company Name"
                              name={[name, "company"]}
                              rules={[{ required: true, message: "Enter Company Name" }]}
                            >
                              <Input placeholder="Company Name" />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={10}>
                            <Form.Item
                              {...restField}
                              label="Title"
                              name={[name, "role_title"]}
                              rules={[
                                { required: true, type: "string", message: "Enter valid title" },
                              ]}
                            >
                              <Input placeholder="Role Title" />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={4}>
                            <Form.Item
                              {...restField}
                              label="Start Date"
                              name={[name, "start_date"]}
                              rules={[{ required: true, message: "Enter start date" }]}
                            >
                              <Input placeholder="YYYY-MM-DD" />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={4}>
                            <Form.Item
                              {...restField}
                              label="End Date"
                              name={[name, "end_date"]}
                              rules={[{ required: true, message: "Enter end date" }]}
                            >
                              <Input placeholder="YYYY-MM-DD" />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={2}>
                            <Button
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => remove(name)}
                              style={{ marginTop: 30 }}
                              block
                            >
                              Remove
                            </Button>
                          </Col>
                        </Row>
                      </Card>
                      
                    ))}

                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => add()}
                      block
                      size="large"
                      style={{ borderRadius: 10 }}
                    >
                      Add License
                    </Button>
                  </>
                )}
              </Form.List>
            </Card>

            <Divider />

            <Form.Item style={{ marginBottom: 0 }}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={submitting}
                  size="large"
                  style={{
                    borderRadius: 10,
                    fontWeight: 600,
                  }}
                >
                  {profile ? "Update Profile" : "Create Profile"}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default Profile;