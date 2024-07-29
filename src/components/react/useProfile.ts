import * as jose from "jose";
import Cookies from 'js-cookie';
import React from "react";

export type Profile = {
  iat: number;
  name?: string;
  'replybox:sso'?: {
    hash: string;
    payload: string;
  },
}

const readProfileBadge = async (publicKey: string) => {
  const profileBadgeCookie = Cookies.get('X-Profile-Badge');
  if (!profileBadgeCookie) {
    return undefined;
  }
  const PUBLIC_KEY = await jose.importSPKI(publicKey, "RS256");
  const knockKnockToken = await jose.jwtVerify(profileBadgeCookie, PUBLIC_KEY);
  return knockKnockToken.payload as Profile;
}

export const usePublicKey = () => {
  const [publicKey, setPublicKey] = React.useState<string>();

  const cookie = Cookies.get('X-Public-Key');

  React.useEffect(
    () => {
      setPublicKey(cookie ? atob(cookie) : undefined);
    },
    [
      cookie,
    ],
  );

  return publicKey;
}

export const useProfile = () => {
  const publicKey = usePublicKey();
  const [profileBadge, setProfileBadge] = React.useState<Profile>();

  React.useEffect(
    () => {
      if (!publicKey) {
        return;
      }
      readProfileBadge(publicKey).then(setProfileBadge);
    },
    [
      publicKey,
    ],
  );

  return ({
    profileBadge,
  });
};
