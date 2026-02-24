import { Navbar } from "@/components/dashboard/navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
            <Navbar />
            {children}
        </div>
    )
};