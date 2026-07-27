import { FiBell, FiUser, FiSettings, FiSearch } from "react-icons/fi";

export default function Navbar() {
  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center border-b border-gray-200 flex-wrap">
      <h1 className="text-lg sm:text-xl font-bold text-gray-800">Career Companion Admin</h1>

      <div className="flex items-center space-x-3 sm:space-x-4 mt-2 sm:mt-0">
        <button className="p-2 rounded-full hover:bg-gray-100 transition-all">
          <FiSearch size={20} className="text-gray-600" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 transition-all relative">
          <FiBell size={20} className="text-gray-600" />
          <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 transition-all">
          <FiUser size={20} className="text-gray-600" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 transition-all">
          <FiSettings size={20} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}

