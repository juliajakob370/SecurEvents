import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

type Props = {
    children: React.ReactElement;
};

const RequireAuth: React.FC<Props> = ({ children }) => {
    const { isAuthenticated, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return null;
    }

    // A01 FIXED: Prevent unauthorized access to dashboard routes.
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    return children;
};

export default RequireAuth;
