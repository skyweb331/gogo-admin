import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router";

import { Box, Paper, Typography } from "@mui/material";

import { useAuthContext } from "@/auth";
import { useLayoutContext } from "@/components/layout/layout-context";
import { PrimaryItem } from "@/components/layout/menu/primary-item";
import { SecondaryItem } from "@/components/layout/menu/secondary-item";
import Logo from "@/components/logo/logo";
import { DEFAULTS } from "@/config";
import IllustrationLaunch from "@/icons/illustrations/illustration-launch";
import { leftMenuBottomItems, leftMenuItems } from "@/layouts/nav-config";
import { cn } from "@/lib/utils";
import { isPathMatch } from "@/lib/utils";
import { paths } from "@/routes/paths";
import { useThemeContext } from "@/theme/theme-provider";
import { MenuItem, MenuShowState, MenuType } from "@/types/types";

export type OpenedAccordion = { indent: number; id: string };

export default function LeftMenu() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const {
    leftMenuType,
    leftMenuWidth,
    leftPrimaryCurrent,
    leftSecondaryCurrent,
    showLeftSecondary,
    hideLeftSecondary,
    hideLeft,
    resetLeftMenu,
    onResetLeft,
    leftShowBackdrop,
    setLeftShowBackdrop,
    showLeftMobileButton,
    temporaryShowPrimaryMenu,
    setTemporaryShowPrimaryMenu,
    menuSelectedSecondaryItem,
    setMenuSelectedSecondaryItem,
  } = useLayoutContext();

  const { user } = useAuthContext();
  const visible = (item: MenuItem) =>
    !item.hideInMenu && (!item.roles || item.roles.some((role) => role === user?.role));

  const selectedPrimary = useRef<undefined | MenuItem>(undefined);
  const [activeItem, setActiveItem] = useState<MenuItem | undefined>(undefined);
  const [openedAccordions, setOpenedAccordions] = useState<OpenedAccordion[]>([]);
  const { isTopNavContained } = useThemeContext();

  const updateSelectedSecondaryItem = useCallback(() => {
    if (!activeItem?.children) {
      setMenuSelectedSecondaryItem(undefined);
      return;
    }

    const findSelectedItem = (items: MenuItem[]): MenuItem | undefined => {
      for (const item of items) {
        if (item.href && isPathMatch(pathname, item.href)) {
          return item;
        }
        if (item.children) {
          const found = findSelectedItem(item.children);
          if (found) return found;
        }
      }
      return undefined;
    };

    setMenuSelectedSecondaryItem(findSelectedItem(activeItem.children));
  }, [activeItem, pathname, setMenuSelectedSecondaryItem]);

  useEffect(() => {
    if (selectedPrimary.current?.id !== activeItem?.id && !leftShowBackdrop) {
      setLeftShowBackdrop(true);
    }
  }, [activeItem?.id, selectedPrimary.current?.id, setLeftShowBackdrop, leftShowBackdrop]);

  useEffect(() => {
    let selectedMenu = leftMenuItems.find((item) => item.href && isPathMatch(pathname, item.href));
    if (!selectedMenu && leftMenuBottomItems) {
      selectedMenu = leftMenuBottomItems.find((item) => item.href && isPathMatch(pathname, item.href));
    }
    selectedPrimary.current = selectedMenu;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveItem(selectedMenu);
    if (temporaryShowPrimaryMenu) {
      setTemporaryShowPrimaryMenu(false);
    }
    resetLeftMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const resetCallback = () => {
      if (selectedPrimary.current) {
        setActiveItem(selectedPrimary.current);
        if (
          !selectedPrimary.current.children ||
          !selectedPrimary.current.children.filter((x) => !x.hideInMenu).length
        ) {
          hideLeftSecondary();
        }
        updateSelectedSecondaryItem();
      }
    };

    onResetLeft(resetCallback);

    return () => {
      onResetLeft(() => {});
    };
  }, [onResetLeft, hideLeftSecondary, updateSelectedSecondaryItem, menuSelectedSecondaryItem]);

  const handleSelectPrimaryItem = (item: MenuItem) => {
    if (!temporaryShowPrimaryMenu && leftMenuType !== MenuType.SingleLayer) {
      setTemporaryShowPrimaryMenu(true);
    }
    setMenuSelectedSecondaryItem(undefined);

    if (item.content) {
      // Primary item has a custom menu and it has children. Show the menu content as temporary and don't navigate to the route.
      // Accordion state is now managed by PrimaryItem component
      showLeftSecondary();
      setActiveItem(item);
    } else if (item.children && item.children.filter((x) => !x.hideInMenu).length > 0) {
      // Primary item is a default menu item with children. Show the sub menu without navigating.
      showLeftSecondary();
      setActiveItem(item);
    } else {
      if (isPathMatch(pathname, item.href || "")) {
        // Primary item is link without children or a content. The route is the same so don't do anything.
        hideLeftSecondary();
        resetLeftMenu();
        setActiveItem(item);
      } else {
        // Primary item is link without children or a content. Navigate to the route.
        setOpenedAccordions((prev) => prev.filter((a) => a.indent !== 0));
        navigate(item.href ?? "");
      }
    }
  };

  useEffect(() => {
    if (!activeItem) {
      if (showLeftMobileButton) {
        hideLeftSecondary();
      } else {
        hideLeft();
      }
    }
  }, [hideLeft, activeItem, showLeftMobileButton, hideLeftSecondary]);

  useEffect(() => {
    if (!activeItem?.children && leftSecondaryCurrent === MenuShowState.Hide) {
      hideLeftSecondary();
    }
  }, [activeItem, hideLeftSecondary, leftSecondaryCurrent]);

  const leftSecondaryDefaultWidth = useMemo(() => DEFAULTS.leftMenuWidth[leftMenuType].secondary, [leftMenuType]);

  useEffect(() => {
    updateSelectedSecondaryItem();
  }, [updateSelectedSecondaryItem]);

  return (
    <nav className={cn("bg-background fixed z-10", isTopNavContained ? "h-[calc(100%)]" : "h-[calc(100%-4rem)]")}>
      <Box className="bg-background-paper shadow-darker-xs flex h-full w-full flex-row rounded-e-4xl">
        <Box
          className={cn(
            "flex h-full shrink-0 grow-0 flex-col items-center overflow-x-hidden py-2.5! transition-all duration-(--layout-duration)",
          )}
          style={{
            ...(leftPrimaryCurrent !== MenuShowState.Hide && leftMenuWidth.primary > 0
              ? { width: `${leftMenuWidth.primary}px` }
              : { width: "0px" }),
          }}
        >
          <Box
            className={cn(
              leftMenuType === MenuType.SingleLayer &&
                leftPrimaryCurrent !== MenuShowState.Hide &&
                leftMenuWidth.primary > 0 &&
                "overflow-y-scroll px-4 pt-2 pb-6",
              "absolute flex h-full min-h-full shrink-0 grow-0 flex-col items-center gap-0.5 overflow-y-auto",
              leftMenuType === MenuType.Minimal &&
                leftPrimaryCurrent !== MenuShowState.Hide &&
                leftMenuWidth.primary > 0 &&
                "overflow-y-scroll ps-2",
              leftMenuType === MenuType.Comfort &&
                leftPrimaryCurrent !== MenuShowState.Hide &&
                leftMenuWidth.primary > 0 &&
                "overflow-y-scroll ps-2.5",
            )}
            style={{
              ...(leftPrimaryCurrent !== MenuShowState.Hide && leftMenuWidth.primary > 0
                ? { width: `${leftMenuWidth.primary}px` }
                : { width: "0px" }),
            }}
          >
            {/* Logo */}
            {isTopNavContained && leftMenuType === MenuType.SingleLayer && (
              <Link to={DEFAULTS.appRoot} className="flex h-16 w-full flex-none items-start justify-center pt-2">
                <Logo classNameFull="flex" classNameMobile="hidden" />
              </Link>
            )}

            {isTopNavContained && leftMenuType === MenuType.Minimal && (
              <Link to={DEFAULTS.appRoot} className="-ml-2 flex h-13 w-full flex-none items-start justify-center pt-2">
                <Logo classNameFull="hidden" classNameMobile="w-6 h-6" />
              </Link>
            )}

            {isTopNavContained && leftMenuType === MenuType.Comfort && (
              <Link to={DEFAULTS.appRoot} className="flex h-17.25 w-full flex-none items-center justify-center">
                <Logo classNameFull="hidden" classNameMobile="w-8 h-9" />
              </Link>
            )}

            {!temporaryShowPrimaryMenu &&
            leftMenuType === MenuType.SingleLayer &&
            (activeItem?.content || menuSelectedSecondaryItem?.content) ? (
              <Box className="flex w-full flex-1 flex-col">
                {(activeItem?.content || menuSelectedSecondaryItem?.content) &&
                  (activeItem?.content || menuSelectedSecondaryItem?.content)}
              </Box>
            ) : (
              <>
                <Box
                  className={cn(
                    "flex w-full flex-1 flex-col gap-0.5",
                    leftMenuType === MenuType.SingleLayer && "gap-1",
                  )}
                >
                  {leftMenuItems.filter(visible).map((item) =>
                    leftMenuType === MenuType.SingleLayer ? (
                      <SecondaryItem
                        className={cn(leftShowBackdrop && "z-20")}
                        item={item}
                        key={`left-menu-primary-item-${leftMenuType}-${item.id}`}
                        indent={0}
                        openedAccordions={openedAccordions}
                        setOpenedAccordions={setOpenedAccordions}
                        onSelect={(item) => {
                          if (temporaryShowPrimaryMenu) {
                            setTemporaryShowPrimaryMenu(false);
                          }
                          handleSelectPrimaryItem(item);
                          setActiveItem(item);
                        }}
                      />
                    ) : (
                      <PrimaryItem
                        className={cn(leftShowBackdrop && "z-20")}
                        item={item}
                        key={`left-menu-primary-item-${leftMenuType}-${item.id}`}
                        onSelect={(item) => handleSelectPrimaryItem(item)}
                        isActive={activeItem?.id === item.id}
                        menuType={leftMenuType}
                      />
                    ),
                  )}
                </Box>
                <Box className={cn("mb-5 flex w-full flex-col gap-0.5")}>
                  {leftMenuBottomItems
                    .filter(visible)
                    .map((item) =>
                      leftMenuType === MenuType.SingleLayer ? (
                        <SecondaryItem
                          className={cn(leftShowBackdrop && "z-20")}
                          item={item}
                          key={`left-menu-bottom-item-${leftMenuType}-${item.id}`}
                          indent={0}
                          openedAccordions={openedAccordions}
                          setOpenedAccordions={setOpenedAccordions}
                          onSelect={(item) => handleSelectPrimaryItem(item)}
                        />
                      ) : (
                        <PrimaryItem
                          className={cn(leftShowBackdrop && "z-20")}
                          item={item}
                          key={`left-menu-bottom-item-${leftMenuType}-${item.id}`}
                          onSelect={(item) => handleSelectPrimaryItem(item)}
                          isActive={activeItem?.id === item.id}
                          menuType={leftMenuType}
                        />
                      ),
                    )}
                </Box>
              </>
            )}
          </Box>
        </Box>
        {(leftMenuType === MenuType.Comfort || leftMenuType === MenuType.Minimal) && (
          <Box
            className={cn(
              "ltr:shadow-line-left rtl:shadow-line-right flex h-full shrink-0 grow-0 overflow-x-hidden transition-all duration-(--layout-duration)",
              leftShowBackdrop && "z-20",
            )}
            style={{
              width:
                ((activeItem?.children && activeItem?.children.filter((x) => !x.hideInMenu).length > 0) ||
                  activeItem?.content) &&
                leftSecondaryCurrent !== MenuShowState.Hide &&
                leftMenuWidth.secondary > 0
                  ? `calc(${leftMenuWidth.secondary}px`
                  : 0,
            }}
          >
            <Box className="h-full w-full">
              <Paper elevation={0} className="h-full w-full rounded-4xl py-3">
                <Box className="relative h-full w-full overflow-x-hidden">
                  <Box
                    style={{ width: leftSecondaryDefaultWidth }}
                    className={cn(
                      "absolute flex h-full min-h-full flex-col gap-2 overflow-y-scroll ps-5.5 pe-4",
                      leftMenuType === MenuType.Minimal ? "py-1.5" : "py-6",
                    )}
                  >
                    {!activeItem?.content && !menuSelectedSecondaryItem?.content && (
                      <>
                        {activeItem?.label && (
                          <Typography variant="h6" className={"text-primary mb-4 px-2.5"}>
                            {t(activeItem?.label)}
                          </Typography>
                        )}
                        <Box className="flex h-full w-full flex-1 flex-col justify-between gap-2">
                          <>
                            <Box className="flex w-full flex-1 flex-col gap-1">
                              {activeItem?.children &&
                                activeItem?.children?.filter((x) => !x.hideInMenu).length > 0 &&
                                activeItem?.children?.filter(visible).map((item) => (
                                  <SecondaryItem
                                    item={item}
                                    key={`left-menu-secondary-item-${leftMenuType}-${activeItem.id}-${item.id}`}
                                    indent={0}
                                    openedAccordions={openedAccordions}
                                    setOpenedAccordions={setOpenedAccordions}
                                    onSelect={(item) => {
                                      setMenuSelectedSecondaryItem(item);
                                    }}
                                  />
                                ))}
                            </Box>

                            <Box
                              component={Link}
                              to={paths.failedPayouts}
                              className="group flex w-full cursor-pointer flex-col items-center justify-center gap-2"
                            >
                              <IllustrationLaunch className="text-primary h-45 w-45 bg-cover bg-center" />
                              <Typography variant="body1" className="px-4 text-center">
                                {t("menu-cta-copy")}
                              </Typography>
                              <Box className="group-hover:bg-primary/10 text-primary rounded-md px-5 py-2 font-medium transition-colors">
                                {t("menu-cta-button")}
                              </Box>
                            </Box>
                          </>
                        </Box>
                      </>
                    )}
                    {(activeItem?.content || menuSelectedSecondaryItem?.content) &&
                      (activeItem?.content || menuSelectedSecondaryItem?.content)}
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Box>
        )}
      </Box>
    </nav>
  );
}
