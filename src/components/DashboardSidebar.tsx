import { Building2, Users, Link2, Support } from "lucide-react"
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

const menuItems = [
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
    title: "Affiliates",
    path: "/dashboard/affiliates",
    icon: Link2,
  },
  {
    title: "Support",
    path: "/dashboard/support",
    icon: Support,
  },
]

export function DashboardSidebar() {
  const navigate = useNavigate()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
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
    </Sidebar>
  )
}