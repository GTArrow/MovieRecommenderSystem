import "better-auth";

declare module "better-auth" {
  interface BetterAuthUser {
    likedMovieIds?: number[];
  }
}
