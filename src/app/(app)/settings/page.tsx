import { redirect } from "next/navigation";
import { auth, prisma } from "@/auth";
import { User, Mail, Shield, Bell, Laptop } from "lucide-react";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      _count: {
        select: { materials: true }
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 md:py-12 w-full">
      <header className="mb-10">
        <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#111827] tracking-tight">
          Settings
        </h1>
        <p className="text-base text-[#6B7280] mt-3 font-sans max-w-xl">
          Manage your account preferences and personal information.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Settings Navigation (Mock) */}
        <div className="md:col-span-1">
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-white text-[#111827] shadow-sm border border-[#E5E7EB] transition-colors">
              <User className="w-4 h-4 text-[#111827]" />
              Account Profile
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827] transition-colors">
              <Shield className="w-4 h-4 text-[#9CA3AF]" />
              Security
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827] transition-colors">
              <Bell className="w-4 h-4 text-[#9CA3AF]" />
              Notifications
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827] transition-colors">
              <Laptop className="w-4 h-4 text-[#9CA3AF]" />
              Appearance
            </button>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-2 space-y-8">
          
          <section className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-[#E5E7EB] bg-[#F9FAFB]">
              <h3 className="font-serif text-xl font-medium text-[#111827]">Account Information</h3>
            </div>
            <div className="p-6 space-y-6">
              
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={user.name || "N/A"}
                    className="pl-10 w-full bg-gray-50 border border-[#E5E7EB] rounded-lg py-2.5 px-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
                  />
                </div>
                <p className="mt-2 text-xs text-[#6B7280]">Your name is synced from your login provider.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    readOnly
                    value={user.email}
                    className="pl-10 w-full bg-gray-50 border border-[#E5E7EB] rounded-lg py-2.5 px-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
                  />
                </div>
              </div>

            </div>
          </section>

          <section className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-[#E5E7EB] bg-[#F9FAFB]">
              <h3 className="font-serif text-xl font-medium text-[#111827]">Usage Statistics</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB]">
                  <p className="text-sm font-medium text-[#6B7280] mb-1">Account Created</p>
                  <p className="font-medium text-[#111827]">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB]">
                  <p className="text-sm font-medium text-[#6B7280] mb-1">Total Materials</p>
                  <p className="font-medium text-[#111827]">{user._count.materials}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-red-50 rounded-2xl border border-red-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-red-200">
              <h3 className="font-serif text-xl font-medium text-red-800">Danger Zone</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-red-600 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button className="px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors">
                Delete Account
              </button>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
