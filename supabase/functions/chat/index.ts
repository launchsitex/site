import { Configuration, OpenAIApi } from "npm:openai@^4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      throw new Error("OpenAI API key is not configured");
    }

    const configuration = new Configuration({
      apiKey,
    });
    const openai = new OpenAIApi(configuration);

    const { message } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({
          error: "Message is required",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for LaunchSite, a landing page creation service. Respond in Hebrew and be friendly and professional. Keep responses concise and focused on helping users with their landing page needs."
        },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    return new Response(
      JSON.stringify({
        message: completion.choices[0].message.content,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error details:", error);
    
    let errorMessage = "Failed to process request";
    let statusCode = 500;

    if (error.message === "OpenAI API key is not configured") {
      errorMessage = "Chat service is not properly configured";
      statusCode = 503;
    }

    return new Response(
      JSON.stringify({
        error: errorMessage,
      }),
      {
        status: statusCode,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});