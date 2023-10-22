"use client";
import { ChangeEvent, useState } from "react";
import { BiUserCircle } from "@react-icons/all-files/bi/BiUserCircle";
import { updateProfileUrl } from "../api";
import useLogin from "../hooks/useLogin";

const SettingPage = () => {
  const [name, setName] = useState<string | null>(null);
  const [preferredLang, setPreferredLang] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [profile, setProfile] = useLogin((profile) => {});
  if (profile) {
    setName(profile.name);
    setPreferredLang(profile.preferredLang);
    setProfileImageUrl(profile.imageUrl);
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setProfileImageUrl(URL.createObjectURL(file));
    }
  };

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //TODO: submit logic
    updateProfileUrl(name, preferredLang, selectedImage).then((res) => {
      setProfile(res.payload);
    });
  };

  return (
    <main className="flex flex-col items-center gap-4 p-12">
      <h1 className="text-5xl font-bold text-white underline">User Profile</h1>
      <form className="flex flex-col justify-center gap-8 bg-secondary p-12" onSubmit={onFormSubmit}>
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
        <button type="submit" className="btn btn-accent">
          Save Changes
        </button>
      </form>
    </main>
  );
};

export default SettingPage;
