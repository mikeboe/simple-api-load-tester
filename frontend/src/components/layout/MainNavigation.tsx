import { classNames } from "@rcktsftwr/components";
import { Link } from "react-router-dom";

type MainNavigationProps = {
  mainNav: {
    sectionName: string;
    items: {
      name: string;
      to: string;
      icon: any;
      current: boolean;
      badgeLabel?: string | undefined;
      badge?: string | undefined;
    }[];
  }[];
  sidebarExpanded: boolean;
};



const MainNavigation = ({ mainNav, sidebarExpanded }: MainNavigationProps) => {
  return (
    <>
      {mainNav.map((navItem) => (
        <li key={navItem.sectionName}>
          <div className="text-xs font-semibold leading-6 text-gray-400 dark:text-gray-500">
            {sidebarExpanded ? (
              <>
                {navItem.sectionName === "General" ? (
                  <></>
                ) : (
                  navItem.sectionName
                )}
              </>
            ) : (
              " "
            )}
          </div>
          <ul className="-mx-2 ">
            {navItem.items.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.to}
                  className={classNames(
                    item.current
                      ? "bg-gray-50 dark:bg-gray-700 text-green-700"
                      : "text-gray-700 hover:text-green-700 dark:hover:text-green-700 hover:bg-gray-50 dark:text-white",
                    "group flex gap-x-3 rounded-md p-1 text-sm leading-6 font-semibold"
                  )}
                >
                  <item.icon
                    className={classNames(
                      item.current
                        ? "text-green-700"
                        : "text-gray-400 group-hover:text-green-700 dark:text-white",
                      "h-6 w-6 shrink-0"
                    )}
                    aria-hidden="true"
                  />
                  {sidebarExpanded ? item.name : null}
                  {/* {sidebarExpanded && item.badge && item.badge === "new" ? (
                    <NavigationBadge label={item.badgeLabel} />
                  ) : null} */}
                </Link>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </>
  );
};

/* const MainNavMobile = ({ mainNav }: any) => {
    return (
        {mainNav.map((navItem) => (
            <li key={navItem.sectionName}>
              <div className="text-xs font-semibold leading-6 text-gray-400 dark:text-gray-600">
                {navItem.sectionName === 'General' ? <></> : null}
              </div>
              <ul className="-mx-2 mt-2 space-y-1">
                {navItem.items.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.to}
                      className={classNames(
                        item.current
                          ? 'bg-gray-50 dark:bg-gray-700 text-green-700'
                          : 'text-gray-700 hover:text-green-700 hover:bg-gray-50',
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                      )}
                    >
                      <item.icon
                        className={classNames(
                          item.current
                            ? 'text-green-700'
                            : 'text-gray-400 group-hover:text-green-700',
                          'h-6 w-6 shrink-0',
                        )}
                        aria-hidden="true"
                      />
                      <span>{item.name}</span>
                      {item.badge && item.badge === 'new' ? (
                        <NavigationBadge
                          label={item.badgeLabel}
                        />
                      ) : null}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
    )
} */

export { MainNavigation };
