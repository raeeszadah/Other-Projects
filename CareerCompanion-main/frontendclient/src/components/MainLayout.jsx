import Sidebar from "./Sidebar";

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 md:ml-64 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
