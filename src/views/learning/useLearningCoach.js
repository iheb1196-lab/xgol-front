import { useCallback, useEffect, useRef, useState } from "react";
import { coachingApi, evaluateSnack } from "../../features/coaching/coachingService";

export default function useLearningCoach(updateTake) {
  const [data, setData] = useState(null);
  const [enabled, setEnabled] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const active = useRef(true);
  const inFlight = useRef(false);
  const callback = useRef(updateTake);
  callback.current = updateTake;
  const refresh = useCallback(async () => {
    try { const result = await coachingApi(); if (active.current) { setData(result); setError(""); } }
    catch (err) { if (active.current) setError(err.message); }
  }, []);
  useEffect(() => { active.current = true; refresh(); return () => { active.current = false; }; }, [refresh]);
  const evaluate = async (take, scenario, focus, previous) => {
    if (inFlight.current || !data?.canEvaluate) return;
    inFlight.current = true; setBusy(true); setError("");
    callback.current(take.url, { aiPending: true, aiText: "", aiError: "" });
    try {
      const result = await evaluateSnack({ blob: take.blob, duration: take.duration, title: scenario.title, scenario: `leadership-${scenario.id}`, source: "learning", context: `${scenario.brief}\nAudience: ${scenario.audience}\nOutcome: ${scenario.outcome}\nStakeholder asks at 0:30 (only if recording reaches that point): ${scenario.objection}`, focus, previous: previous?.ai?._id }, {
        onDelta: delta => { if (active.current) callback.current(take.url, { delta }); },
        onSession: savedId => { if (active.current) callback.current(take.url, { aiSavedId: savedId }); },
      });
      if (active.current) {
        callback.current(take.url, { ai: result.session, aiPending: false });
        setData(current => ({ ...current, credits: result.credits, canEvaluate: result.credits >= current.cost }));
      }
    } catch (err) { if (active.current) { callback.current(take.url, { aiPending: false, aiError: err.message }); await refresh(); } }
    finally { inFlight.current = false; if (active.current) setBusy(false); }
  };
  return { data, enabled, setEnabled, busy, error, refresh, evaluate };
}
