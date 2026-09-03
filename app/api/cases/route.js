import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Case from "../../../models/Case";

export async function GET() {
  try {
    await connectDB();

    const cases = await Case.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      cases
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to load cases"
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    if (!body.name || !body.code) {
      return NextResponse.json(
        {
          success: false,
          message: "Name and code are required"
        },
        { status: 400 }
      );
    }

    const newCase = await Case.create({
      name: body.name,
      category: body.category || "General",
      description: body.description || "",
      code: body.code
    });

    return NextResponse.json({
      success: true,
      case: newCase
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create case"
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();

    const body = await request.json();

    const updated = await Case.findByIdAndUpdate(
      body.id,
      {
        name: body.name,
        category: body.category,
        description: body.description,
        code: body.code
      },
      {
        new: true
      }
    );

    return NextResponse.json({
      success: true,
      case: updated
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update case"
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();

    const body = await request.json();

    await Case.findByIdAndDelete(body.id);

    return NextResponse.json({
      success: true
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete case"
      },
      { status: 500 }
    );
  }
}
