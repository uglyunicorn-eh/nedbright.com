import React from "react";

interface Props {
  site: string;
  lang?: string;
}

export const ReplyBox = ({ site, lang }: Props) => {
  const [updateCounter, setUpdateCounter] = React.useState(0);

  React.useEffect(() => {
    window.replybox = {
      site, lang,
    };

    const handler = () => {
      setUpdateCounter((prev) => prev + 1);
    };

    document.addEventListener('astro:after-swap', handler);

    return () => {
      document.removeEventListener('astro:after-swap', handler);
    };
  }, [
    site, lang,
  ]);

  React.useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.getreplybox.com/js/embed.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [
    updateCounter,
  ]);

  return <div id="replybox" key={updateCounter}></div>;
};
