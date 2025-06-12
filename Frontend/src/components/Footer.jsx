import React from "react";
import { GraduationCap } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-white border-t w-full z-10 relative absolute right-0 bottom-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <img src="/logo.jpeg" alt="LJ University Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-gray-900">LJ University Access Hub</span>
            </div>
            <p className="text-sm text-gray-600">
              Your gateway to university services and resources.
            </p>
          </div>

          <div>
            <div className="font-bold text-gray-900 mb-3 ml-7 text-lg">Quick Links</div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-blue-600" style={{ textDecoration: "none", color: "gray" }}>
                  Course Catalog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600" style={{ textDecoration: "none", color: "gray" }}>
                  Academic Calendar
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600" style={{ textDecoration: "none", color: "gray" }}>
                  Student Handbook
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-gray-900 mb-3 ml-7 text-lg">Support</div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-blue-600" style={{ textDecoration: "none", color: "gray" }}>
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600" style={{ textDecoration: "none", color: "gray" }}>
                  IT Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600" style={{ textDecoration: "none", color: "gray" }}>
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-gray-900 mb-3 ml-7 text-lg">Emergency</div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Campus Security: (555) 123-4567</li>
              <li>Health Services: (555) 123-4568</li>
              <li>Crisis Hotline: (555) 123-4569</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} LJ University Access Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;