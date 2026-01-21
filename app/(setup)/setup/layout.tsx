import { redirect } from "next/navigation";

export default async function SetupLayout({ children }: { children: React.ReactNode }) {
    const orgs = 1;
    
    if (orgs > 0) redirect('dashboard');

    return (
        <div>{children}</div>
    )
};