import { Router } from "express";
import { Profile } from "../entities/Profile";
import { ApiResponse, StatusMessageType } from "../types";
import { handleCustomError, handleServerError } from "../utils";
import { getDownloadURL, getStorage } from "firebase-admin/storage"

import multer from "multer"

const router = Router();
const upload = multer({ storage: multer.diskStorage({}) });

const mimeExtensionMap = new Map<string, string>();
mimeExtensionMap.set("image/jpeg", "jpeg");
mimeExtensionMap.set("image/png", "png");
mimeExtensionMap.set("image/webp", "webp");

interface ImageUploadStatus {
    unsupportedImage: boolean;
    imageUrl: string | undefined;
}

async function uploadImage(uid: string, req: Express.Request): Promise<ImageUploadStatus> {
    if (!req.files) {
        return { unsupportedImage: false, imageUrl: undefined };
    }

    const imageFile = (req.files as Express.Multer.File[])[0];
    const extension = mimeExtensionMap.get(imageFile.mimetype);
    if (!extension) {
        return { unsupportedImage: true, imageUrl: undefined };
    }
    
    const bucket = getStorage(req.firebaseApp).bucket();
    const file = (await bucket.upload(imageFile.path, {
        destination: `public/${uid}_image.${extension}`,
        metadata: {
            contentType: imageFile.mimetype,
            cacheControl: "public, max-age=604800"
        },
        public: true
    }))[0];
    return { unsupportedImage: false, imageUrl: await getDownloadURL(file)}
} 

router.post("/", upload.array("image", 1), async (req, res) => {
  const em = req.orm.em.fork();
  const uid = req.userToken.uid;
  const body = req.body;

  try {
    const imageStatus = await uploadImage(uid, req);

    if (imageStatus.unsupportedImage) {
        return handleCustomError(res, { 
            type: StatusMessageType.ERROR, message: "Image format not supported"
        });
    }

    const profile = await em.upsert(Profile, {
      uid: uid,
      name: body.name,
      preferredLang: body.preferredLang,
      imageUrl: imageStatus.imageUrl,
    });

    await em.persistAndFlush(profile);

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
});

export default router;
