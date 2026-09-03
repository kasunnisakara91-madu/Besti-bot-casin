import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();

  if (
    body.username === process.env.ADMIN_USERNAME &&
    body.password === process.env.ADMIN_PASSWORD
  ) {
    return NextResponse.json({
      success: true
    });
  }

  return NextResponse.json(
    {
      success: false,
      message: "Invalid login"
    },
    {
      status: 401
    }
  );
}
