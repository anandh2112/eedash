import { NextResponse } from "next/server";
import { pgQuery } from "@/app/dbpg";
import moment from "moment-timezone";
import { getUserFromRequest } from "@/app/api/auth/utils";

// ✅ Only these users are allowed
const ALLOWED_USERS = ["Auna Sando", "Anson Sando"];

export async function GET(req) {
  try {
    // 1️⃣ Get authenticated user
    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Restrict access
    if (!ALLOWED_USERS.includes(user.username)) {
      return NextResponse.json({ error: "Access Denied" }, { status: 403 });
    }

    // 3️⃣ Extract month (YYYY-MM) or fallback to current
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month") || moment().format("YYYY-MM");

    // Convert to proper date range
    const startDate = moment(month, "YYYY-MM").startOf("month").format("YYYY-MM-DD");
    const endDate = moment(month, "YYYY-MM").endOf("month").format("YYYY-MM-DD");

    // 4️⃣ Safe parameterized query using attendance_date
    const query = `
      SELECT 
        id,
        username,
        attendance_date,
        check_in,
        check_out,
        work_hours,
        status,
        work_update
      FROM attendance
      WHERE attendance_date BETWEEN $1 AND $2
      ORDER BY attendance_date DESC, username ASC
    `;

    const result = await pgQuery(query, [startDate, endDate]);

    // 5️⃣ Format response
    const formatted = result.map((record) => {
      let workHours = "-";

      if (record.work_hours) {
        const wh = record.work_hours;
        const h = String(wh.hours || 0).padStart(2, "0");
        const m = String(wh.minutes || 0).padStart(2, "0");
        const s = String(wh.seconds || 0).padStart(2, "0");
        workHours = `${h}:${m}:${s}`;
      }

      return {
        username: record.username,
        attendance_date: record.attendance_date,
        check_in: record.check_in,
        check_out: record.check_out,
        work_hours: workHours,
        status: record.status,
        work_update: record.work_update || "-",
      };
    });

    return NextResponse.json({ data: formatted });

  } catch (error) {
    console.error("Overall Attendance API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
