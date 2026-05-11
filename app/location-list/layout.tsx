import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { MapSidebar } from "@/components/map-sidebar"


export default function Layout({ children }: { children: React.ReactNode }) {
 


  return (
    <SidebarProvider>
      <MapSidebar/>
      {/* Add h-screen and overflow-hidden to prevent weird scrollbars */}
      <main className="relative flex-1 h-screen overflow-hidden">
        <div>

        <SidebarTrigger className="absolute top-4 left-4 z-[9999] pointer-events-auto bg-white" />
        </div>
        <div className="w-full h-800">
          {children}
        </div>


          
      </main>
    </SidebarProvider>
  )
}