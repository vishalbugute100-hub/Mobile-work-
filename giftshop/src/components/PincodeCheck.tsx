"use client";
import { useState } from "react";

export function PincodeCheck() {
  const [pin, setPin] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const check = async () => { const j = await (await fetch(`/api/pincode?pin=${pin}`)).json(); setMsg({ ok: j.ok, text: j.message }); };
  return (
    <div className="mt-6 border border-line bg-white p-4">
      <p className="eyebrow !text-forest">Check delivery</p>
      <div className="mt-2 flex gap-2">
        <input className="input" inputMode="numeric" maxLength={6} placeholder="Enter pincode" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} />
        <button className="btn btn-ghost !px-5" onClick={check}>Check</button>
      </div>
      {msg && <p className={`mt-2 text-sm ${msg.ok ? "text-forest" : "text-alert"}`}>{msg.text}</p>}
    </div>
  );
}
