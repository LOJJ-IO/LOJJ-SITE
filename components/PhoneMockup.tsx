type PhoneMockupProps = {
  alt: string;
  image?: string;
  children?: React.ReactNode;
};

export default function PhoneMockup({ image, alt, children }: PhoneMockupProps) {
  return (
    <div className="teammates-phone-wrap">
      <div className="phone-frame">
        <div className="phone-notch" />
        {children ? (
          <div className="phone-screen phone-screen--interactive" role="img" aria-label={alt}>
            {children}
          </div>
        ) : (
          <img src={image} alt={alt} className="phone-screen" />
        )}
      </div>
    </div>
  );
}
