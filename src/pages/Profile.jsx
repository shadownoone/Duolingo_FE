import { BottomBar } from "../components/BottomBar";
import { LeftBar } from "../components/LeftBar";

import { Link } from "react-router-dom";
import { Flag } from "../components/Flag";
import { useEffect, useState } from "react";
import {
  BronzeLeagueSvg,
  BronzeSvg,
  CloseSvg,
  EditPencilSvg,
  EmptyFireSvg,
  EmptyMedalSvg,
  FireSvg,
  GoldSvg,
  LightningProgressSvg,
  ProfileFriendsSvg,
  ProfileTimeJoinedSvg,
  SettingsGearSvg,
  SiverSvg,
} from "../components/Svgs";
import { useSelector } from "react-redux";
import { toDateString } from "../utils/dateString";
import UpdateProfile from "../components/UpdateProfile";
import LoginScreen from "./LoginScreen";
import {
  getFollwer,
  getFriend,
  unFollowing,
} from "../services/Friends/friendService";
import { toast } from "react-toastify";
import { getUserBadges } from "../services/UserBadges/userBadgeService";

const Profile = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [counts, setCounts] = useState({ following: 0, followers: 0 });

  useEffect(() => {
    // fetch số following
    getFriend()
      .then((res) => {
        if (res.code === 0) {
          setCounts((c) => ({ ...c, following: res.data.length }));
        }
      })
      .catch(console.error);

    // fetch số followers
    getFollwer()
      .then((res) => {
        if (res.code === 0) {
          setCounts((c) => ({ ...c, followers: res.data.length }));
        }
      })
      .catch(console.error);
  }, []);

  const openEditModal = () => {
    setShowEditModal(true);
  };

  // Hàm đóng modal
  const closeEditModal = () => {
    setShowEditModal(false);
  };

  const currentUser = useSelector((state) => state.user.currentUser);

  const isVip = currentUser?.is_vip === 1;
  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <div>
      <ProfileTopBar />
      <LeftBar selectedTab="Profile" />
      <div className="flex justify-center gap-3 pt-14 md:ml-24 lg:ml-64 lg:gap-12">
        <div className="flex w-full max-w-4xl flex-col gap-5 p-5">
          <ProfileTopSection
            currentUser={currentUser}
            followingCount={counts.following}
            followersCount={counts.followers}
            openEditModal={openEditModal}
            isVip={isVip}
          />
          <ProfileStatsSection currentUser={currentUser} isVip={isVip} />
          <ProfileFriendsSection />
          <UserBadges />
        </div>
      </div>
      <div className="pt-[90px]"></div>
      <BottomBar selectedTab="Profile" />
      {/* Modal Edit Profile */}
      {showEditModal && (
        <ModalOverlay onClose={closeEditModal}>
          <UpdateProfile currentUser={currentUser} onClose={closeEditModal} />
        </ModalOverlay>
      )}
    </div>
  );
};

export default Profile;

function UserBadges() {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const iconMap = {
    Bronze: BronzeSvg,
    Silver: SiverSvg,
    Gold: GoldSvg,
  };

  useEffect(() => {
    setLoading(true);
    getUserBadges()
      .then((res) => {
        if (res.code === 0) {
          setBadges(res.data);
        } else {
          throw new Error(res.message);
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Failed to load badges");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <h2 className="mb-5 text-2xl font-bold">Badges</h2>

      {loading && <p className="text-gray-500">Loading badges…</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && badges.length === 0 && (
        <p className="text-gray-500">You haven’t earned any badges yet.</p>
      )}

      {!loading && !error && badges.length > 0 && (
        <ul className="flex flex-wrap gap-4">
          {badges.map((badge) => {
            // chọn SVG nếu có, ngược lại dùng icon_url
            const SvgIcon = iconMap[badge.badge_name];
            return (
              <li
                key={badge.badge_id}
                className="flex flex-col items-center gap-1"
              >
                {SvgIcon ? (
                  <SvgIcon className="h-12 w-12" />
                ) : (
                  <img
                    src={badge.icon_url}
                    alt={badge.badge_name}
                    className="h-12 w-12"
                  />
                )}
                <span className="text-sm font-medium">{badge.badge_name}</span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function ProfileFriendsSection() {
  const [mode, setMode] = useState("FOLLOWING");
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const loader = mode === "FOLLOWING" ? getFriend() : getFollwer();

    loader
      .then((res) => {
        if (res.code === 0) {
          setFriends(res.data);
        } else {
          throw new Error(res.message);
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Failed to load friends");
      })
      .finally(() => setLoading(false));
  }, [mode]);

  const unFollow = (followedUserId) => {
    toast.warn(`Are you sure you want to unfollow?`, {
      position: "top-right",
      autoClose: 1000,
      closeOnClick: true,
      draggable: true,
      progress: undefined,

      onClose: () => {
        if (window.confirm("Are you sure you want to unfollow this user?")) {
          console.log(`Unfollow user with ID: ${followedUserId}`);

          unFollowing(followedUserId)
            .then((res) => {
              if (res.code === 0) {
                setFriends(
                  friends.filter((friend) => friend.user_id !== followedUserId)
                );

                toast.success("Unfollowed successfully", {
                  position: "top-right",
                  autoClose: 1000,
                  closeOnClick: true,
                  draggable: true,
                  progress: undefined,
                });
              } else {
                toast.error(res.message, {
                  position: "top-right",
                  autoClose: 1000,
                  closeOnClick: true,
                  draggable: true,
                  progress: undefined,
                });
              }
            })
            .catch((err) => {
              console.error(err);
              toast.error("Failed to unfollow", {
                position: "top-right",
                autoClose: 1000,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
              });
            });
        }
      },
    });
  };

  return (
    <section>
      <h2 className="mb-5 text-2xl font-bold">Friends</h2>
      <div className="rounded-2xl border-2 border-gray-200">
        {/* Tabs */}
        <div className="flex">
          {["FOLLOWING", "FOLLOWERS"].map((tab) => (
            <button
              key={tab}
              onClick={() => setMode(tab)}
              className={[
                "flex w-1/2 items-center justify-center border-b-2 py-3 font-bold uppercase transition",
                mode === tab
                  ? "border-blue-400 text-blue-400"
                  : "border-gray-200 text-gray-400 hover:border-blue-400 hover:text-blue-400",
              ].join(" ")}
            >
              {tab === "FOLLOWING" ? "Following" : "Followers"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5">
          {loading && <div className="text-center text-gray-500">Loading…</div>}
          {error && <div className="text-center text-red-500">{error}</div>}

          {!loading && !error && friends.length === 0 && (
            <div className="flex items-center justify-center py-10 text-gray-500">
              {mode === "FOLLOWING"
                ? "Not following anyone yet"
                : "No followers yet"}
            </div>
          )}

          {!loading && !error && friends.length > 0 && (
            <ul className="space-y-4">
              {friends.map((u) => (
                <li key={u.user_id} className="flex items-center gap-4">
                  <img
                    src={u.avatar || "/placeholder-avatar.png"}
                    alt={u.username}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <Link
                    to={`/profile/${u.user_id}`}
                    className="font-semibold text-gray-800 hover:underline"
                  >
                    {u.username}
                  </Link>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => unFollow(u.user_id)}
                  >
                    <CloseSvg />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

const ProfileStatsSection = ({ currentUser, isVip }) => {
  const streak = currentUser.streak_count;
  const totalXp = 125;
  const league = "Bronze";
  const top3Finishes = 0;

  // chung
  const sectionTitleClass = [
    "mb-5 text-2xl font-bold",
    isVip ? "text-blue-600" : "text-gray-700",
  ].join(" ");

  const cardBase =
    "flex gap-2 rounded-2xl p-2 md:gap-3 md:px-6 md:py-4 border-2";
  const cardVip = "border-blue-300 bg-blue-50"; // <-- xanh nhạt
  const cardNormal = "border-gray-200 bg-white";

  const valueClass = isVip
    ? "text-blue-600 text-xl font-bold" // giá trị tông xanh
    : "text-gray-900 text-xl font-bold";
  const labelClass = isVip
    ? "text-blue-500 text-sm md:text-base" // label tông xanh nhạt
    : "text-gray-400 text-sm md:text-base";

  const iconClass = (filled) =>
    isVip
      ? "w-6 h-6 text-blue-600"
      : filled
      ? "w-6 h-6 text-red-500"
      : "w-6 h-6 text-gray-400";

  return (
    <section>
      <h2 className={sectionTitleClass}>Statistics</h2>
      <div className="grid grid-cols-2 gap-3">
        {/* Day streak */}
        <div className={`${cardBase} ${isVip ? cardVip : cardNormal}`}>
          {streak === 0 ? (
            <EmptyFireSvg className={iconClass(false)} />
          ) : (
            <FireSvg className={iconClass(true)} />
          )}
          <div className="flex flex-col">
            <span className={valueClass}>{streak}</span>
            <span className={labelClass}>Day streak</span>
          </div>
        </div>

        {/* Total XP */}
        <div className={`${cardBase} ${isVip ? cardVip : cardNormal}`}>
          <LightningProgressSvg className={iconClass(true)} />
          <div className="flex flex-col">
            <span className={valueClass}>{totalXp}</span>
            <span className={labelClass}>Total XP</span>
          </div>
        </div>

        {/* Current league */}
        <div className={`${cardBase} ${isVip ? cardVip : cardNormal}`}>
          <BronzeLeagueSvg className={iconClass(false)} />
          <div className="flex flex-col">
            <span className={valueClass}>{league}</span>
            <span className={labelClass}>Current league</span>
          </div>
        </div>

        {/* Top 3 finishes */}
        <div className={`${cardBase} ${isVip ? cardVip : cardNormal}`}>
          <EmptyMedalSvg className={iconClass(false)} />
          <div className="flex flex-col">
            <span className={valueClass}>{top3Finishes}</span>
            <span className={labelClass}>Top 3 finishes</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProfileTopBar = () => {
  return (
    <div className="fixed left-0 right-0 top-0 flex h-16 items-center justify-between border-b-2 border-gray-200 bg-white px-5 text-xl font-bold text-gray-300 md:hidden">
      <div className="invisible" aria-hidden={true}>
        <SettingsGearSvg />
      </div>
      <span className="text-gray-400">Profile</span>
      <Link href="/settings/account">
        <SettingsGearSvg />
        <span className="sr-only">Settings</span>
      </Link>
    </div>
  );
};

const ProfileTopSection = ({
  currentUser,
  openEditModal,
  followingCount,
  followersCount,
  isVip,
}) => {
  const current = useSelector((state) => state.language.currentLanguage);

  return (
    <section className="flex flex-row-reverse border-b-2 border-gray-200 pb-8 md:flex-row md:gap-8">
      <div
        className={[
          // chung
          "flex items-center justify-center rounded-full p-1",
          "h-20 w-20 md:h-44 md:w-44",

          // nếu VIP thì ring xanh + offset trắng, ngược lại dashed bình thường
          isVip
            ? "ring-4 ring-cyan-400 ring-offset-2 ring-offset-white shadow-lg"
            : "border-2 border-dashed border-gray-400",
        ].join(" ")}
      >
        {currentUser.avatar ? (
          <img
            src={currentUser.avatar}
            alt="Avatar"
            className="h-full w-full object-cover rounded-full"
          />
        ) : (
          <span className="text-3xl font-bold text-gray-400">
            {(currentUser.username || "U")[0].toUpperCase()}
          </span>
        )}
      </div>
      <div className="flex grow flex-col justify-between gap-3">
        <div className="flex flex-col gap-2">
          <div>
            <h1 className="text-2xl font-bold">
              {currentUser.name}
              {isVip && (
                <span
                  className="
                  ml-3 inline-block whitespace-nowrap
                  bg-gradient-to-r from-green-400 via-cyan-400 to-purple-500
                  bg-clip-text text-transparent
                  text-sm font-semibold
                "
                >
                  SUPER VIP
                </span>
              )}
            </h1>
            <div className="text-sm text-gray-400">{currentUser.username}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-400">
              {currentUser.last_name} {currentUser.first_name}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ProfileTimeJoinedSvg className={isVip ? "text-white" : ""} />
            <span>{`Joined ${toDateString(currentUser.created_at)}`}</span>
          </div>
          <div className="flex items-center gap-3">
            <ProfileFriendsSvg className={isVip ? "text-white" : ""} />
            <span>{`${followingCount} Following / ${followersCount} Followers`}</span>
          </div>
        </div>

        <Flag
          code={current.language_code}
          width={40}
          className={isVip ? "brightness-150" : ""}
        />
      </div>
      <button
        onClick={openEditModal}
        className="hidden items-center gap-2 self-start rounded-2xl border-b-4 border-blue-500 bg-blue-400 px-5 py-3 font-bold uppercase text-white transition hover:brightness-110 md:flex"
      >
        <EditPencilSvg />
        Edit profile
      </button>
    </section>
  );
};

const ModalOverlay = ({ children, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative w-[600px] rounded bg-white p-5 shadow-md"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
