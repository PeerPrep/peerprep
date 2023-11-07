"use client";

import { fetchAllUsers, promoteToAdmin } from "@/app/api";
import Button from "@/app/components/button/Button";
import useAdmin from "@/app/hooks/useAdmin";
import LoadingPage from "@/app/loading";
import { message } from "antd";
import { useEffect, useState } from "react";
import Select, { MultiValue } from "react-select";

const AdminPortalPage = () => {
  const { isAdmin, isLoading } = useAdmin();
  const [api, contextHolder] = message.useMessage();

  type User = {
    uid: string;
    name: string;
    imageUrl: string | null;
    preferredLang: string | null;
    role: string;
  };

  interface SelectOptionType {
    label: string;
    value: string;
  }
  const [adminOptions, setAdminOptions] = useState<
    MultiValue<SelectOptionType>
  >([]);

  const fetchAndSetAllUsers = () => {
    fetchAllUsers().then((allUsers) => {
      setAdminOptions(
        allUsers.payload
          .filter((user: User) => user.role === "user")
          .map((user: User) => ({ label: user.name, value: user.uid })),
      );
    });
  };

  useEffect(() => {
    fetchAndSetAllUsers();
  }, []);

  const handleSelectChange = (
    selectedOptions: MultiValue<SelectOptionType>,
  ) => {
    setSelectedAdmins(selectedOptions);
  };

  const [selectedAdmins, setSelectedAdmins] = useState<
    MultiValue<SelectOptionType>
  >([]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!isAdmin) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex items-center">
          <h1 className="text-6xl text-white">401</h1>
          <div className="divider divider-horizontal h-24"></div>
          <h2 className="text-xl text-white">Unauthorized</h2>
        </div>
      </div>
    );
  }

  return (
    <main className="mt-12 flex flex-col items-center justify-center">
      {contextHolder}
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
            value={selectedAdmins}
            onChange={handleSelectChange}
            name="question type"
            options={adminOptions}
            className="basic-multi-select min-w-[35svw] text-xl text-black"
            classNamePrefix="select"
          />
        </section>
        <Button
          className="btn-accent"
          onClick={() => {
            promoteToAdmin(selectedAdmins.map((option) => option.value))
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
                fetchAndSetAllUsers();
                setSelectedAdmins([]);
              });
          }}
        >
          Grant Access
        </Button>
      </div>
    </main>
  );
};

export default AdminPortalPage;
