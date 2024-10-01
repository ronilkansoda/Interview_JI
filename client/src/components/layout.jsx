import React from "react";
import Sidebar from "./Sidebar";
import Header from "./header";
import { Outlet } from "react-router-dom";

const layout = () => {
    return (
        <div>
            <div className="flex">
                <Sidebar />
                <div className="w-full ml-16 md:ml-56">
                    <Header />
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default layout;
