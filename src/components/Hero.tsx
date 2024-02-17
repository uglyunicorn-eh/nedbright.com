import heroImage from "public/images/hero-image.png";

export type HeroProps = {
  heroHeadline: string;
  heroIntroText: string;
};

type ComponentProps = {
  data: HeroProps;
};

export const Hero = ({
  data: { heroHeadline, heroIntroText },
}: ComponentProps) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white/50 to-transparent">
      {/* Blob 2 */}

      <div className="relative z-10 mx-auto grid max-w-5xl py-12 px-6 sm:py-32 md:grid-cols-2 md:py-48 lg:px-8">
        <div className="absolute bottom-0 -right-24">
          <div className="h-[400px] w-[500px] bg-[radial-gradient(50%_50%_at_50%_50%,#cfbcdc_0%,rgba(207,188,220,0.66)_24.48%,rgba(239,238,243,0)_100%)] opacity-60 mix-blend-color-burn [animation-delay:2s]"></div>
        </div>
        <img
          src={heroImage.src}
          alt=""
          className="absolute right-0 bottom-0 hidden max-w-[70%] md:block"
        />

        {/* Mobile image */}
        <img
          src={heroImage.src}
          alt=""
          className="mx-auto w-[85%] max-w-[80%] md:hidden"
        />
        <div>
          <h1 className="mt-0 text-4xl font-bold sm:text-5xl md:mt-20 md:text-6xl lg:text-7xl">
            {heroHeadline}
          </h1>
          <p className="mt-6 sm:mt-10 sm:text-xl sm:leading-8">
            {heroIntroText}
          </p>

          {/* Buttons */}
          <div className="mt-12 flex flex-wrap items-center gap-6 md:mt-20 md:gap-6">
            <a
              href="#"
              className="rounded-full border border-black px-5 py-2.5 font-medium hover:bg-gray-200/25"
            >
              Watch promo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
