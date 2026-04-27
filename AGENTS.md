<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Specific Technical Notes

## 🤖 AI Assistant (Gemini)
- **Model ID:** Always use `gemini-2.5-flash`. The standard `gemini-1.5-flash` ID returns a 404 error on Vercel for this project.
- **System Prompts:** If using the Google Generative AI SDK, avoid passing `systemInstruction` in the `getGenerativeModel` constructor if connectivity issues occur. Instead, inject the system instructions as the first 'user' and 'model' turn in the chat history.

## 📂 File Handling on Vercel
- **Storage:** Place any files that need to be read at runtime (e.g., Knowledge Base files) in the `public/data/` directory.
- **Path Resolution:** Always use `path.join(process.cwd(), 'public', 'data', 'your-file.ext')` to ensure the Vercel serverless environment can locate the files correctly.

## 🔑 Environment Variables
- Ensure `GEMINI_API_KEY` is present in both local `.env` and Vercel Dashboard Environment Variables.
