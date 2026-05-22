import { NextResponse } from "next/server";
import { pgQuery } from "@/app/dbpg";
import moment from "moment-timezone";

/* ============================
   GET: Fetch today's attendance
=============================== */
export async function GET(req) {
  try {
    const username = req.nextUrl.searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const today = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");

    const result = await pgQuery(
      `
      SELECT *
      FROM attendance
      WHERE username = $1
      AND attendance_date = $2
      LIMIT 1
      `,
      [username, today]
    );

    if (result.length === 0) {
      return NextResponse.json({ data: null });
    }

    const record = result[0];

    // Format interval properly
    if (record.work_hours) {
      const totalSeconds =
        record.work_hours.hours * 3600 +
        record.work_hours.minutes * 60 +
        record.work_hours.seconds;

      const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
      const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
      const s = String(totalSeconds % 60).padStart(2, "0");

      record.work_hours = `${h}:${m}:${s}`;
    }

    return NextResponse.json({ data: record });
  } catch (error) {
    console.error("Attendance GET API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/* ============================
   POST: Check-in / Check-out
=============================== */
export async function POST(req) {
  try {
    const { username, action, work_update } = await req.json();

    if (!username || !action) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    /* ============================
       CHECK-IN
    ============================ */
    if (action === "checkin") {

      const existing = await pgQuery(
        `
        SELECT 1
        FROM attendance
        WHERE username = $1
        AND attendance_date = CURRENT_DATE
        `,
        [username]
      );

      if (existing.length > 0) {
        return NextResponse.json(
          { error: "Attendance already marked today" },
          { status: 400 }
        );
      }

      await pgQuery(
        `
        INSERT INTO attendance (username, check_in, attendance_date, status)
        VALUES ($1, NOW(), CURRENT_DATE, 'Present')
        `,
        [username]
      );

      return NextResponse.json({
        message: "Checked in successfully",
      });
    }

    /* ============================
       CHECK-OUT
    ============================ */
    if (action === "checkout") {

      if (!work_update || work_update.trim() === "") {
        return NextResponse.json(
          { error: "Please provide a work update before checking out." },
          { status: 400 }
        );
      }

      const result = await pgQuery(
        `
        UPDATE attendance
        SET check_out = NOW(),
            work_hours = NOW() - check_in,
            work_update = $1
        WHERE username = $2
          AND attendance_date = CURRENT_DATE
          AND check_out IS NULL
        RETURNING check_in, check_out, work_hours, work_update
        `,
        [work_update.trim(), username]
      );

      if (result.length === 0) {
        return NextResponse.json(
          { error: "No active check-in found for today" },
          { status: 400 }
        );
      }

      const record = result[0];

      let totalTime = "00:00:00";

      if (record.work_hours) {
        const totalSeconds =
          record.work_hours.hours * 3600 +
          record.work_hours.minutes * 60 +
          record.work_hours.seconds;

        const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
        const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
        const s = String(totalSeconds % 60).padStart(2, "0");

        totalTime = `${h}:${m}:${s}`;
      }

      return NextResponse.json({
        message: "Checked out successfully",
        data: {
          check_in: record.check_in,
          check_out: record.check_out,
          work_hours: totalTime,
          work_update: record.work_update,
        },
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );

  } catch (error) {
    console.error("Attendance POST API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
