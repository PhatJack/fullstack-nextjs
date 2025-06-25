import { initContract } from "@ts-rest/core";
import { generateOpenApi } from "@ts-rest/open-api";
import { authContract } from "./auth";
const c = initContract();

export const appContracts = c.router(
  {
    auth: authContract,
  }
);

// Xuất OpenAPI spec
export const openApiDocument = generateOpenApi(appContracts, {
  info: {
    title: "My API",
    version: "1.0.0",
  },
	
});
