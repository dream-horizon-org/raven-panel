/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/thunder/:path*",
        destination: "http://thunder-master.dream11.local/thunder/:path*",
      },
      {
        source: "/thunder-master-uat/:path*",
        destination: "http://thunder-master-uat.dream11.local/thunder/:path*",
      },
      {
        source: "/concord/:path*",
        destination: "http://concord.dream11.local/:path*",
      },
      {
        source: "/user-cohorts/:path*",
        destination: "http://user-cohorts.dream11.local/:path*",
      },
    ];
  },
};

export default nextConfig;
