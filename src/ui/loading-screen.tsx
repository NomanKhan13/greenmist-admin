import { Loader } from "lucide-react"

// TODO: Later replace this with Shimmer UI
export default function LoadingScreen() {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center rounded-xl bg-background/50 backdrop-blur-sm">
      <Loader className="size-12 animate-spin text-primary" />
    </div>
  )
}
