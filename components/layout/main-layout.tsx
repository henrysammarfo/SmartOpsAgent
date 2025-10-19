"use client"

import type { ReactNode } from "react"
import { Sidebar } from "./sidebar"
import { TopNav } from "./top-nav"

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="pl-64">
        <TopNav />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
