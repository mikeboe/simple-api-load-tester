import { Outlet } from "react-router";

const Layout = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <div className="py-10">
                <main>
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div >
    );
}

export default Layout;