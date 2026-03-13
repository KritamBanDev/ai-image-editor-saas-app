declare module "gsap/dist/gsap" {
  interface GsapContext {
    revert(): void;
  }

  interface GsapInstance {
    registerPlugin(plugin: object): void;
    context(callback: () => void, scope?: Element | Document | null): GsapContext;
    set(targets: unknown, vars: Record<string, unknown>): void;
    to(targets: unknown, vars: Record<string, unknown>): void;
    fromTo(
      targets: unknown,
      fromVars: Record<string, unknown>,
      toVars: Record<string, unknown>,
    ): void;
  }

  const gsap: GsapInstance;
  export default gsap;
}

declare module "gsap/dist/ScrollTrigger" {
  const ScrollTrigger: object;
  export default ScrollTrigger;
}
