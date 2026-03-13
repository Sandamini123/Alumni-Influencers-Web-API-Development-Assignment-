import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  Avatar,
  Descriptions,
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
} from "antd";
import { CameraOutlined } from "@ant-design/icons";

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

  // Fetch profile data
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
            degrees: prof.degrees || [],
            certifications: prof.certifications || [],
            licenses: prof.licenses || [],
            short_courses: prof.short_courses || [],
            employments: prof.employments || [],
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

  // Handle form submit (create/update profile)
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

  // Trigger file input click
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Handle avatar upload
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Preview immediately
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

      // Update with backend URL + cache bust
      const updatedUrl = data.avatar_url.includes("http")
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

  if (loading)
    return <Spin size="large" style={{ display: "block", margin: "50px auto" }} />;

  return (
    <Card
      title="User Profile"
      style={{ maxWidth: 1200, margin: "auto" }}
      extra={
        <div style={{ position: "relative", display: "inline-block" }}>
          <Avatar size={100} src={profile?.avatar_url} />
          <Tooltip title="Change Avatar">
            <CameraOutlined
              onClick={handleAvatarClick}
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                fontSize: 20,
                color: "#fff",
                backgroundColor: "rgba(0,0,0,0.6)",
                borderRadius: "50%",
                padding: 4,
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
      }
    >
      {!profile ? (
        <p style={{ textAlign: "center", marginBottom: 20 }}>
          No profile found. Please fill the form to create your profile.
        </p>
      ) : (
        <Card.Meta
          style={{ marginBottom: 20 }}
          title={profile.full_name}
          description={profile.bio}
        />
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
        {/* Full Name */}
        <Form.Item
          label="Full Name"
          name="full_name"
          rules={[{ required: true, message: "Please enter your full name" }]}
        >
          <Input placeholder="Full Name" />
        </Form.Item>

        {/* Bio */}
        <Form.Item label="Bio" name="bio">
          <Input.TextArea rows={4} placeholder="Write a short bio" />
        </Form.Item>

        {/* LinkedIn */}
        <Form.Item
          label="LinkedIn URL"
          name="linkedin_url"
          rules={[{ type: "url", message: "Enter a valid URL" }]}
        >
          <Input placeholder="https://linkedin.com/in/yourname" />
        </Form.Item>

        {/* Degrees */}
       <Form.Item label="Degrees">
  <Form.List name="degrees">
    {(fields, { add, remove }) => (
      <>
        {fields.map(({ key, name, ...restField }) => (
          <Row gutter={16} key={key} align="middle" style={{ marginBottom: 8 }}>
            <Col span={6}>
              <Form.Item
                {...restField}
                name={[name, "title"]}
                rules={[{ required: true, message: "Enter degree title" }]}
                style={{ marginBottom: 0 }}
              >
                <Input placeholder="Degree Title" />
              </Form.Item>
            </Col>

            <Col span={10}>
              <Form.Item
                {...restField}
                name={[name, "university_url"]}
                rules={[
                  { required: true, type: "url", message: "Enter valid URL" },
                ]}
                style={{ marginBottom: 0 }}
              >
                <Input placeholder="University URL" />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                {...restField}
                name={[name, "completed_at"]}
                rules={[
                  { required: true, message: "Enter completion date" },
                ]}
                style={{ marginBottom: 0 }}
              >
                <Input placeholder="YYYY-MM-DD" />
              </Form.Item>
            </Col>

            <Col span={2}>
              <Button
                danger
                type="primary"
                onClick={() => remove(name)}
                block
              >
                Remove
              </Button>
            </Col>
          </Row>
        ))}

        <Form.Item style={{ marginTop: 10 }}>
          <Button type="dashed" onClick={() => add()} block>
            Add Degree
          </Button>
        </Form.Item>
      </>
    )}
  </Form.List>
</Form.Item>

        {/* Certifications */}
       <Form.Item label="Certifications">
  <Form.List name="certifications">
    {(fields, { add, remove }) => (
      <>
        {fields.map(({ key, name, ...restField }) => (
          <Row gutter={16} key={key} align="middle" style={{ marginBottom: 8 }}>
            <Col span={8}>
              <Form.Item
                {...restField}
                name={[name, "name"]}
                rules={[{ required: true, message: "Enter certification name" }]}
                style={{ marginBottom: 0 }}
              >
                <Input placeholder="Certification Name" />
              </Form.Item>
            </Col>

            <Col span={10}>
              <Form.Item
                {...restField}
                name={[name, "course_url"]}
                rules={[
                  { required: true, type: "url", message: "Enter valid URL" },
                ]}
                style={{ marginBottom: 0 }}
              >
                <Input placeholder="Course URL" />
              </Form.Item>
            </Col>

            <Col span={4}>
              <Form.Item
                {...restField}
                name={[name, "completed_at"]}
                rules={[
                  { required: true, message: "Enter completion date" },
                ]}
                style={{ marginBottom: 0 }}
              >
                <Input placeholder="YYYY-MM-DD" />
              </Form.Item>
            </Col>

            <Col span={2}>
              <Button
                danger
                type="primary"
                onClick={() => remove(name)}
                block
              >
                Remove
              </Button>
            </Col>
          </Row>
        ))}

        <Form.Item style={{ marginTop: 10 }}>
          <Button type="dashed" onClick={() => add()} block>
            Add Certification
          </Button>
        </Form.Item>
      </>
    )}
  </Form.List>
</Form.Item>

        

       
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {profile ? "Update Profile" : "Create Profile"}
            </Button>
          </Space>
        </Form.Item>

        
      </Form>
    </Card>
  );
};

export default Profile;