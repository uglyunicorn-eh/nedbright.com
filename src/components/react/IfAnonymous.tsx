import { useProfile } from "src/components/react/useProfile";

export const IfAnonymous = ({ children }: { children: React.ReactNode }) => {
  const { profileBadge } = useProfile();
  console.log({ profileBadge });
  if (profileBadge) {
    return null;
  }
  return <>{children}</>;
};
