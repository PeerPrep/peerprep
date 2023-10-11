import { UserState } from "@/libs/innkeeper-api-types";

interface UserStateBadgeProps {
  userState: Omit<UserState, "version">; // Update the prop name to 'userState'
}

const UserStateBadge: React.FC<UserStateBadgeProps> = ({ userState }) => {
  const { userId, status, lastSeen } = userState;
  return (
    status !== "EXITED" && (
      <div className="flex items-center gap-2">
        <div
          className="tooltip"
          data-tip={`Last Seen: ${lastSeen} seconds ago`}
        >
          <div
            className={`aspect-square w-4 rounded-full ${
              status === "INACTIVE"
                ? "bg-gray-200"
                : status === "ACTIVE"
                ? "bg-success"
                : ""
            }`}
          />
        </div>
        <h3>{userId}</h3>
      </div>
    )
  );
};

export default UserStateBadge;
