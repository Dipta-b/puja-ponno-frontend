import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const AdminRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user?.role !== "admin") {
        return <Navigate to="/" />;
    }

    return children;
};

export default AdminRoute;