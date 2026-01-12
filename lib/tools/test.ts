import { geminiImageTool } from "./geminiImageGen";

await geminiImageTool.invoke(
  {
    prompt: "a futuristic robot",
  },
  {
    configurable: {
      writer: (event: any) => {
        console.log("EVENT:", event);
      },
    },
  }
);
