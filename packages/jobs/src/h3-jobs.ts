import { z } from "zod";
import { sendJob, type QueueMessageContract } from "./index";

export const H3GenerateJobPayloadSchema = z.object({
  prompt: z.string().min(1),
  category: z.string().min(1),
  userId: z.string().min(1),
  videoId: z.string().min(1),
  r2Key: z.string().min(1),
});

export type H3GenerateJobPayload = z.infer<typeof H3GenerateJobPayloadSchema>;
export type H3GenerateJob = QueueMessageContract<"h3.generate", H3GenerateJobPayload>;

export async function enqueueH3Job(
  queue: Queue<QueueMessageContract>,
  payload: H3GenerateJobPayload,
): Promise<H3GenerateJob> {
  const job: H3GenerateJob = {
    type: "h3.generate",
    id: crypto.randomUUID(),
    payload,
    createdAt: new Date().toISOString(),
  };
  await sendJob(queue, job);
  return job;
}
