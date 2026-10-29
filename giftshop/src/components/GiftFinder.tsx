"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OCCASIONS, RECIPIENTS } from "@/lib/products";

const BUDGETS = [{ l: "Under ₹500", v: 500 }, { l: "Under ₹1,000", v: 1000 }, { l: "Under ₹2,500", v: 2500 }, { l: "Any budget", v: 0 }];

export function GiftFinder() {
  const r = useRouter();
  const [who, setWho] = useState("");
  const [occ, setOcc] = useState("");
  const [max, setMax] = useState(1000);

  const go = () => {
    const q = new URLSearchParams();
    if (who) q.set("for", who);
    if (occ) q.set("occasion", occ);
    if (max) q.set("max", String(max));
    r.push(`/shop?${q}`);
  };

  return (
    <div className="card p-6 md:p-8">
      <h2 className="font-display text-2xl font-bold">🎯 Gift Finder</h2>
      <p className="text-sm text-muted">Three taps to the perfect gift.</p>
      <p className="mt-4 text-sm font-semibold">Who is it for?</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {RECIPIENTS.map((x) => (<button key={x.slug} type="button" className="chip" data-on={who === x.slug} onClick={() => setWho(who === x.slug ? "" : x.slug)}>{x.name}</button>))}
      </div>
      <p className="mt-4 text-sm font-semibold">What's the occasion?</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {OCCASIONS.map((x) => (<button key={x.slug} type="button" className="chip" data-on={occ === x.slug} onClick={() => setOcc(occ === x.slug ? "" : x.slug)}>{x.emoji} {x.name}</button>))}
      </div>
      <p className="mt-4 text-sm font-semibold">Budget</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {BUDGETS.map((x) => (<button key={x.l} type="button" className="chip" data-on={max === x.v} onClick={() => setMax(x.v)}>{x.l}</button>))}
      </div>
      <button className="btn btn-primary mt-6 w-full" onClick={go}>Show me gifts →</button>
    </div>
  );
}
