import { useProfile } from "src/components/react/useProfile";

export const IfAnonymous = ({ children }: { children: React.ReactNode }) => {
  const { profileBadge } = useProfile();
  if (profileBadge) {
    return null;
  }
  return <>{children}</>;
};
