import { Request, Response } from "express";
import { Profile } from "../entities/Profile";
import { ApiResponse, StatusMessageType } from "../types";
import { handleCustomError, handleServerError } from "../utils";
import { getDownloadURL, getStorage } from "firebase-admin/storage";
import multer from "multer";
import crypto from "crypto";

const upload = multer({ storage: multer.diskStorage({}) });

const mimeExtensionMap = new Map<string, string>();
mimeExtensionMap.set("image/jpeg", "jpeg");
mimeExtensionMap.set("image/png", "png");
mimeExtensionMap.set("image/webp", "webp");

interface ImageUploadStatus {
  unsupportedImage: boolean;
  imageUrl: string | undefined;
}

async function uploadImage(
  uid: string,
  req: Express.Request
): Promise<ImageUploadStatus> {
  const imageFile = (req.files as Express.Multer.File[])[0];
  if (!imageFile) {
    return { unsupportedImage: false, imageUrl: undefined };
  }
  const extension = mimeExtensionMap.get(imageFile.mimetype);
  if (!extension) {
    return { unsupportedImage: true, imageUrl: undefined };
  }

  const bucket = getStorage(req.firebaseApp).bucket();
  const filename = `${crypto.randomBytes(20).toString("hex")}.${extension}`;
  const file = (
    await bucket.upload(imageFile.path, {
      destination: `public/${filename}`,
      metadata: {
        contentType: imageFile.mimetype,
        cacheControl: "public, max-age=604800",
      },
      public: true,
    })
  )[0];
  return { unsupportedImage: false, imageUrl: await getDownloadURL(file) };
}

export const updateProfileMulter = upload.array("image", 1);

export async function updateProfileHandler(req: Request, res: Response) {
  const em = req.orm.em.fork();
  const uid = req.userToken.uid;
  const body = req.body;

  try {
    const imageStatus = await uploadImage(uid, req);

    if (imageStatus.unsupportedImage) {
      return handleCustomError(res, {
        type: StatusMessageType.ERROR,
        message: "Image format not supported",
      });
    }

    const profile = await em.findOneOrFail(Profile, {
      uid: uid,
    });

    profile.name = body.name ?? profile.name;
    profile.preferredLang = body.preferredLang ?? profile.preferredLang;
    profile.imageUrl = imageStatus.imageUrl ?? profile.imageUrl;
    await em.flush();

    const response: ApiResponse = {
      statusMessage: {
        message: "Profile updated successfully",
        type: StatusMessageType.SUCCESS,
      },
      payload: profile,
    };
    res.status(200).send(response);
  } catch (err: any) {
    handleServerError(err, res);
  }
}
