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

const readProfileBadge = async () => {
  const profileBadgeCookie = Cookies.get('X-Profile-Badge');
  if (!profileBadgeCookie) {
    return undefined;
  }
  return jose.decodeJwt<Profile>(profileBadgeCookie);
}

export const useProfile = () => {
  const [profileBadge, setProfileBadge] = React.useState<Profile>();

  React.useEffect(
    () => {
      readProfileBadge().then(setProfileBadge);
    },
    [],
  );

  return ({
    profileBadge,
  });
};
