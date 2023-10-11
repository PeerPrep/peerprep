"use client";

import Button from "@/app/components/button/Button";
import { useState } from "react";
import Select, { MultiValue } from "react-select";

const AdminPortalPage = () => {
  interface SelectOptionType {
    label: string;
    value: string;
  }
  const adminOptions: MultiValue<SelectOptionType> = [
    { label: "Hello", value: "123" },
    { label: "Hello2", value: "456" },
  ];

  const handleSelectChange = (
    selectedOptions: MultiValue<SelectOptionType>,
  ) => {
    setSelectedQnType(selectedOptions);
  };

  const [selectedQnType, setSelectedQnType] = useState<
    MultiValue<SelectOptionType>
  >([]);

  return (
    <main className="mt-12 flex flex-col items-center justify-center">
      <h1 className="mb-2 block text-5xl font-bold text-white underline">
        Admin Portal
      </h1>
      <div className="flex flex-col gap-8 bg-secondary p-12">
        <h2 className="text-3xl font-medium text-white underline">
          Grant Admin Rights
        </h2>
        <section className="flex items-center gap-4">
          <label htmlFor="admin-portal" className="block text-2xl text-white">
            Selected Users:
          </label>
          <Select
            instanceId="admin-portal"
            isMulti
            required
            value={selectedQnType}
            onChange={handleSelectChange}
            name="question type"
            options={adminOptions}
            className="basic-multi-select min-w-[35svw] text-xl text-black"
            classNamePrefix="select"
          />
        </section>
        <Button className="btn-accent" onClick={() => "todo"}>
          Grant Access
        </Button>
      </div>
    </main>
  );
};

export default AdminPortalPage;
