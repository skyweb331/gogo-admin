import { type NextureIconsProps } from "./icon-props";
import NiArrowLeftRight from "./nexture/ni-arrow-left-right";
import NiDashboard from "./nexture/ni-dashboard";
import NiDocumentCode from "./nexture/ni-document-code";
import NiExclamationSquare from "./nexture/ni-exclamation-square";
import NiFlask from "./nexture/ni-flask";
import NiMessages from "./nexture/ni-messages";
import NiPercent from "./nexture/ni-percent";
import NiPulse from "./nexture/ni-pulse";
import NiSettings from "./nexture/ni-settings";
import NiShieldCheck from "./nexture/ni-shield-check";
import NiUser from "./nexture/ni-user";
import NiUsers from "./nexture/ni-users";

export { type IconSize, type IconVariant, type NextureIconsProps, sizeHelper, strokeSizeHelper } from "./icon-props";

/**
 * Icons referenced by name from `layouts/nav-config.ts`. Everything else imports its icon
 * directly from `./nexture/*`, so only these end up in the main bundle; add new menu icons here.
 */
export const IconMap = {
  NiArrowLeftRight,
  NiDashboard,
  NiDocumentCode,
  NiExclamationSquare,
  NiFlask,
  NiMessages,
  NiPercent,
  NiPulse,
  NiSettings,
  NiShieldCheck,
  NiUser,
  NiUsers,
};

export type IconName = keyof typeof IconMap;

export type NextureIconsPropsComponent = NextureIconsProps & {
  icon: IconName;
};

const NextureIcons: React.FC<NextureIconsPropsComponent> = ({
  icon,
  size = 20,
  variant = "outlined",
  className,
  strokeWidth = 1.5,
  oneTone = false,
}) => {
  const IconComponent = IconMap[icon];
  if (!IconComponent) {
    console.warn(`Icon "${icon}" not found in IconMap.`);
    return null;
  }
  return (
    <IconComponent variant={variant} size={size} className={className} strokeWidth={strokeWidth} oneTone={oneTone} />
  );
};

export default NextureIcons;
