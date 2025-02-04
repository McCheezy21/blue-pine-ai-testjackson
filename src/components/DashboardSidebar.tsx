import { Building2, Users, HelpCircle, Settings, UserCog } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useNavigate } from "react-router-dom"
import { useIsMobile } from "@/hooks/use-mobile"
import { useIsAdmin } from "@/components/AuthGuard"

const baseMenuItems = [
  {
    title: "My Facility",
    path: "/dashboard/facility",
    icon: Building2,
  },
  {
    title: "Referrals",
    path: "/dashboard/referrals",
    icon: Users,
  },
  {
    title: "Support",
    path: "/dashboard/support",
    icon: HelpCircle,
  },
  {
    title: "Account Settings",
    path: "/dashboard/settings",
    icon: Settings,
  },
]

const adminMenuItems = [
  {
    title: "User Management",
    path: "/dashboard/admin",
    icon: UserCog,
  },
]

export function DashboardSidebar() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const isAdmin = useIsAdmin()

  const menuItems = isAdmin ? [...adminMenuItems, ...baseMenuItems] : baseMenuItems

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-4 border-b">
        <img 
          src="/lovable-uploads/408a9d6d-f5ef-4982-8932-336aecfb2915.png" 
          alt="Blue Pine AI Logo" 
          className="h-8 w-8"
        />
        <span className="text-lg font-semibold">Blue Pine AI</span>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => handleNavigation(item.path)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </div>
  )

  if (isMobile) {
    return sidebarContent
  }

  return <Sidebar>{sidebarContent}</Sidebar>
}