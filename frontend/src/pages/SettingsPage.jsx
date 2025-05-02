import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Customize your preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Label>Dark Mode</Label>
            <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => alert("Preferences saved!")}>Save Settings</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SettingsPage;