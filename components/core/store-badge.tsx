import { FC } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { SiShopify, SiVtex, SiAmazon } from "react-icons/si"
import { Store, CheckCircle, XCircle } from "lucide-react"

interface StoreBadgeProps {
  store: "vtex" | "shopify" | "mercadolibre" | "amazon"
  onClick: () => void
  connected?: boolean
}

const storeMeta = {
  vtex: {
    label: "VTEX",
    color: "bg-[#ff3f4b] text-white",
    icon: SiVtex,
  },
  shopify: {
    label: "Shopify",
    color: "bg-[#96bf48] text-white",
    icon: SiShopify,
  },
  mercadolibre: {
    label: "MercadoLibre",
    color: "bg-[#ffe600] text-black border border-gray-300",
    // TODO: Replace Store icon with MercadoLibre SVG/logo when available
    icon: Store,
  },
  amazon: {
    label: "Amazon",
    color: "bg-[#232f3e] text-[#ff9900]",
    icon: SiAmazon,
  },
}

export const StoreBadge: FC<StoreBadgeProps> = ({ store, onClick, connected }) => {
  const meta = storeMeta[store]
  const Icon = meta.icon
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("focus:outline-none relative group", !connected && "opacity-50 grayscale")}
      aria-label={meta.label}
    >
      <Badge className={cn("gap-2 px-4 py-2 text-base cursor-pointer", meta.color)}>
        <Icon className="w-5 h-5" />
        {meta.label}
        {connected ? (
          <CheckCircle className="w-4 h-4 ml-2 text-green-500" />
        ) : (
          <XCircle className="w-4 h-4 ml-2 text-muted-foreground" />
        )}
      </Badge>
    </button>
  )
} 