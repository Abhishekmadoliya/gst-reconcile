import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/gst-due-date-calendar",
        destination: "/gst-due-date-calender",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
