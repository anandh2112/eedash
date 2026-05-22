import { NextResponse } from "next/server";
import { pgQuery } from "@/app/dbpg";
import moment from "moment-timezone";

// GET: Fetch full attendance history for a user
export async function GET(req) {
  try {
    const username = req.nextUrl.searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // ✅ Updated query to use attendance_date
    const result = await pgQuery(
      `SELECT 
          id,
          username,
          attendance_date,
          check_in,
          check_out,
          work_hours,
          status,
          work_update
       FROM attendance
       WHERE username = $1
       ORDER BY attendance_date DESC`,
      [username]
    );

    // Format records
    const formatted = result.map((record) => {
      // Format work hours safely
      let workHours = "-";
      if (record.work_hours) {
        const wh = record.work_hours;
        const h = String(wh.hours || 0).padStart(2, "0");
        const m = String(wh.minutes || 0).padStart(2, "0");
        const s = String(wh.seconds || 0).padStart(2, "0");
        workHours = `${h}:${m}:${s}`;
      }

      return {
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
    console.error("Attendance History API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
