import React, { useEffect, useState } from "react";
import { Card, Avatar, Descriptions, message, Spin } from "antd";

const API_URL = "http://localhost:4000/api/profile/me";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        message.error("Failed to load profile");
        setLoading(false);
      });
  }, []);

  if (loading) return <Spin size="large" />;

  return (
    <Card title="User Profile" style={{ maxWidth: 800, margin: "auto" }}>
      <Card.Meta
        avatar={<Avatar size={64} src={profile.avatar_url} />}
        title={profile.full_name}
        description={profile.bio}
      />
      <Descriptions column={1} style={{ marginTop: 20 }}>
        <Descriptions.Item label="Email">{profile.email}</Descriptions.Item>
        <Descriptions.Item label="LinkedIn">
          <a href={profile.linkedin_url} target="_blank" rel="noreferrer">
            {profile.linkedin_url}
          </a>
        </Descriptions.Item>
        {profile.degrees && profile.degrees.length > 0 && (
          <Descriptions.Item label="Degrees">
            {profile.degrees.map((d, idx) => (
              <div key={idx}>
                <b>{d.title}</b> -{" "}
                <a href={d.university_url} target="_blank" rel="noreferrer">
                  {d.university_url}
                </a>{" "}
                ({d.completed_at})
              </div>
            ))}
          </Descriptions.Item>
        )}
        {profile.certifications && profile.certifications.length > 0 && (
          <Descriptions.Item label="Certifications">
            {profile.certifications.map((c, idx) => (
              <div key={idx}>
                {c.name} -{" "}
                <a href={c.course_url} target="_blank" rel="noreferrer">
                  {c.course_url}
                </a>{" "}
                ({c.completed_at})
              </div>
            ))}
          </Descriptions.Item>
        )}
      </Descriptions>
    </Card>
  );
};

export default Profile;