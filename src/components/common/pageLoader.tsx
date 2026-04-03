export default function PageLoader() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <style>
        {`
          @keyframes loaderFloat {
            0%, 100% { transform: translateY(0px) scale(1); opacity: 0.85; }
            50% { transform: translateY(-12px) scale(1.08); opacity: 1; }
          }

          @keyframes loaderSpinSlow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes loaderSpinReverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }

          @keyframes loaderPop {
            0%, 80%, 100% { transform: translateY(0); opacity: 0.45; }
            40% { transform: translateY(-7px); opacity: 1; }
          }

          @keyframes loaderShimmer {
            0% { transform: translateX(-140%); }
            100% { transform: translateX(140%); }
          }

          .loader-float {
            animation: loaderFloat 4.5s ease-in-out infinite;
          }

          .loader-spin-slow {
            animation: loaderSpinSlow 7s linear infinite;
          }

          .loader-spin-reverse {
            animation: loaderSpinReverse 9s linear infinite;
          }

          .loader-dot {
            animation: loaderPop 1s ease-in-out infinite;
          }

          .loader-shimmer {
            animation: loaderShimmer 2s ease-in-out infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .loader-float,
            .loader-spin-slow,
            .loader-spin-reverse,
            .loader-dot,
            .loader-shimmer {
              animation: none !important;
            }
          }
        `}
      </style>

      <div className="pointer-events-none absolute inset-0">
        <div className="loader-float absolute -left-15 top-[12%] h-44 w-44 rounded-full bg-primary/20 blur-3xl" />
        <div
          className="loader-float absolute -right-10 top-[56%] h-52 w-52 rounded-full bg-accent/20 blur-3xl"
          style={{ animationDelay: "-2.2s" }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-xs text-center">
          <div className="relative mx-auto mb-8 grid h-44 w-44 place-items-center">
            <div className="loader-spin-slow absolute inset-0 rounded-full border-2 border-primary/25 border-t-primary/70" />
            <div className="loader-spin-reverse absolute inset-3 rounded-full border border-primary/15 border-b-primary/60" />

            <div className="loader-float relative rounded-full bg-background/85 p-5 shadow-[0_16px_45px_-20px_rgba(0,0,0,0.45)] backdrop-blur-sm">
              <img
                src="/logo.png"
                alt="ShopBazzar"
                className="h-20 w-auto object-contain drop-shadow-lg"
              />
            </div>
          </div>

          <p className="mb-4 text-sm font-medium tracking-[0.18em] text-foreground/80 uppercase">
            Preparing your storefront
          </p>

          <div className="relative mx-auto mb-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <span className="loader-shimmer absolute inset-y-0 left-0 w-1/2 rounded-full bg-primary/80" />
          </div>

          <div className="flex items-center justify-center gap-2">
            <span className="loader-dot h-2 w-2 rounded-full bg-primary" />
            <span
              className="loader-dot h-2 w-2 rounded-full bg-primary"
              style={{ animationDelay: "0.15s" }}
            />
            <span
              className="loader-dot h-2 w-2 rounded-full bg-primary"
              style={{ animationDelay: "0.3s" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
