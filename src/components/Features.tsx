import featuresImage from "public/images/features-image.png";
import featuresImageCropped from "public/images/features-image-cropped.png";

const features = [
  {
    id: 1,
    title: `Created by slate. <br />
  Powered by iPhone.`,
    text: `Featuring advanced encryption technology, Slate takes full
  advantage of the latest device privacy and performance
  capabilities available.`,
  },
  {
    id: 2,
    title: `No surcharges. <br />
    Not even international ones.`,
    text: `Featuring advanced encryption technology, Slate takes full
  advantage of the latest device privacy and performance
  capabilities available.`,
  },
  {
    id: 3,
    title: `Peace of mind payments for your everyday transactions.`,
    text: `Featuring advanced encryption technology, Slate takes full
  advantage of the latest device privacy and performance
  capabilities available.`,
  },
];

export const Features = () => {
  return (
    <section id="features" className="isolate md:py-32">
      <div className="mx-auto grid max-w-5xl items-center gap-y-6 px-4 md:grid-cols-2 lg:px-8">
        <div className="hidden md:block">
          <img
            src={featuresImage.src}
            width={900}
            height={1600}
            alt=""
            className="rounded-2xl"
          />
        </div>
        <div className="md:hidden">
          <img
            src={featuresImageCropped.src}
            width={900}
            height={900}
            alt=""
            className="rounded-2xl"
          />
        </div>
        <ul
          className="space-y-4 md:space-y-8"
        >
          {features.map((feature) => (
            <li
              key={feature.id}
              value={feature.id.toString()}
              className="relative rounded-2xl p-10 backdrop-blur-sm data-[state=open]:bg-white/60 data-[state=closed]:bg-white/30"
            >
              <h2 className="text-2xl font-bold leading-7">
                <span dangerouslySetInnerHTML={{ __html: feature.title }} />
              </h2>
              <p className="mt-4">{feature.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
