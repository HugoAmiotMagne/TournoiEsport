import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any auth tokens (customize as needed)
    try { localStorage.removeItem("token"); } catch (e) {}
    // Redirect to home after logout
    navigate("/", { replace: true });
  }, [navigate]);

  return (
    <div className="Logout">
      Logging out...
    </div>
  );
}
