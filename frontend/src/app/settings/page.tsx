"use client";
import { ChangeEvent, useState } from "react";
import { BiUserCircle } from "@react-icons/all-files/bi/BiUserCircle";

const SettingPage = () => {
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">(
    "Easy",
  );

  //TODO: Fetch image
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedImage(file);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //TODO: submit logic
  };

  return (
    <main className="flex flex-col items-center gap-4 p-12">
      <h1 className="text-5xl font-bold text-white underline">User Profile</h1>
      <form className="flex flex-col justify-center gap-8 bg-secondary p-12">
        <section className="flex justify-between gap-16">
          <div className="flex flex-col items-center gap-2 rounded-md bg-white px-4 py-2 shadow-md">
            {selectedImage && (
              <div>
                <img
                  src={URL.createObjectURL(selectedImage)}
                  className="aspect-square w-24 rounded-full border border-black"
                  alt="uploaded-image"
                />
              </div>
            )}
            {!selectedImage && (
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
              defaultValue="hello"
              className="rounded-md p-2 text-black"
            />
            <label>
              <span>Difficulty Setting:</span>
            </label>
            <div className="join">
              <button
                type="button"
                className={`btn btn-primary join-item text-white ${
                  difficulty == "Easy" && "btn-success"
                }`}
                onClick={() => setDifficulty("Easy")}
              >
                Easy
              </button>
              <button
                type="button"
                className={`btn btn-primary join-item text-white ${
                  difficulty == "Medium" && "btn-warning"
                }`}
                onClick={() => setDifficulty("Medium")}
              >
                Medium
              </button>
              <button
                type="button"
                className={`btn btn-primary join-item text-white ${
                  difficulty == "Hard" && "btn-error"
                }`}
                onClick={() => setDifficulty("Hard")}
              >
                Hard
              </button>
            </div>
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
