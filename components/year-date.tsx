'use client';

export const CurrentYear = () => {

    return (
        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} NHW. All rights reserved.</p>
    )
};