/**
 * Minimal Vast.ai API helper.
 *
 * Wraps the Vast.ai REST API (https://vast.ai/api/v1) for two operations:
 * - List RTX 4090 offers (search)
 * - Create an instance
 *
 * Requires VAST_API_KEY env var to be set (for authenticated endpoints).
 * Uses fetch — no additional dependencies.
 */

const VAST_API_BASE = "https://vast.ai/api/v1";

function getApiKey(): string {
  const key = process.env.VAST_API_KEY;
  if (!key) {
    throw new Error(
      "[vast] VAST_API_KEY is not set. Set it in .dev.vars or via wrangler secret.",
    );
  }
  return key;
}

export interface VastOffer {
  id: number;
  gpu_name: string;
  num_gpus: number;
  dph_total: number; // per-hour cost
  reliability: number;
  machine_id: number;
  min_bid: number | null;
  inet_up: number;
  inet_down: number;
}

export interface VastOfferSearchParams {
  gpuName?: string; // e.g. "RTX_4090"
  numGpus?: number;
  minReliability?: number;
  limit?: number;
  order?: string; // e.g. "dph_total-asc"
}

/**
 * Search for available GPU offers matching the given criteria.
 *
 * Uses the public search endpoint (no auth required for search).
 */
export async function searchOffers(
  params: VastOfferSearchParams = {},
): Promise<VastOffer[]> {
  const query = new URLSearchParams();

  const filters: string[] = [];

  if (params.gpuName) {
    filters.push(`gpu_name=${params.gpuName}`);
  }
  if (params.numGpus !== undefined) {
    filters.push(`num_gpus=${params.numGpus}`);
  }
  if (params.minReliability !== undefined) {
    filters.push(`reliability>=${params.minReliability}`);
  }

  if (filters.length > 0) {
    query.set("q", filters.join(" "));
  }
  if (params.limit !== undefined) {
    query.set("limit", String(params.limit));
  }

  const url = `${VAST_API_BASE}/bundles?${query.toString()}`;
  const order = params.order || "dph_total-asc";

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "unknown");
    throw new Error(`[vast] search offers failed (${response.status}): ${text}`);
  }

  const data = (await response.json()) as { offers: VastOffer[] };
  const offers = (data.offers || []).sort((a, b) => {
    if (order === "dph_total-asc") return a.dph_total - b.dph_total;
    if (order === "dph_total-desc") return b.dph_total - a.dph_total;
    return 0;
  });

  console.log(`[vast] searchOffers: found ${offers.length} matching offers`);
  return offers;
}

export interface CreateInstanceParams {
  offerId: number;
  image: string;
  disk: number; // GB
  ports?: string; // e.g. "8000:8000/tcp"
  env?: Record<string, string>;
  sshPort?: number;
}

export interface VastInstance {
  id: number;
  machine_id: number;
  ssh_host: string;
  ssh_port: number;
  actual_status: string;
  image_uuid: string;
}

/**
 * Create a new Vast.ai instance from an offer.
 *
 * Requires VAST_API_KEY for authentication.
 */
export async function createInstance(
  params: CreateInstanceParams,
): Promise<VastInstance> {
  const apiKey = getApiKey();

  const body: Record<string, unknown> = {
    client_id: "me",
    image: params.image,
    disk: params.disk,
    bid: null, // on-demand pricing (use min_bid for spot)
  };

  if (params.ports) {
    body.ports = params.ports;
  }
  if (params.env) {
    body.env = params.env;
  }
  if (params.sshPort) {
    body.ssh_port = params.sshPort;
  }

  const response = await fetch(
    `${VAST_API_BASE}/instances/create?api_key=${apiKey}&offer_id=${params.offerId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    const text = await response.text().catch(() => "unknown");
    throw new Error(
      `[vast] create instance failed (${response.status}): ${text}`,
    );
  }

  const instance = (await response.json()) as VastInstance;
  console.log(
    `[vast] createInstance: created instance ${instance.id} (status: ${instance.actual_status})`,
  );
  return instance;
}

/**
 * Get current pricing summary for RTX 4090 across Vast.ai spot and TensorDock.
 */
export function getPricingSummary(): {
  vastSpot: string;
  tensorDock: string;
  lambda: string;
} {
  return {
    vastSpot: "$0.25–0.40/hr (spot, varies by host)",
    tensorDock: "$0.42/hr (flat, no evictions — recommended for production)",
    lambda: "$0.54/hr (owned infra, SLA)",
  };
}