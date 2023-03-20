import { getSession } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";

export async function createContext({req, res} : {req: NextApiRequest, res: NextApiResponse}) {
  const session = await getSession(req, res);
  if (!session || typeof session === "undefined") return {};

  const { user, accessToken } = session;
  return { user, accessToken };
}