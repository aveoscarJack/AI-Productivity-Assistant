import { createServerFn } from "@tanstack/react-start";

type Msg = { role: "user" | "assistant" | "system"; content: string };

export const runAI = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const d = data as { system?: string; messages: Msg[] };
    if (!d || !Array.isArray(d.messages)) throw new Error("Invalid input");
    return d;
  })
  .handler(async ({ data }) => {
    const { callAI } = await import("./ai-gateway.server");
    const text = await callAI({ system: data.system, messages: data.messages });
    return { text };
  });
