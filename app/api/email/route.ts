import { Resend } from "resend";
import { EmailTemplate } from "@/components/email/email-template";

const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);

export async function GET() {
  try {
    const { data, error } = await resend.emails.send({
      from: " Babe <yourbabe@loveyou.com>",
      to: ["enter email here"],
      subject: "enter subject here",
      react: EmailTemplate({ firstName: "enter name" }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    };

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  };
  
}
