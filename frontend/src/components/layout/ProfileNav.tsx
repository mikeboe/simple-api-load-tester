import {
  Menu,
  MenuButton,
  Transition,
  MenuItems,
  MenuItem,
} from "@headlessui/react";
import { Fragment } from "react";
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { UserImage } from "@rcktsftwr/components";
import { classNames } from "@rcktsftwr/components";

type ProfileNavProps = {
    userNav: { name: string; href: string; onClick?: any; subline?: string }[];
    user: any;
};

const ProfileNav = ({userNav, user}: ProfileNavProps) => {
    return (
    <>
      <Menu as="div" className="relative">
        <MenuButton className="-m-1.5 flex items-center p-1.5">
          <span className="sr-only">Open user menu</span>
          {/* <Avatar input={user} /> */}
          <div>
            {/* <Avatar inputValue={"test"} width={40} height={40}/> */}

            <UserImage size={"h-8 w-8"} user={user} />
          </div>

          {/* <img
                      className="h-8 w-8 rounded-full bg-gray-50"
                      src={user?.avatar?.avatarUrl}
                      alt=""
                    /> */}
          <span className="hidden lg:flex lg:items-center">
            <span
              className="ml-4 text-sm font-semibold leading-6 text-gray-900 dark:text-white"
              aria-hidden="true"
            >
              {user?.first_name}
            </span>
            <ChevronDownIcon
              className="ml-2 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </MenuButton>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems className="absolute bg-white right-0 z-50 mt-2.5 min-w-32 origin-top-right rounded-md dark:bg-gray-900 py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none dark:border-2 dark:border-gray-800">
            {userNav.map((item) => (
              <MenuItem key={item.name}>
                {({ active }) => (
                  <a
                    href={item.href}
                    onClick={item.onClick}
                    className={classNames(
                      active
                        ? "bg-gray-50 dark:bg-gray-700 dark:bg-gray-800"
                        : "",
                      "block px-3 py-1 text-sm leading-6 text-gray-900 dark:text-white "
                    )}
                  >
                    {item.name}
                    {item.subline && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {item.subline}
                      </p>
                    )}
                  </a>
                )}
              </MenuItem>
            ))}
          </MenuItems>
        </Transition>
      </Menu>
    </>
  );
};

export { ProfileNav };
