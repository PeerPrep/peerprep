import { UserState } from "@/libs/innkeeper-api-types";
import { BiUserCircle } from "@react-icons/all-files/bi/BiUserCircle";

interface UserStateBadgeProps {
  userState: UserState; // Update the prop name to 'userState'
}

const fromEpochToRelative = (epochTime: number) => {
  const now = Math.floor(Date.now() / 1000);
  const seconds = now - epochTime;
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
};

const UserStateBadge: React.FC<UserStateBadgeProps> = ({ userState }) => {
  const { displayName, status, lastSeen, imageUrl } = userState;
  const lastSeenRelative = fromEpochToRelative(lastSeen);
  return status !== "EXITED" ? (
    <div className="flex items-center">
      <div className="tooltip" data-tip={`Last Seen: ${lastSeenRelative}`}>
        <div
          className={`mr-3 aspect-square w-4 rounded-full ${
            status === "INACTIVE"
              ? "bg-gray-200"
              : status === "ACTIVE"
              ? "bg-success"
              : ""
          }`}
        />
      </div>
      {imageUrl ? (
        <img
          src={imageUrl}
          className="mr-2 aspect-square w-8 rounded-full"
        ></img>
      ) : (
        <BiUserCircle className="mr-2 aspect-square w-8 text-4xl" />
      )}

      <h3>{displayName}</h3>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <div className="tooltip" data-tip={`Left: ${lastSeenRelative}`}>
        <div className={`aspect-square w-4 rounded-full bg-red-700`} />
      </div>
      <h3>{displayName}</h3>
    </div>
  );
};

export default UserStateBadge;
