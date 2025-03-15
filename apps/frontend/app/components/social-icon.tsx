import type React from "react"

interface SocialIconProps {
  href: string
  "aria-label": string
  icon: React.ReactNode
  target?: string
  rel?: string
}

export function SocialIcon({ href, "aria-label": ariaLabel, icon, target, rel }: SocialIconProps) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      target={target}
      rel={rel}
      className="text-gray-400 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-110"
    >
      {icon}
    </a>
  )
}

