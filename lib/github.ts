import "server-only";

type GithubConfig = {
  token: string;
  owner: string;
  repo: string;
  branch: string;
};

const API_BASE = "https://api.github.com";

export function getGithubConfig(): GithubConfig | null {
  const token = process.env.GITHUB_TOKEN;
  const repoFull = process.env.GITHUB_REPO;
  if (!token || !repoFull) return null;
  const [owner, repo] = repoFull.split("/");
  if (!owner || !repo) return null;
  const branch = process.env.GITHUB_BRANCH || "main";
  return { token, owner, repo, branch };
}

async function ghFetch(config: GithubConfig, path: string, init?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  return res;
}

async function getFileSha(
  config: GithubConfig,
  filePath: string
): Promise<string | null> {
  const res = await ghFetch(
    config,
    `/repos/${config.owner}/${config.repo}/contents/${encodeURIComponent(
      filePath
    ).replace(/%2F/g, "/")}?ref=${encodeURIComponent(config.branch)}`
  );
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`GitHub: failed to read ${filePath} (${res.status})`);
  }
  const data = await res.json();
  return data.sha as string;
}

export async function commitFile(
  filePath: string,
  contentBuffer: Buffer,
  message: string
): Promise<void> {
  const config = getGithubConfig();
  if (!config) throw new Error("GitHub is not configured");

  const sha = await getFileSha(config, filePath);
  const res = await ghFetch(
    config,
    `/repos/${config.owner}/${config.repo}/contents/${encodeURIComponent(
      filePath
    ).replace(/%2F/g, "/")}`,
    {
      method: "PUT",
      body: JSON.stringify({
        message,
        content: contentBuffer.toString("base64"),
        branch: config.branch,
        ...(sha ? { sha } : {}),
      }),
    }
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GitHub: failed to write ${filePath} (${res.status}) ${text}`);
  }
}

export async function deleteFileFromRepo(
  filePath: string,
  message: string
): Promise<void> {
  const config = getGithubConfig();
  if (!config) throw new Error("GitHub is not configured");

  const sha = await getFileSha(config, filePath);
  if (!sha) return; // already gone

  const res = await ghFetch(
    config,
    `/repos/${config.owner}/${config.repo}/contents/${encodeURIComponent(
      filePath
    ).replace(/%2F/g, "/")}`,
    {
      method: "DELETE",
      body: JSON.stringify({
        message,
        sha,
        branch: config.branch,
      }),
    }
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GitHub: failed to delete ${filePath} (${res.status}) ${text}`);
  }
}

export function isGithubConfigured(): boolean {
  return !!getGithubConfig();
}
