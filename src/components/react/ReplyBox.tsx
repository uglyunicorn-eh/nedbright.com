import React from "react";

import spinner from "public/spinner.svg"

interface Props {
  identifier?: string;
  site: string;
  lang?: string;
}

export const ReplyBox = ({ site, lang, identifier }: Props) => {
  const [loading, setLoading] = React.useState(true);
  const scriptPlaceholderRef = React.useRef<HTMLDivElement | null>(null);

  const { sso } = useReplyBoxSSO();

  React.useEffect(() => {
    window.replybox = {
      site, lang, sso, identifier,
    };
  }, [
    site, lang, sso, identifier,
  ]);

  React.useEffect(() => {
    const script = document.createElement("script");

    setTimeout(() => {
      if (!scriptPlaceholderRef.current) {
        return;
      }

      script.src = "https://cdn.getreplybox.com/js/embed.js";
      script.async = true;

      script.onload = () => {
        setTimeout(() => setLoading(false), 500);
      };

      scriptPlaceholderRef.current.appendChild(script);
    }, 100);

    return () => {
      if (scriptPlaceholderRef.current) {
        scriptPlaceholderRef.current.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="transition-all duration-100" ref={scriptPlaceholderRef}>
      {
        loading
          ? (
            <div className="mx-auto text-center pt-16 pb-20 w-32" >
              <img src={spinner.src} alt="Комментарии загружаются..." width={128} height={64} />
            </div>
          )
          : null
      }
      <div id="replybox" className={loading ? "hidden" : "block"} />
    </div>
  );
};

function useReplyBoxSSO() {
  const [sso, setSSO] = React.useState<{ hash: string; payload: string }>();

  React.useEffect(() => {
  }, []);

  return {
    sso,
  };
}
