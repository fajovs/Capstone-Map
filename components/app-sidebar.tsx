"use client"


import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client"

const data = {
  user: {
    name: "",
    email: "",
    avatar: "",
  },
  navMain: [
    {
      title: "Navigation Item #1",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Navigation Sub-Item #1",
          url: "#",
        },
        {
          title: "Navigation Sub-Item #2",
          url: "#",
        },
        {
          title: "Navigation Sub-Item #3",
          url: "#",
        },
      ],
    },
    {
      title: "Navigation Item #2",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Navigation Sub-Item #1",
          url: "#",
        },
        {
          title: "Navigation Sub-Item #2",
          url: "#",
        },
        {
          title: "Navigation Sub-Item #3",
          url: "#",
        },
      ],
    },
    {
      title: "Navigation Item #3",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Navigation Sub-Item #1",
          url: "#",
        },
        {
          title: "Navigation Sub-Item #2",
          url: "#",
        },
        {
          title: "Navigation Sub-Item #3",
          url: "#",
        },
        {
          title: "Navigation Sub-Item #4",
          url: "#",
        },
      ],
    },
    {
      title: "Navigation Item #4",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Navigation Sub-Item #1",
          url: "#",
        },
        {
          title: "Navigation Sub-Item #2",
          url: "#",
        },
        {
          title: "Navigation Sub-Item #3",
          url: "#",
        },
        {
          title: "Navigation Sub-Item #4",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "User Navigation #1",
      url: "#",
      icon: Frame,
    },
    {
      name: "User Navigation #2",
      url: "#",
      icon: PieChart,
    },
    {
      name: "User Navigation #3",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

    const supabase = getSupabaseBrowserClient();
    const [user, setUser] = useState<{ name?: string; email?: string; avatar?: string; role?: string } | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (user) {
            setUser({
            name: user.user_metadata?.full_name || "",
            email: user.email || "",
            avatar: user.user_metadata?.avatar_url || "",
            role: user.user_metadata?.role || "",
            });
        }
        };

    fetchUser();
  }, [supabase]);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Capstone Project</span>
                  <span className="truncate text-xs">System</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {user?.role == "admin" && <NavMain items={data.navMain}/>}
        {user?.role == "user" && <NavProjects projects={data.projects} />}
        
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user || {}} />
      </SidebarFooter>
    </Sidebar>
  )
}
