import prisma from "../../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("hook called");

  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { email, name, picture, secret } = req.body;    

  if (secret !== process.env.AUTH0_HOOK_SECRET)
    return res.status(403).json({ error: "Not authorized" });
  if (!email) return res.status(400).json({ error: "Email is required" });

  try { 
    const user = await prisma.user.create({
        data: {
            email,
            name,
            avatar: picture
        },
    });

    return res.status(200).json({
        message: `User created successfully with email: ${email}`,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server Error" });
  } 

};

export default handler;