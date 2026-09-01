"use client";
import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/apiClient";
import { Alert, Button, Card, Spinner, Badge } from "react-bootstrap";

export default function ActiveDevices() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchSessions = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiClient("api/sessions");
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setSessions(data.sessions || []);
      } else {
        setError(data.message || "Failed to load active device sessions.");
      }
    } catch {
      setError("Network error. Could not fetch device sessions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRevokeSession = async (sessionId) => {
    setActionLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await apiClient("api/sessions/revoke", {
        method: "POST",
        body: JSON.stringify({ session_id: sessionId }),
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setSuccess("Device session signed out successfully.");
        fetchSessions();
      } else {
        setError(data.message || "Failed to sign out device.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevokeOthers = async () => {
    if (!window.confirm("Are you sure you want to sign out of all other devices?")) {
      return;
    }
    setActionLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await apiClient("api/sessions/revoke-others", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setSuccess(data.message || "All other device sessions signed out.");
        fetchSessions();
      } else {
        setError(data.message || "Failed to sign out other devices.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const getDeviceIcon = (type) => {
    if (type === "mobile") {
      return (
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
        </svg>
      );
    }
    if (type === "tablet") {
      return (
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0H5C3.34 0 2 1.34 2 3v18c0 1.66 1.34 3 3 3h14c1.66 0 3-1.34 3-3V3c0-1.66-1.34-3-3-3zm-7 23c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm7-4H5V3h14v16z" />
        </svg>
      );
    }
    return (
      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 5h16v11H4V5z" />
      </svg>
    );
  };

  return (
    <div className="w-100" style={{ maxWidth: 750, margin: "0 auto", fontFamily: "'Kanit-Regular', sans-serif" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Active Device Sessions</h4>
          <p className="text-muted fs-14 mb-0">Manage devices currently logged into your account.</p>
        </div>
        {sessions.length > 1 && (
          <Button
            variant="outline-danger"
            size="sm"
            className="rounded-pill px-3"
            onClick={handleRevokeOthers}
            disabled={actionLoading}
          >
            Sign Out All Other Devices
          </Button>
        )}
      </div>

      {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess("")} dismissible>{success}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="dark" />
          <p className="mt-2 text-muted fs-14">Loading device sessions...</p>
        </div>
      ) : sessions.length === 0 ? (
        <Alert variant="info">No active device sessions found.</Alert>
      ) : (
        <div className="d-flex flex-column gap-3">
          {sessions.map((session) => (
            <Card key={session.session_id} className="border-0 shadow-sm rounded-3 p-3">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="p-3 rounded-circle text-dark d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: "#f8f9fa" }}
                  >
                    {getDeviceIcon(session.device_type)}
                  </div>
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <h6 className="fw-bold mb-0">{session.device_name}</h6>
                      {session.is_current && (
                        <Badge bg="success" className="px-2 py-1 fs-12 fw-normal">
                          This Device
                        </Badge>
                      )}
                    </div>
                    <div className="text-muted fs-13 mt-1">
                      <span>IP: {session.ip_address || "Unknown"}</span>
                      <span className="mx-2">•</span>
                      <span>
                        Last active:{" "}
                        {session.last_active_at
                          ? new Date(session.last_active_at).toLocaleString()
                          : "Just now"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  {!session.is_current ? (
                    <Button
                      variant="link"
                      className="text-danger p-0 fw-medium text-decoration-underline fs-14"
                      onClick={() => handleRevokeSession(session.session_id)}
                      disabled={actionLoading}
                    >
                      Sign Out
                    </Button>
                  ) : (
                    <span className="text-muted fs-13 fst-italic">Active Session</span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
