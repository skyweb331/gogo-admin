import { gql } from "@/__generated__";
import { useQuery } from "@apollo/client/react";

export const APP_INFO = gql(`
  query AppInfo {
    appInfo {
      sandbox
      bridgeEnv
      defaultPayoutChain
    }
  }
`);

export function useAppInfo() {
  const { data } = useQuery(APP_INFO, { fetchPolicy: "cache-first" });
  return data?.appInfo;
}
