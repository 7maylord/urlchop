const Footer = () => {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-5 py-6 text-sm text-muted sm:flex-row">
        <span className="font-mono text-ink">urlchop</span>
        <span>Brief is the new black.</span>
        <span>&#169; {new Date().getFullYear()} UrlChop &middot; MayLord</span>
      </div>
    </footer>
  );
};

export default Footer;
