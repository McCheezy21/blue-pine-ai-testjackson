
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FooterProps {
  logo: React.ReactNode | null
  brandName: string
  socialLinks: Array<{
    icon: React.ReactNode
    href: string
    label: string
  }>
  mainLinks: Array<{
    href: string
    label: string
  }>
  legalLinks: Array<{
    href: string
    label: string
  }>
  copyright: {
    text: string
    license?: string
  }
  className?: string
}

export function Footer({
  logo,
  brandName,
  socialLinks,
  mainLinks,
  legalLinks,
  copyright,
  className
}: FooterProps) {
  return (
    <footer className="bg-primary text-primary-foreground pb-1.5 pt-5 lg:pb-2 lg:pt-7">
      <div className="px-3 lg:px-6">
        <div className="md:flex md:items-start md:justify-between">
          {logo && (
            <a
              href="/"
              className="flex items-center gap-x-2"
              aria-label={brandName}
            >
              {logo}
              <span className="font-bold text-xl">{brandName}</span>
            </a>
          )}
          <ul className="flex list-none mt-1.5 md:mt-0 space-x-3">
            {socialLinks.map((link, i) => (
              <li key={i}>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  asChild
                >
                  <a href={link.href} target="_blank" aria-label={link.label}>
                    {link.icon}
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-t border-primary-foreground/10 mt-1.5 pt-1.5 md:mt-1.5 md:pt-2 lg:grid lg:grid-cols-10">
          <nav className="lg:mt-0 lg:col-[4/11]">
            <ul className="list-none flex flex-wrap -my-1 -mx-2 lg:justify-end">
              {mainLinks.map((link, i) => (
                <li key={i} className="my-1 mx-2 shrink-0">
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className={cn("mt-1.5 lg:mt-0 lg:col-[4/11]", className)}>
            <ul className="list-none flex flex-wrap -my-1 -mx-3 justify-end">
              {legalLinks.map((link, i) => (
                <li key={i} className="my-1 mx-3 shrink-0">
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/70 underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-1.5 text-sm leading-6 text-primary-foreground/70 whitespace-nowrap lg:mt-0 lg:row-[1/3] lg:col-[1/4] text-left">
            <div>{copyright.text}</div>
            {copyright.license && <div>{copyright.license}</div>}
          </div>
        </div>
      </div>
    </footer>
  )
}
