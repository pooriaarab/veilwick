import { z } from "zod";
import { sendJob, type QueueMessageContract } from "./index";

/* -------------------------------------------------------------------------- */
/* Zod Schema                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Zod schema for the WanGenerateJob payload.
 */
export const WanGenerateJobPayloadSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  category: z.string().min(1, "Category is required"),
  videoId: z.string().min(1, "Video ID is required"),
});

export type WanGenerateJobPayload = z.infer<typeof WanGenerateJobPayloadSchema>;

/* -------------------------------------------------------------------------- */
/* Job Type                                                                   */
/* -------------------------------------------------------------------------- */

export type WanGenerateJob = QueueMessageContract<
  "wan.generate",
  WanGenerateJobPayload
>;

/* -------------------------------------------------------------------------- */
/* Enqueue                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Enqueue a Wan video generation job to OUTBOX_QUEUE.
 *
 * @param queue - The OUTBOX_QUEUE binding
 * @param payload - { prompt, category, videoId }
 * @returns The queued message (already sent)
 */
export async function enqueueWanJob(
  queue: Queue<QueueMessageContract>,
  payload: WanGenerateJobPayload,
): Promise<WanGenerateJob> {
  const job: WanGenerateJob = {
    type: "wan.generate",
    id: crypto.randomUUID(),
    payload,
    createdAt: new Date().toISOString(),
  };

  await sendJob(queue, job);
  return job;
}