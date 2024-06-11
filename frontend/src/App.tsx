import { Route, Routes, useLocation } from "react-router-dom";
import { Outlet } from "react-router";
import CreateLoadTest from "./components/CreateLoadTest";
import LoadTest from "./components/LoadTest";
import { AppShell, Logo, PageLayout } from "@rcktsftwr/components";
import { BanknotesIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
import { MainNavigation } from "./components/layout/MainNavigation";
import { Headline3 } from "@rcktsftwr/components";
import { ProfileNav } from "./components/layout/ProfileNav";
import { SettingsNav } from "./components/layout/SettingsNav";
import { Toaster } from "react-hot-toast";

const userNav = [{ name: "Settings", href: "/settings" }];

const user = {
  first_name: "John",
  last_name: "Doe",
  email: "test@test.com",
  avatar: {
    avatarUrl: "https://rocketcrm.io/_astro/RcktLogoDark.BYeie3VH.png",
  },
};

const App = () => {
  const location = useLocation();
  const current = location.pathname.split("/")[1];

  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(true);

  useEffect(() => {
    sidebarStatus();
  }, []);

  const sidebarStatus = () => {
    if (!localStorage.getItem("sidebar")) {
      setSidebarExpanded(true);
      document.getElementById("sidebar")?.classList.remove("lg:w-16");
      document.getElementById("sidebar")?.classList.add("lg:w-56");
      document.getElementById("contentContainer")?.classList.remove("lg:pl-16");
      document.getElementById("contentContainer")?.classList.add("lg:pl-56");
    }

    if (localStorage.getItem("sidebar") === "true") {
      console.log("OPEN");
      setSidebarExpanded(true);
      document.getElementById("sidebar")?.classList.remove("lg:w-16");
      document.getElementById("sidebar")?.classList.add("lg:w-56");
      document.getElementById("contentContainer")?.classList.remove("lg:pl-16");
      document.getElementById("contentContainer")?.classList.add("lg:pl-56");
    }
    if (localStorage.getItem("sidebar") === "false") {
      console.log("CLOSED");
      setSidebarExpanded(false);
      document.getElementById("sidebar")?.classList.add("lg:w-16");
      document.getElementById("sidebar")?.classList.remove("lg:w-56");
      document.getElementById("contentContainer")?.classList.add("lg:pl-16");
      document.getElementById("contentContainer")?.classList.remove("lg:pl-56");
    }
  };

  const mainNav = [
    {
      sectionName: "Load Tests",
      items: [
        {
          name: "Create Load Test",
          to: "/",
          icon: BanknotesIcon,
          current: current === "/",
        },
      ],
    },
  ];

  return (
    <>
      <Toaster
        position="bottom-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          success: {
            icon: "👏",
          },
          error: {
            icon: "😢",
          },
        }}
      />
      <Routes>
        <Route
          element={
            <AppShell
              name={<Headline3>API Load Test</Headline3>}
              outlet={<Outlet />}
              sidebarExpanded={sidebarExpanded}
              setSidebarExpanded={setSidebarExpanded}
              mainNav={
                <MainNavigation
                  mainNav={mainNav}
                  sidebarExpanded={sidebarExpanded}
                />
              }
              logo={
                <Logo
                  alt="Logo"
                  logoDark="https://rocketcrm.io/_astro/RcktLogoDark.BYeie3VH.png"
                  logoLight="https://rocketcrm.io/_astro/RcktLogoDark.BYeie3VH.png"
                  height="h-6"
                />
              }
              profileNav={<ProfileNav userNav={userNav} user={user} />}
              settingsNav={<SettingsNav sidebarExpanded={sidebarExpanded} />}
            />
          }
        >
          <Route element={<PageLayout outlet={<Outlet />} />}>
            <Route path="/" element={<CreateLoadTest />} />
            <Route path="/:id" element={<LoadTest />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
