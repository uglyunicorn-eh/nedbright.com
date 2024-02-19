import type React from "react";

import { SocialIcons } from "src/components";


type SocialLinks = {
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  github?: string | null;
  youtube?: string | null;
  tiktok?: string | null;
};

export type FooterMenu = {
  section: string;
  items: {
    label: string;
    url: string | null;
  }[];
}[];

type ComponentProps = {
  title?: string;
  footerNote?: React.ReactNode;
  copy?: React.ReactNode;
  social?: SocialLinks;
  menu?: FooterMenu;
};

const SocialIcon = ({ icon, href, name }: { icon: React.ReactNode, href?: string | null, name: string }) => (
  <>
    {href && (
      <a key={name} href={href} target="_blank" title={name}>
        <span className="sr-only">{name}</span>
        {icon}
      </a>
    )}
  </>
);

export const Footer = ({
  title,
  footerNote,
  copy = <>&copy; All rights reserved.</>,
  social,
  menu,
}: ComponentProps) => (
  <footer className="sticky bottom-0 bg-blob-2 overflow-hidden " aria-labelledby="footer-heading" >
    <h2 id="footer-heading" className="sr-only">
      Footer
    </h2>

    <div className="absolute z-1 -top-64 left-0 aspect-[10/8] w-[1200px] animate-float bg-[radial-gradient(50%_50%_at_50%_50%,#e3a9c1_0%,theme(colors.blob-1)_24.48%,rgba(239,238,243,0)_100%)]"></div>
    <div className="absolute z-1 -top-64 -left-64 aspect-[10/8] h-full w-[1200px] animate-float bg-[radial-gradient(50%_50%_at_50%_50%,#f4ddcd_0%,theme(colors.blob-2)_24.48%,rgba(239,238,243,0)_100%)] opacity-50 mix-blend-overlay [animation-delay:4s]"></div>

    <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32 relative isolate z-40">
      <div className="md:grid md:grid-cols-2 xl:grid-cols-3 xl:gap-16">
        <div className="space-y-8 border-r-zinc-700 xl:border-r xl:pr-12">

          <img className="h-16" src="/logo.svg" alt={title} />

          {footerNote && (
            <p className="text-xs text-balance">
              {footerNote}
            </p>
          )}

          <div className="flex space-x-4">
            <SocialIcon icon={<SocialIcons.Facebook className="h-6" aria-hidden="true" />} name="Facebook" href={social?.facebook} />
            <SocialIcon icon={<SocialIcons.Instagram className="h-6" aria-hidden="true" />} name="Instagram" href={social?.instagram} />
            <SocialIcon icon={<SocialIcons.Twitter className="h-6" aria-hidden="true" />} name="X" href={social?.twitter} />
            <SocialIcon icon={<SocialIcons.YouTube className="h-6" aria-hidden="true" />} name="YouTube" href={social?.youtube} />
            <SocialIcon icon={<SocialIcons.TikTok className="h-6" aria-hidden="true" />} name="TikTok" href={social?.tiktok} />
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
          {menu?.map((section) => (
            <div key={section.section}>
              <h3 className="text-sm font-semibold leading-6">{section.section}</h3>
              <ul role="list" className="mt-6 space-y-4">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <a href={item.url ?? "#"} className="text-sm leading-6 hover:underline hover:underline-offset-2">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {copy && (
        <div className="mt-16 sm:mt-20 lg:mt-24 text-xs">
          {copy}
        </div>
      )}
    </div>
  </footer>
);
