import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname === "/login";
  const isAdminPage = pathname.startsWith("/admin");
  const isTeacherPage = pathname.startsWith("/teacher");
  const isStudentPage = pathname.startsWith("/student");
  const isParentPage = pathname.startsWith("/parent");

  const isProtected = isAdminPage || isTeacherPage || isStudentPage || isParentPage;

  // Redirect to login if not authenticated
  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect away from login if already authenticated
  if (token && isAuthPage) {
    const role = token.role as string;
    if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", req.url));
    if (role === "TEACHER") return NextResponse.redirect(new URL("/teacher", req.url));
    if (role === "STUDENT") return NextResponse.redirect(new URL("/student", req.url));
    if (role === "PARENT") return NextResponse.redirect(new URL("/parent", req.url));
  }

  // Block wrong role from accessing wrong dashboard
  if (token && isProtected) {
    const role = token.role as string;
    if (isAdminPage && role !== "ADMIN") return NextResponse.redirect(new URL("/login", req.url));
    if (isTeacherPage && role !== "TEACHER") return NextResponse.redirect(new URL("/login", req.url));
    if (isStudentPage && role !== "STUDENT") return NextResponse.redirect(new URL("/login", req.url));
    if (isParentPage && role !== "PARENT") return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};