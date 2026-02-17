type HealthQueryResponse = {
  data?: {
    hello: string;
    health: string;
  };
  errors?: Array<{ message: string }>;
};

export default async function Home() {
  const endpoint = process.env.GRAPHQL_ENDPOINT ?? "http://localhost:4000/graphql";

  let hello = "N/A";
  let health = "N/A";
  let error = "";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        query: "{ hello health }",
      }),
    });

    const json = (await response.json()) as HealthQueryResponse;

    if (json.errors?.length) {
      error = json.errors.map((item) => item.message).join(", ");
    } else {
      hello = json.data?.hello ?? hello;
      health = json.data?.health ?? health;
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "Unknown error";
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-8 font-sans dark:bg-black">
      <main className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-950">
        <h1 className="text-2xl font-semibold">Webu Portal</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Next.js(App Router) → NestJS(GraphQL schema-first) の疎通確認ページ
        </p>

        <div className="mt-6 space-y-3 text-sm">
          <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
            <span className="font-medium">hello:</span> {hello}
          </div>
          <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
            <span className="font-medium">health:</span> {health}
          </div>
          <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
            <span className="font-medium">endpoint:</span> {endpoint}
          </div>
          {error ? (
            <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              <span className="font-medium">error:</span> {error}
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
