import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    JIRA_DOMAIN: process.env.JIRA_DOMAIN,
    JIRA_EMAIL: process.env.JIRA_EMAIL,
    JIRA_API_TOKEN: process.env.JIRA_API_TOKEN,
  },
};

export default nextConfig;
