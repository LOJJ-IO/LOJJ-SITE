import type { DemoChatMessage } from "@/components/solutions/DemoSimulationContext";

export function demoChatTypingDuration(body: string, role: DemoChatMessage["role"]) {
  if (role === "user") {
    return Math.min(520, Math.max(320, body.length * 16));
  }
  return Math.min(2200, Math.max(720, body.length * 30));
}
