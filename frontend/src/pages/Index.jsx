
import { Navigate } from "react-router-dom";

const Index = () => {
  return (
    <>
      <Navigate to="/dashboard" replace />
      {/* Fallback content in case navigation doesn't work */}
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Library Management System</h1>
        <p>If you can see this, there might be an issue with routing. Try navigating to <a href="/dashboard" className="text-blue-600 hover:underline">Dashboard</a> directly.</p>
      </div>
    </>
  );
};

export default Index;
