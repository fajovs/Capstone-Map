"use client"

import * as React from "react"
import { ChevronRight, LayoutDashboard, LogIn } from "lucide-react"
import Link from "next/link"


import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client"

const data = {
  navMain: [
    {
      title: "Under Maintenance",
      url: "#",
      items: [
        { title: "ESSU Borongan CCS Building", url: "#" },
        { title: "Admin Building ESSU Borongan", url: "#" },
      ],
    },
    {
      title: "Resolved",
      url: "#",
      items: [
        { title: "Covered Walk ESSU Main", url: "#" },
        { title: "Pavilio ESSU Main", url: "#" },
      ],
    },

  ],
}

export function MapSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [mounted, setMounted] = React.useState(false)
  const [user, setUser] = React.useState<any>(null)
  const supabase = getSupabaseBrowserClient()

  React.useEffect(() => {
    setMounted(true)

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  // Prevents Hydration Error by not rendering auth-dependent UI on the server
  if (!mounted) {
    return (
      <Sidebar {...props}>
        <SidebarHeader className="h-12" />
        <SidebarContent className="gap-0" />
        <SidebarRail />
      </Sidebar>
    )
  }

  return (
    <Sidebar {...props} className="z-[50]"> 
      <SidebarHeader>
        <div className="p-4 pt-10 font-bold text-lg">Location List</div>
      </SidebarHeader>
      
      <SidebarContent className="gap-0">
        {data.navMain.map((item) => (
          <Collapsible
            key={item.title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer"
              >
                <CollapsibleTrigger>
                  {item.title}{" "}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((subItem) => (
                      <SidebarMenuItem key={subItem.title}>
                        <SidebarMenuButton asChild>
                          <a href={subItem.url}>{subItem.title}</a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4">
        {user ? (
          <Link href="/user" passHref className="w-full">
            <Button className="w-full  gap-2" variant="outline">
        
              Go to Dashboard
            </Button>
          </Link>
        ) : (
          <Link href="/login" passHref className="w-full">
            <Button className="w-full gap-2">
              Login Account
            </Button>
          </Link>
        )}
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  )
}