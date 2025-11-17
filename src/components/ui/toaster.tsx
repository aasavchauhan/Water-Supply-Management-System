import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "rounded-xl shadow-xl border-2",
          title: "font-semibold",
          description: "text-sm opacity-90",
          actionButton: "bg-primary text-white",
          cancelButton: "bg-muted",
          error: "bg-red-50 border-red-200 text-red-900",
          success: "bg-green-50 border-green-200 text-green-900",
          warning: "bg-orange-50 border-orange-200 text-orange-900",
          info: "bg-blue-50 border-blue-200 text-blue-900",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
