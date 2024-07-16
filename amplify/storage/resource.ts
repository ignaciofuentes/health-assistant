import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "uploadedFiles",
  access: (allow) => {
    return {
      "files/*": [allow.entity("identity").to(["read", "write", "delete"])],
    };
  },
});
