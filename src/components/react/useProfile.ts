import * as jose from "jose";
import Cookies from 'js-cookie';
import React from "react";

// const PUBLIC_KEY = await jose.importSPKI(import.meta.env.PUBLIC_KEY.replaceAll('\\n', '\n'), "RS256");

export type Profile = {
  iat: number;
  name?: string;
  'replybox:sso'?: {
    hash: string;
    payload: string;
  },
}

const readProfileBadge = async () => {
  const profileBadgeCookie = Cookies.get('X-Profile-Badge');
  if (!profileBadgeCookie) {
    return undefined;
  }
  // const knockKnockToken = await jose.jwtVerify(profileBadgeCookie, PUBLIC_KEY);
  // return knockKnockToken.payload as Profile;
}

export const useProfile = () => {
  const [profileBadge, setProfileBadge] = React.useState<Profile>();

  React.useEffect(() => {
    readProfileBadge().then(setProfileBadge);
  },
    [],
  );

  return ({
    profileBadge,
  });
};
