import type { APIContext } from "astro";


export const sendgridSend = async (
  email: string,
  templateId: string,
  dynamicTemplateData: any,
  { locals }: Pick<APIContext, 'locals'>,
) => {
  const {
    SENDGRID_API_KEY,
    SENDGRID_FROM_EMAIL,
    SENDGRID_FROM_NAME,
    SENDGRID_REPLY_TO,
  } = locals.runtime.env;

  await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email }],
          dynamic_template_data: dynamicTemplateData,
        },
      ],
      from: {
        email: SENDGRID_FROM_EMAIL,
        name: SENDGRID_FROM_NAME,
      },
      reply_to: {
        email: SENDGRID_REPLY_TO,
      },
      template_id: templateId,
    }),
  });
};
