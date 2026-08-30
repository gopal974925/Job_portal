import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export function Loading() {
  return (
    <div className="flex flex-col w-full items-center gap-4 justify-center mt-70">
      <Button disabled size="lg" >
        <Spinner data-icon="inline-start"  />
        Loading...
      </Button>
  
    </div>
  )
}
