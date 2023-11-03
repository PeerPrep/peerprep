import express, { NextFunction } from "express";
import { handleServerError } from "../utils";
import crypto from "crypto";

const decryptMessage = (iv: string, key: string, ciphertext: string) => {
  try {
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(key, "hex"),
      Buffer.from(iv, "hex")
    );
    let decrypted = decipher.update(ciphertext, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
  } catch (error) {
    return null;
  }
};

const decryptRequestBody = () => {
  return async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      const iv = process.env.INITIALIZATION_VECTOR;
      const key = process.env.ENCRYPTION_KEY;
      const ciphertext = req.body;

      if (!key) {
        handleServerError(new Error("No encryption key provided"), res);
        return;
      }

      if (!iv) {
        handleServerError(new Error("No initialization vector provided"), res);
        return;
      }

      if (!ciphertext) {
        handleServerError(new Error("No request body provided"), res);
        return;
      }

      const decryptedMsg = decryptMessage(iv, key, ciphertext);
      if (!decryptedMsg) {
        handleServerError(new Error("Unable to decrypt request body"), res);
        return;
      }

      req.body = JSON.parse(decryptedMsg);

      next();
      return;
    } catch (err: any) {
      handleServerError(err, res);
      return;
    }
  };
};

export default decryptRequestBody;
