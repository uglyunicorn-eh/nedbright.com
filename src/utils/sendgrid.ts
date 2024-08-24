import type { APIContext } from "astro";


const sendgridFetch = async (
  path: string,
  init: RequestInit,
  { locals }: Pick<APIContext, 'locals'>,
) => {
  const {
    SENDGRID_API_KEY,
  } = locals.runtime.env;

  return await fetch(`https://api.sendgrid.com${path}`, {
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    ...init,
  }
  )
};


export const sendgridSend = async (
  email: string,
  templateId: string,
  dynamicTemplateData: any,
  { locals }: Pick<APIContext, 'locals'>,
) => {
  const {
    SENDGRID_FROM_EMAIL,
    SENDGRID_FROM_NAME,
    SENDGRID_REPLY_TO,
  } = locals.runtime.env;

  return await sendgridFetch("/v3/mail/send", {
    method: "POST",
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
  }, { locals });
};


export const subscribe = async (
  user: User,
  { locals }: Pick<APIContext, 'locals'>,
) => {
  const {
    SENDGRID_LIST_ID,
  } = locals.runtime.env;

  const [first_name, last_name] = (user.name || '').split(/\s+/, 2);

  return await sendgridFetch("/v3/marketing/contacts", {
    method: "PUT",
    body: JSON.stringify({
      list_ids: [SENDGRID_LIST_ID],
      contacts: [{
        email: user.sub,
        first_name,
        last_name,
        custom_fields: {
          name: user.name,
        },
      }],
    }),
  }, { locals });
};


export const unsubscribe = async (
  user: User,
  { locals }: Pick<APIContext, 'locals'>,
) => {
  const {
    SENDGRID_LIST_ID,
  } = locals.runtime.env;

  const searchEmailsResponse = await sendgridFetch("/v3/marketing/contacts/search/emails", {
    method: "POST",
    body: JSON.stringify({
      emails: [user.sub],
    }),
  }, { locals });
  if (searchEmailsResponse.status !== 200) {
    return;
  }

  const { result } = await searchEmailsResponse.json();
  const contactId = result[user.sub]?.contact?.id;
  if (contactId) {
    await sendgridFetch(`/v3/marketing/lists/${SENDGRID_LIST_ID}/contacts?contact_ids=${contactId}`, {
      method: "DELETE",
    }, { locals });
  }
};
