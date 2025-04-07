import { defineFunction } from "@aws-amplify/backend";

export const hogeschedule = defineFunction({
  name: "hogeschedule",
  schedule: [
    "every 1m"
  ],
});