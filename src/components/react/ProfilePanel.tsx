import { ProfileForm, SignInForm, useProfile } from ".";

import logo from "/logo-hd.svg?url";

export const ProfilePanel = () => {
  const { profileBadge } = useProfile();

  return (
    <div
      className="flex h-full flex-col gap-4 rounded-3xl bg-white/50 p-8 shadow-2xl shadow-black/30 backdrop-blur-lg"
    >
      <img src={logo} alt="Logo" className="mx-auto mb-10 h-56 py-4" />

      {profileBadge
        ? <ProfileForm profileBadge={profileBadge} />
        : <SignInForm />
      }
    </div>
  );
};
