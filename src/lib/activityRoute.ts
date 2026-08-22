import {
  activities,
  type Activity,
  type ActivityRoute,
} from "../data/activities.ts";

export const ACTIVITIES_HUB_ROUTE = "/activities/" as const;

export type ActivitiesPageRoute = typeof ACTIVITIES_HUB_ROUTE | ActivityRoute;

export function normalizeActivityPath(pathname: string): string {
  const withoutQuery = pathname.split(/[?#]/, 1)[0] ?? pathname;
  const withoutIndex = withoutQuery.replace(/index\.html$/, "");
  const withLeadingSlash = withoutIndex.startsWith("/")
    ? withoutIndex
    : `/${withoutIndex}`;
  return withLeadingSlash.endsWith("/")
    ? withLeadingSlash
    : `${withLeadingSlash}/`;
}

export function activityByRoute(pathname: string): Activity | undefined {
  const route = normalizeActivityPath(pathname);
  return activities.find((activity) => activity.route === route);
}

export function isActivitiesHubRoute(pathname: string): boolean {
  return normalizeActivityPath(pathname) === ACTIVITIES_HUB_ROUTE;
}
