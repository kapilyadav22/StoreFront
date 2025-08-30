
import { promises as fs } from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { randomId, randomToken } from "@/lib/id";

export type User = { id: string; email: string; name?: string; passwordHash: string; verified: boolean; verifyToken?: string };

const USERS_FILE = path.join(process.cwd(), "src", "data", "users.json");

async function ensureFile(): Promise<void> {
  try { await fs.access(USERS_FILE); } catch {
    const dir = path.dirname(USERS_FILE);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(USERS_FILE, JSON.stringify([]), "utf8");
  }
}

export async function readUsers(): Promise<User[]> {
  await ensureFile();
  const raw = await fs.readFile(USERS_FILE, "utf8");
  try { return JSON.parse(raw); } catch { return []; }
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const users = await readUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export async function createUser({ email, name, password }: { email: string; name?: string; password: string }): Promise<User> {
  const users = await readUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("Email already in use");
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const verifyToken = randomToken();
  const user: User = { id: randomId("usr_"), email, name, passwordHash, verified: false, verifyToken };
  users.push(user);
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
  return user;
}

export async function verifyUser(email: string, password: string): Promise<User | null> {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}

export async function verifyByToken(token: string): Promise<User | null> {
  const users = await readUsers();
  const idx = users.findIndex((u) => u.verifyToken === token);
  if (idx === -1) return null;
  users[idx].verified = true;
  users[idx].verifyToken = undefined;
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
  return users[idx];
}


