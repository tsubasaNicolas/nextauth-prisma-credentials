export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*", "/charts/:path*", "/swim_times/:path*"],
};
