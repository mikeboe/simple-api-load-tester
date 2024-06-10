import { Squares2X2Icon, Cog6ToothIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";

type SettingsNavProps = {
  sidebarExpanded: boolean;
};

const SettingsNav = ({ sidebarExpanded }: SettingsNavProps) => {
  return (
    <>
      <Link
        to={"./integrations"}
        className="group -mx-2 flex gap-x-3 rounded-md p-1 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 dark:hover:text-green-700 hover:text-green-700 dark:text-white"
      >
        <Squares2X2Icon
          className="h-6 w-6 shrink-0 text-gray-400 dark:hover:text-green-700 group-hover:text-green-700 dark:text-white"
          aria-hidden="true"
        />
        {sidebarExpanded ? "Integrations" : " "}
      </Link>
      <Link
        to={"./settings"}
        className="group -mx-2 flex gap-x-3 rounded-md p-1 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 dark:hover:text-green-700 hover:text-green-700 dark:text-white"
      >
        <Cog6ToothIcon
          className="h-6 w-6 shrink-0 text-gray-400 dark:hover:text-green-700 group-hover:text-green-700 dark:text-white"
          aria-hidden="true"
        />
        {sidebarExpanded ? "Settings" : " "}
      </Link>
    </>
  );
};

export { SettingsNav };
