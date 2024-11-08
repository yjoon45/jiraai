import { NextResponse } from "next/server";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const JIRA_DOMAIN = process.env.JIRA_DOMAIN;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  try {
    const jqlQuery = encodeURIComponent(
      `assignee = "${username}" AND status != Done ORDER BY updated DESC`
    );
    const url = `https://${JIRA_DOMAIN}/rest/api/3/search?jql=${jqlQuery}&fields=key,summary,customfield_10015,duedate`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${JIRA_EMAIL}:${JIRA_API_TOKEN}`
        ).toString("base64")}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Extract start and end dates
    const tasksWithDates = data.issues.map((issue) => {
      return {
        key: issue.key,
        summary: issue.fields.summary,
        startDate: issue.fields.customfield_10015, // Assuming this is the "Actual start" field
        endDate: issue.fields.duedate,
      };
    });

    return NextResponse.json(tasksWithDates);
  } catch (error) {
    console.error("Error fetching Jira tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch Jira tasks" },
      { status: 500 }
    );
  }
}
