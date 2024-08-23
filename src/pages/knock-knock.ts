import { zodiac } from 'src/utils/zodiac';

export const prerender = false;

export const GET = zodiac()
  .use('auth')
  .use('site')
  .handle(
    async ctx => {
      const { redirect, request, makeUrl, issueReturnToToken, setCookie } = ctx;
      const rootUrl = makeUrl('/');
      const referer = request.headers.get('Referer');
      if (referer && referer.startsWith(rootUrl)) {
        const returnTo = await issueReturnToToken({ url: `${referer}#enter` });
        setCookie('X-Return-To', returnTo, undefined, undefined, true);
      }
      return redirect("/profile/", 307);
    }
  );
