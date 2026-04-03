export default function PageLoader() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <style>
        {`
          @keyframes loaderFloat {
            0%, 100% { transform: translateY(0px) scale(1); opacity: 0.75; }
            50% { transform: translateY(-10px) scale(1.06); opacity: 1; }
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
            0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
            40% { transform: translateY(-6px); opacity: 1; }
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
        <div className="loader-float absolute -left-20 top-[10%] h-40 w-40 rounded-full bg-primary/15 blur-3xl md:h-52 md:w-52" />
        <div
          className="loader-float absolute -right-12 top-[56%] h-48 w-48 rounded-full bg-accent/15 blur-3xl md:h-64 md:w-64"
          style={{ animationDelay: "-2.2s" }}
        />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/8 to-transparent" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-sm text-center sm:max-w-md">
          <div className="mx-auto overflow-hidden rounded-[1.75rem] border border-border/60 bg-card/85 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.45)] backdrop-blur-md sm:p-7">
            <div className="relative mx-auto mb-6 grid h-28 w-28 place-items-center sm:mb-7 sm:h-40 sm:w-40">
              <div className="loader-spin-slow absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary/75" />
              <div className="loader-spin-reverse absolute inset-3 rounded-full border border-primary/15 border-b-primary/60" />

              <div className="loader-float relative rounded-full bg-background/90 p-4 shadow-[0_14px_40px_-22px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:p-5">
                <img
                  src="/logo.png"
                  alt="ShopBazzar"
                  className="h-12 w-auto object-contain drop-shadow-lg sm:h-20"
                />
              </div>
            </div>

            <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Loading experience
            </div>

            <p className="text-sm font-semibold tracking-[0.16em] text-foreground/80 uppercase sm:text-base sm:tracking-[0.22em]">
              Preparing your storefront
            </p>

            <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-muted-foreground sm:text-sm">
              Bringing products, categories, and offers into view.
            </p>

            <div className="mt-5 space-y-3 sm:mt-6">
              <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                <span className="loader-shimmer absolute inset-y-0 left-0 w-1/2 rounded-full bg-gradient-to-r from-primary via-primary/80 to-primary/40" />
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

              <div className="grid grid-cols-3 gap-2 pt-2 text-left text-[10px] text-muted-foreground sm:text-xs">
                <div className="rounded-xl border border-border/60 bg-background/70 px-2 py-2 backdrop-blur-sm">
                  Products
                </div>
                <div className="rounded-xl border border-border/60 bg-background/70 px-2 py-2 backdrop-blur-sm">
                  Categories
                </div>
                <div className="rounded-xl border border-border/60 bg-background/70 px-2 py-2 backdrop-blur-sm">
                  Offers
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
