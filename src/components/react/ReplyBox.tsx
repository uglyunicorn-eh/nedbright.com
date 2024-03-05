import React from "react";

interface Props {
  site: string;
  lang?: string;
}

export const ReplyBox = ({ site, lang }: Props) => {
  const [updateCounter, setUpdateCounter] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

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

    script.onload = () => {
      setTimeout(() => setLoading(false), 1000);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [
    updateCounter,
  ]);

  return (
    <div className="transition-all duration-100">
      {
        loading
          ? (
            <div className="mx-auto text-center pt-16 pb-20 w-32" >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 150"><path fill="none" stroke="#CCBDDA" stroke-width="15" stroke-linecap="round" stroke-dasharray="300 385" stroke-dashoffset="0" d="M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z"><animate attributeName="stroke-dashoffset" calcMode="spline" dur="2" values="685;-685" keySplines="0 0 1 1" repeatCount="indefinite"></animate></path></svg>
            </div>
          )
          : null
      }
      <div id="replybox" key={updateCounter} className={loading ? "hidden" : "block"} />
    </div>
  );
};
