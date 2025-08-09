// appwrite.js - Appwrite SDK initialization
import { Client } from "appwrite";

const client = new Client();

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
client.setEndpoint(endpoint).setProject(projectId);

export default client;
