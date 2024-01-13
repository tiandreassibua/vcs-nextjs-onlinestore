import type { NextApiRequest, NextApiResponse } from "next";

import { signUp } from "@/lib/firebase/service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    await signUp(req.body, (status: boolean) => {
      if (status) {
        return res
          .status(200)
          .json({ status: true, message: "success", data: "1" });
      } else {
        return res
          .status(400)
          .json({ status: false, message: "failed", data: "0" });
      }
    });
  } else {
    return res
      .status(405)
      .json({ status: false, statusCode: 405, message: "Method not allowed" });
  }
}
