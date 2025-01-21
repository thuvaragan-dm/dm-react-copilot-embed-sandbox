import { User } from "../api/user/types";

export default function modifyUserAvatar(user: User | null): User | null {
  if (!user) return null;

  let avatarUrl = user.avatar_url;
  const keepOriginalAvatar = !user.is_avatar_enabled;

  if (avatarUrl) {
    if (keepOriginalAvatar) {
      avatarUrl = avatarUrl.replace("_avatar", "");
    } else {
      if (!avatarUrl.includes("_avatar.png")) {
        const url = avatarUrl.split(".png")[0];
        avatarUrl = url + "_avatar.png";
      }
    }
  }

  return { ...user, avatar_url: avatarUrl };
}
