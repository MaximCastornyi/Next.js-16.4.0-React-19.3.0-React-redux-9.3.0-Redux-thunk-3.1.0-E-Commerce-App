import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname, origin } = req.nextUrl;

  const session = await getToken({
    req,
    secret: process.env.JWT_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  if (pathname === "/checkout" && !session) {
    return NextResponse.redirect(`${origin}`);
  }

  if (pathname.startsWith("/order") && !session) {
    return NextResponse.redirect(`${origin}`);
  }

  if (pathname.startsWith("/profile") && !session) {
    return NextResponse.redirect(`${origin}`);
  }

  if (pathname.startsWith("/admin")) {
    if (!session || session.role !== "admin") {
      return NextResponse.redirect(`${origin}`);
    }
  }

  // ОБЯЗАТЕЛЬНО: пропускаем все остальные запросы дальше
  return NextResponse.next();
}

// (Опционально, но рекомендуется) Ограничьте matcher, 
// чтобы middleware не выполнялся для картинок, favicon и статики
export const config = {
  matcher: ["/checkout", "/order/:path*", "/profile/:path*", "/admin/:path*"],
};