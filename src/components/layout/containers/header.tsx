import Mode from "../mode/mode";
import User from "../user/user";
import { Link } from "react-router";

import { Box, Button, Chip, Tooltip } from "@mui/material";

import { useLayoutContext } from "@/components/layout/layout-context";
import Logo from "@/components/logo/logo";
import { CONFIG, DEFAULTS } from "@/config";
import NiMenuSplit from "@/icons/nexture/ni-menu-split";
import { cn } from "@/lib/utils";
import { useThemeContext } from "@/theme/theme-provider";
import { MenuShowState } from "@/types/types";

export default function Header() {
  const { showLeftInMobile, showLeftMobileButton, leftPrimaryCurrent, leftShowBackdrop, hideLeft } = useLayoutContext();
  const { isTopNavContained } = useThemeContext();

  return (
    <Box className={cn("mui-fixed sticky top-0 h-16 w-full", isTopNavContained ? "z-5" : "z-20")} component="header">
      <Box
        className={cn(
          "flex h-full w-full flex-none flex-row items-center",
          isTopNavContained
            ? "bg-transparent shadow-[0_1px_0_0] shadow-gray-100 backdrop-blur-xl"
            : "shadow-darker-xs bg-background-paper rounded-b-3xl",
        )}
        style={{ padding: `0 var(--main-padding)` }}
      >
        {/* Backgrounds to fix left and right colors */}
        {!isTopNavContained && (
          <>
            <Box
              className={cn(
                "bg-background-paper absolute inset-0 -z-10 rounded-b-3xl",
                leftPrimaryCurrent !== MenuShowState.Hide && "rounded-bl-none! rtl:rounded-br-none!",
                showLeftMobileButton && "bg-background rounded-none",
              )}
            ></Box>
            <Box
              className={cn(
                "bg-background absolute inset-0 -z-10 rounded-b-3xl",
                leftPrimaryCurrent !== MenuShowState.Hide && "rounded-br-none! rtl:rounded-bl-none!",
                showLeftMobileButton && "bg-background rounded-none",
              )}
            ></Box>
          </>
        )}

        {/* Left menu button */}
        <Button
          variant="text"
          size="large"
          color="text-primary"
          className={cn(
            "icon-only hover-icon-shrink [&.active]:text-primary [&.active]:bg-grey-25 hover:bg-grey-25",
            showLeftMobileButton ? "flex" : "hidden",
            leftPrimaryCurrent !== MenuShowState.Hide && "active",
          )}
          onClick={() => (leftShowBackdrop ? hideLeft() : showLeftInMobile())}
          startIcon={<NiMenuSplit size={24} />}
        />

        <Box className="flex h-full flex-1 flex-row items-center gap-4 md:gap-6">
          {!isTopNavContained && (
            <Link to={DEFAULTS.appRoot}>
              <Logo classNameFull="ms-2 hidden md:block" classNameMobile="ms-2 md:hidden" />
            </Link>
          )}
          {CONFIG.SANDBOX && (
            <Tooltip title="Bridge sandbox: no real money moves">
              <Chip label="Sandbox" size="small" color="warning" variant="outlined" />
            </Tooltip>
          )}
        </Box>

        <Box className="flex flex-row sm:gap-1">
          <Mode />
        </Box>

        <User />
      </Box>
    </Box>
  );
}
