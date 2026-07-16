'use client';

export const CurrentYear = () => {

    return (
        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Aeghin. All rights reserved.</p>
    )
};