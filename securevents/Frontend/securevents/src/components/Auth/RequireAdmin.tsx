import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

type Props = {
    children: React.ReactElement;
};

const RequireAdmin: React.FC<Props> = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return null;
    }

    // OWASP A01 FIXED: Admin dashboard routes are restricted to admin role only.
    if (user?.role !== "Admin") {
        return <Navigate to="/main" replace />;
    }

    return children;
};

export default RequireAdmin;
