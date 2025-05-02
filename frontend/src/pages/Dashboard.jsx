import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/stats")
      .then(res => res.json())
      .then(data => setStats(data));
  }, );

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="page-title">Dashboard</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Library Stats</CardTitle>
        </CardHeader>
        <CardContent>
          {stats ? (
            <ul className="space-y-2">
              <li>Total Books: {stats.totalBooks}</li>
              <li>Total Members: {stats.totalMembers}</li>
              <li>Books Borrowed: {stats.totalBorrowed}</li>
            </ul>
          ) : (
            <p>Loading...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;