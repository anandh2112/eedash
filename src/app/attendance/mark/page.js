'use client';
import React, { useState, useEffect } from "react";
import moment from "moment-timezone";

const OFFICE_LOCATION = {
  lat: 12.991195605861087,
  lng: 80.24296550905328,
};
const MAX_DISTANCE_METERS = 1000;

const MarkAttendance = () => {
  const [username, setUsername] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // UI-only
  const [workSummary, setWorkSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alreadyMarked, setAlreadyMarked] = useState(false);
  const [workUpdate, setWorkUpdate] = useState("");
  const [currentDate, setCurrentDate] = useState(
    moment().tz("Asia/Kolkata").format("dddd, DD MMMM YYYY")
  );
  const [canCheckIn, setCanCheckIn] = useState(false);

  /* ---------------- AUTH ---------------- */
  useEffect(() => {
    fetch("/api/auth")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => data?.username && setUsername(data.username))
      .catch(() => setUsername(null));
  }, []);

  /* ---------------- DATE LABEL ---------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(moment().tz("Asia/Kolkata").format("dddd, DD MMMM YYYY"));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  /* ---------------- FETCH TODAY ATTENDANCE ---------------- */
  useEffect(() => {
    if (!username) return;

    fetch(`/api/attendance/mark?username=${username}`)
      .then((res) => res.json())
      .then(({ data }) => {
        if (!data) return;

        if (!data.check_out) {
          setIsCheckedIn(true);

          // 🔑 Rehydrate UI timer from DB check_in
          const checkInMs = new Date(data.check_in).getTime();
          const nowMs = Date.now();
          const elapsedSeconds = Math.max(
            0,
            Math.floor((nowMs - checkInMs) / 1000)
          );

          setElapsedTime(elapsedSeconds);
        } else {
          setAlreadyMarked(true);
          setWorkSummary({
            totalTime: data.work_hours,
            checkIn: moment(data.check_in).tz("Asia/Kolkata").format("hh:mm A"),
            checkOut: moment(data.check_out).tz("Asia/Kolkata").format("hh:mm A"),
            workUpdate: data.work_update || "No update provided",
          });
        }
      });
  }, [username]);

  /* ---------------- UI TIMER (DISPLAY ONLY) ---------------- */
  useEffect(() => {
    if (!isCheckedIn) return;
    const timer = setInterval(() => {
      setElapsedTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isCheckedIn]);

  /* ---------------- GEO CHECK (UI ONLY) ---------------- */
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) => {
        const d = getDistance(coords.latitude, coords.longitude);
        setCanCheckIn(d <= MAX_DISTANCE_METERS);
      },
      () => setCanCheckIn(false),
      { enableHighAccuracy: true }
    );
  }, []);

  const getDistance = (lat, lng) => {
    const R = 6371e3;
    const dLat = ((OFFICE_LOCATION.lat - lat) * Math.PI) / 180;
    const dLon = ((OFFICE_LOCATION.lng - lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat * Math.PI / 180) *
      Math.cos(OFFICE_LOCATION.lat * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  const formatTime = (s) =>
    `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(
      Math.floor((s % 3600) / 60)
    ).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  /* ---------------- CHECK-IN ---------------- */
  const handleCheckIn = async () => {
    setLoading(true);

    const res = await fetch("/api/attendance/mark", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, action: "checkin" }),
    });

    if (res.ok) {
      setIsCheckedIn(true);
      setElapsedTime(0); // UI only, DB already stored NOW()
    }

    setLoading(false);
  };

  /* ---------------- CHECK-OUT ---------------- */
  const handleCheckOut = async () => {
    if (!workUpdate.trim()) return alert("Enter work update");
    setLoading(true);

    const res = await fetch("/api/attendance/mark", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        action: "checkout",
        work_update: workUpdate.trim(),
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setIsCheckedIn(false);
      setAlreadyMarked(true);
      setWorkSummary({
        totalTime: data.data.work_hours,
        checkIn: moment(data.data.check_in).tz("Asia/Kolkata").format("hh:mm A"),
        checkOut: moment(data.data.check_out).tz("Asia/Kolkata").format("hh:mm A"),
        workUpdate,
      });
    }

    setLoading(false);
  };

  if (!username) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <p className="text-sm text-gray-500 mb-2">{currentDate}</p>

        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Hi, <span className="text-green-600">{username}</span>
        </h1>

        {isCheckedIn ? (
          <>
            <p className="text-lg font-semibold text-gray-700 mb-4">
              Work Time:{" "}
              <span className="text-blue-600">{formatTime(elapsedTime)}</span>
            </p>

            <textarea
              value={workUpdate}
              onChange={(e) => setWorkUpdate(e.target.value)}
              placeholder="Enter your work update..."
              className="w-full p-2 border rounded-lg resize-none text-black"
              rows={3}
            />

            <button
              onClick={handleCheckOut}
              disabled={loading || !workUpdate.trim()}
              className="w-full mt-4 bg-red-500 text-white py-3 rounded-xl disabled:opacity-50"
            >
              {loading ? "Checking Out..." : "Check Out"}
            </button>
          </>
        ) : alreadyMarked ? (
          <p className="text-green-600 font-medium mt-4">
            ✅ Attendance already marked today
          </p>
        ) : (
          <button
            onClick={handleCheckIn}
            disabled={loading || !canCheckIn}
            className="w-full bg-green-500 text-white py-3 rounded-xl disabled:opacity-50"
          >
            {loading
              ? "Checking In..."
              : canCheckIn
              ? "Check In"
              : "Please move closer to the office to check in"}
          </button>
        )}

        {workSummary && (
          <div className="mt-6 p-4 bg-gray-50 border rounded-xl text-left">
            <p>🕒 {workSummary.totalTime}</p>
            <p>✅ {workSummary.checkIn} → {workSummary.checkOut}</p>
            <p>📝 {workSummary.workUpdate}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkAttendance;
