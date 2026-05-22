import { NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const { month, year } = await req.json();

    if (!month || !year) {
      return NextResponse.json(
        { error: "Month and year required" },
        { status: 400 }
      );
    }

    const reportsDir =
      "/home/ubuntu/admin_dashboard/public/reports";

    const filename = `Metalware_Report_${String(month).padStart(2, "0")}_${year}.pptx`;
    const filePath = path.join(reportsDir, filename);

    // ---------------------------------------------
    // ✅ 1️⃣ Check if report already exists
    // ---------------------------------------------
    if (fs.existsSync(filePath)) {
      console.log(`📄 Report already exists: ${filename}`);

      return NextResponse.json({
        success: true,
        alreadyExists: true,
        downloadUrl: `/reports/${filename}`,
      });
    }

    // ---------------------------------------------
    // 🚀 2️⃣ Generate report (long-running)
    // ---------------------------------------------
    const scriptPath = "/home/ubuntu/scripts/monthly_report_writer.py";
    const venvPython =
      "/home/ubuntu/scripts/repgen_venv/bin/python";

    const command = `${venvPython} ${scriptPath} ${year} ${month}`;

    exec(command, { timeout: 1000 * 60 * 10 }, (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Report generation failed:", stderr);
      } else {
        console.log("✅ Report generated:", stdout);
      }
    });

    // ---------------------------------------------
    // 🟡 3️⃣ Immediately respond (do NOT wait)
    // ---------------------------------------------
    return NextResponse.json({
      success: true,
      alreadyExists: false,
      downloadUrl: `/reports/${filename}`,
      message: "Report generation started",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
