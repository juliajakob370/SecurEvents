import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

type Props = {
    children: React.ReactElement;
};

const PublicOnlyRoute: React.FC<Props> = ({ children }) => {
    const { isAuthenticated, loading } = useContext(AuthContext);

    if (loading) {
        return null;
    }

    if (isAuthenticated) {
        return <Navigate to="/main" replace />;
    }

    return children;
};

export default PublicOnlyRoute;
