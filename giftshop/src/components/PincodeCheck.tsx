"use client";
import { useState } from "react";

export function PincodeCheck() {
  const [pin, setPin] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const check = async () => {
    const r = await fetch(`/api/pincode?pin=${pin}`);
    const j = await r.json();
    setMsg({ ok: j.ok, text: j.message });
  };
  return (
    <div className="mt-6 rounded-2xl bg-white p-4">
      <p className="text-sm font-semibold">📍 Check delivery</p>
      <div className="mt-2 flex gap-2">
        <input className="input" inputMode="numeric" maxLength={6} placeholder="Enter pincode" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} />
        <button className="btn btn-ghost !px-5" onClick={check}>Check</button>
      </div>
      {msg && <p className={`mt-2 text-sm ${msg.ok ? "text-leaf" : "text-berry"}`}>{msg.text}</p>}
    </div>
  );
}
