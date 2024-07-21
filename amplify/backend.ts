import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  data,
  storage,
  auth,
});
backend.addOutput({
  auth: {
    aws_region: "us-east-1",
    user_pool_id: "us-east-1_AlsrRPKX9",
    user_pool_client_id: "2affhcklaauvrreeuk10o1n2tg",
    identity_pool_id: "us-east-1:0794c8d1-5289-4d46-b438-68e5240049ba",
    username_attributes: ["email"],
    standard_required_attributes: ["email"],
    user_verification_types: ["email"],
    unauthenticated_identities_enabled: true,
    password_policy: {
      min_length: 8,
      require_lowercase: true,
      require_uppercase: true,
      require_numbers: true,
      require_symbols: true,
    },
  },
});
