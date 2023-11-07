"use client";
import { ChangeEvent, useEffect, useState } from "react";
import { BiUserCircle } from "@react-icons/all-files/bi/BiUserCircle";
import {
  deleteProfileUrl,
  fetchProfileUrl,
  updateProfileUrl,
} from "../api";
import useLogin from "../hooks/useLogin";
import { message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { deleteUser, getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";

const SettingPage = () => {
  const user = useLogin();
  const router = useRouter();

  const deleteProfileMutation = useMutation(async () => deleteProfileUrl(), {
    onSuccess: () => {
      closeModal("delete_modal");
      api.open({
        type: "success",
        content: "Successfully deleted profile! Logging you out...",
      });
      const auth = getAuth();
      if (auth.currentUser) {
        deleteUser(auth.currentUser).then(() => {
          router.push("/");
        });
      }
    },
    onError: (e) => {
      api.open({
        type: "error",
        content: "Failed to delete profile!",
      });
    },
  });

  useEffect(() => {
    fetchProfileUrl().then((res) => {
      setProfileImageUrl(res.payload.imageUrl);
      setPreferredLang(res.payload.preferredLang);
      setName(res.payload.name || "");
    });
  }, []);

  const [api, contextHolder] = message.useMessage();

  const [name, setName] = useState<string>("");
  const [preferredLang, setPreferredLang] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setProfileImageUrl(URL.createObjectURL(file));
    }
  };

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateProfileUrl(name, preferredLang, selectedImage)
      .then((res) => {
        if (res.statusMessage.type.toLowerCase() === "success") {
          api.success({
            type: "success",
            content: "Successfully updated profile!",
          });
        } else {
          api.error({
            type: "error",
            content: "Failed to update profile :(",
          });
        }
      })
      .then(() => {
        window.location.reload();
      });
  };

  const onEscKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key == "Escape" || e.key === "Esc") {
      e.preventDefault();
    }
  };

  const onClickModal = (modalId: string) => {
    if (document) {
      (document.getElementById(modalId) as HTMLFormElement).showModal();
    }
  };

  const closeModal = (modalId: string) => {
    (document.getElementById(modalId) as HTMLFormElement).close();
  };

  return (
    <main className="flex flex-col items-center gap-4 p-12">
      {contextHolder}
      <dialog id="delete_modal" className="modal">
        <div className="modal-box p-6">
          <form method="dialog" className="pb">
            <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h1 className="m-4">Are you sure you want to delete your profile?</h1>
          <div className="flex justify-end gap-2">
            <button
              type="reset"
              onClick={() => {
                closeModal("delete_modal");
              }}
              className="btn btn-error btn-sm text-white hover:bg-red-500"
            >
              No
            </button>
            <button
              type="submit"
              className="btn btn-accent btn-sm text-white"
              onClick={() => {
                deleteProfileMutation.mutate();
                closeModal("delete_modal");
              }}
            >
              Yes
            </button>
          </div>
        </div>
      </dialog>
      <h1 className="text-5xl font-bold text-white underline">User Profile</h1>
      <form
        className="flex flex-col justify-center gap-8 bg-secondary p-12"
        onSubmit={onFormSubmit}
      >
        <section className="flex justify-between gap-16">
          <div className="flex flex-col items-center gap-2 rounded-md bg-white px-4 py-2 shadow-md">
            {profileImageUrl && (
              <div>
                <img
                  src={profileImageUrl}
                  className="aspect-square w-24 rounded-full border border-black"
                  alt="uploaded-image"
                />
              </div>
            )}
            {!profileImageUrl && (
              <BiUserCircle className="text-8xl text-primary" />
            )}
            <input
              type="file"
              id="files"
              className="hidden"
              onChange={handleImageChange}
            />
            <label htmlFor="files" className="btn btn-accent btn-sm text-xs">
              Select Image
            </label>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <label>
              <span>Display Name:</span>
            </label>
            <input
              required
              defaultValue={name ?? "unknown"}
              onChange={(e) => setName(e.target.value)}
              className="rounded-md p-2 text-black"
            />

            <label>
              <span>Preferred Language:</span>
            </label>
            <select
              className="h-8 w-fit rounded-md bg-white px-2 text-black"
              value={preferredLang ?? "python"}
              onChange={(e) => setPreferredLang(e.target.value)}
            >
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </div>
        </section>
        <div className="flex flex-row justify-between gap-10">
          <button
            type="button"
            className="btn btn-error"
            onClick={() => onClickModal("delete_modal")}
          >
            Delete Profile
          </button>
          <button type="submit" className="btn btn-accent flex-grow">
            Save Changes
          </button>
        </div>
      </form>
    </main>
  );
};

export default SettingPage;
