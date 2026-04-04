'use client'
import { Spinner } from "@/components/ui/spinner";
import dynamic from "next/dynamic";

const MapWithNoSSR = dynamic(() => import('../../components/map'), {
  ssr: false, 
  loading: () => (
  <div className="flex w-full h-full items-center justify-center">
    <Spinner />
  </div>
)
});


function LocationPage() {
  return (
      
        <MapWithNoSSR/>
    
        
  
    
  )
}

export default LocationPage