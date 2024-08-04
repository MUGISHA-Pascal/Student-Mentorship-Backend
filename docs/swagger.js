import swaggerAutogen from "swagger-autogen";
import config from "./config.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const doc = {
  info: {
    version: "2.0.0",
    title: "GOYA",
    description: "An API for managing a  certain user",
    contact: {
      name: "API Support",
      email: "goya@gmail.com",
    },
  },
  host: config.swagger.host,
  basePath: "/",
  schemes: ["http"],
  consumes: ["application/json"],
  produces: ["application/json"],
  securityDefinitions: {},
  definitions: {
    SuccessResponse: {
      success: true,
      status: 200,
    },
    ErrorResponse500: {
      success: false,
      message: "Server Issue",
      status: 500,
    },
    ErrorResponse404: {
      success: false,
      message: "Not found",
      status: 404,
    },
    Location: {
      name: "Kenya",
      icon: "",
    },
    Language: {
      name: "",
      icon: "",
      isDefault: ""
    },
    ReferralSource: {
      name: "",
    },
    SupportContact: {
      contact: ""
    },
    ServiceCategory: {
      type: "",
      message: ""
    },
    Notification: {
      type: "",
      message: ""
    },
    Support: {
      title: "",
      description: ""
    },
  },
};

const options = {
  openapi: "3.0.0",
  language: "en-US",
  disableLogs: false,
  autoHeaders: false,
  autoQuery: false,
  autoBody: false,
};

const outputFile = path.resolve(__dirname, "./swagger.json");
const endpointsFiles = [
  // path.resolve(__dirname, "../routers/auth-router.js"),
  "../index.js",
  "../routers/*.js",
  "../controllers/*.js"
  // path.resolve(__dirname, "../controllers/auth-controller.js"),
  // path.resolve(__dirname, "../controllers/user-controller.js"),
];

swaggerAutogen(options)(outputFile, endpointsFiles, doc).then(()=>{
});

