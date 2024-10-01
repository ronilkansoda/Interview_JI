import React, { useState } from "react";
import { useSelector } from 'react-redux';

// ICONS //
import { LuBox, LuUser, LuMessageSquare, LuCalendar } from "react-icons/lu";
import { FaSuitcase } from "react-icons/fa";
import { TbUsers, TbFileReport, TbReport, TbReportSearch, TbReportMoney, TbReportAnalytics, TbCalendarTime, TbManFilled, TbMan } from "react-icons/tb";
import { Link } from "react-router-dom";
import logo from '../assets/l1.png'
// ICONS //

const Sidebar = () => {
    const [activeLink, setActiveLink] = useState(0);
    const handleLinkClick = (index) => {
        setActiveLink(index);
    };
    const iconSize = 20
    const role = useSelector(state => state.user.currentUserDetail.role);
    console.log(role)

    const SIDEBAR_LINKS = [
        { id: 1, path: "/", name: "Dashboard", icon: <LuBox size={iconSize} /> },
        { id: 2, path: "/reports", name: "Past Reports", icon: <TbReportAnalytics size={iconSize} /> },
        { id: 3, path: "/payments", name: "Payment History", icon: <TbReportMoney size={iconSize} /> },
        { id: 4, path: "/pendingInterviews", name: "Taken interviews", icon: <TbCalendarTime size={iconSize} /> },
    ];

    const filteredLinks = SIDEBAR_LINKS.filter(link => {
        if (role === 'Interviewer') {
            return link.id !== 2
        }
        if (role === 'Candidate') {
            return link.id !== 3 && link.id !== 4;
        }
        // Default case if role is unknown or not handled
        return false;
    });
    return (
        <div className="w-16 md:w-56 fixed left-0 top-0 z-10 h-full boder-r pt-8 px-4 bg-[#cbdbf1]">
            {/* logo */}
            <div className="mb-8">
                <img src={logo} alt="logo" className="w-50 hidden md:flex" />
                {/* <img src="/logo_mini.svg" alt="logo" className="w-8 flex md:hidden" /> */}
            </div>
            {/* logo */}

            {/* Navigation Links */}
            <ul className="mt-6 space-y-6">
                {filteredLinks.map((link, index) => (
                    <li
                        key={index}
                        className={`font-medium rounded-md py-2 px-5 hover:bg-gray-100 hover:text-indigo-500 ${activeLink === index ? "bg-indigo-100 text-indigo-500" : ""
                            }`}
                    >
                        <Link
                            to={link.path}
                            className="flex justify-center md:justify-start items-center md:space-x-5"
                            onClick={() => handleLinkClick(index)}
                        >
                            <span>{link.icon}</span>
                            <span className="text-sm text-gray-500 hidden md:flex">
                                {link.name}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
            {/* Navigation Links */}

        </div>
    );
};

export default Sidebar;
