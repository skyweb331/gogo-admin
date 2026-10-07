import UserModeSwitch from "./user-mode-switch";
import UserThemeSwitch from "./user-theme-switch";
import { SyntheticEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { Avatar, Box, Card, CardContent, Chip, Divider, Fade, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuList from "@mui/material/MenuList";
import Popper from "@mui/material/Popper";

import { useAuthContext } from "@/auth";
import { cn } from "@/lib/utils";
import { paths } from "@/routes/paths";
import { useThemeContext } from "@/theme/theme-provider";
import { initials } from "@/utils/string";

export default function User() {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isTopNavContained } = useThemeContext();
  const { user, signOut } = useAuthContext();

  const handleClose = (event: Event | SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) return;
    setOpen(false);
  };

  const avatar = (className: string) => (
    <Avatar alt={user?.name} className={cn("bg-primary/15 text-primary font-semibold", className)}>
      {initials(user?.name)}
    </Avatar>
  );

  return (
    <>
      <Box ref={anchorRef}>
        <Button
          variant="text"
          color="text-primary"
          className={cn(
            "group hover:bg-grey-25 ms-2 hidden gap-2 rounded-lg py-0! pe-0! hover:py-1! hover:pe-1.5! md:flex",
            open && "active bg-grey-25 py-1! pe-1.5!",
            isTopNavContained && "hover:bg-grey-50",
            isTopNavContained && open && "bg-grey-50",
          )}
          onClick={() => setOpen((prev) => !prev)}
        >
          <Box>{user?.name}</Box>
          {avatar(
            cn("large transition-all group-hover:ms-0.5 group-hover:h-8 group-hover:w-8", open && "ms-0.5 h-8! w-8!"),
          )}
        </Button>

        <Button
          variant="text"
          size="large"
          color="text-primary"
          aria-label="Account menu"
          className={cn(
            "hover:bg-grey-25 icon-only hover-icon-shrink [&.active]:text-primary group ms-1 me-1 p-0! hover:p-1.5! md:hidden",
            open && "active bg-grey-25 p-1.5!",
          )}
          onClick={() => setOpen((prev) => !prev)}
          startIcon={avatar(cn("large transition-all group-hover:h-7 group-hover:w-7", open && "h-7! w-7!"))}
        />
      </Box>

      <Popper open={open} anchorEl={() => anchorRef.current!} placement="bottom-end" className="mt-3!" transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <Box>
              <ClickAwayListener onClickAway={handleClose}>
                <Card className="shadow-darker-sm!">
                  <CardContent>
                    <Box className="max-w-64 sm:w-72 sm:max-w-none">
                      <Box className="mb-4 flex flex-col items-center">
                        {avatar("large mb-2")}
                        <Typography variant="subtitle1" component="p">
                          {user?.name}
                        </Typography>
                        <Typography variant="body2" component="p" className="text-text-secondary -mt-2">
                          {user?.email}
                        </Typography>
                        {user && <Chip size="small" variant="outlined" label={user.role} className="mt-2" />}
                      </Box>
                      <Divider className="large" />
                      <MenuList className="p-0">
                        <UserModeSwitch />
                        <UserThemeSwitch />
                      </MenuList>
                      <Box className="my-8"></Box>
                      <Button
                        variant="outlined"
                        size="tiny"
                        color="grey"
                        className="w-full"
                        onClick={async (event) => {
                          handleClose(event);
                          await signOut();
                          navigate(paths.auth.signIn);
                        }}
                      >
                        {t("user-sign-out")}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </ClickAwayListener>
            </Box>
          </Fade>
        )}
      </Popper>
    </>
  );
}
