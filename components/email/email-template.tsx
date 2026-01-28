

interface EmailTemplateProps {
    firstName: string;
};


export function EmailTemplate({ firstName }: EmailTemplateProps) {
    return (
        <div>
            <h1>What's up {firstName}, reaching out to you via the interwebs of emailing</h1>
        </div>
    )
};