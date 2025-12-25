
import { UserButton } from "@clerk/nextjs";


const DashboardPage = () => {
    return (
        <>
            <div>Dashboard Page, only if authenticated.</div>
            <UserButton />
        </>
    )
};

export default DashboardPage;