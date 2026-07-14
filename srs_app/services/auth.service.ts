export async function login(username: string, password: string) {
  return { username, password, status: "pending" };
}

export async function register(payload: Record<string, unknown>) {
  return { payload, status: "pending" };
}
