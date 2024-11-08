"use client";

import { useState } from "react";

export default function JiraTaskFetcher() {
  const [username, setUsername] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    if (!username) {
      setError("Please enter a username");
      return;
    }

    setLoading(true);
    setError("");
    setTasks([]);

    try {
      const response = await fetch(
        `/api/tasks?username=${encodeURIComponent(username)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError("Error fetching tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div>
        <div>
          <h2>Jira Task Fetcher</h2>
          <p>Enter a username to fetch their Jira tasks</p>
        </div>
        <div>
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              placeholder="Enter Jira username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button type="button" onClick={fetchTasks} disabled={loading}>
              {loading ? "Fetching..." : "Fetch Tasks"}
            </button>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          {tasks.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">
                Tasks for {username}:
              </h2>
              <ul className="space-y-2">
                {tasks.map((task: any) => (
                  <li key={task.id} className="bg-gray-100 p-2 rounded">
                    <span className="font-medium">{task.key}</span>:{" "}
                    {task.fields.summary}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tasks.length === 0 && !loading && !error && (
            <p className="text-gray-500">
              No tasks found. Try fetching tasks for a username.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
