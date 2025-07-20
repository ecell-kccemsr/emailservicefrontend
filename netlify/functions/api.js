const { MongoClient } = require("mongodb");

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  };

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  try {
    // Health check endpoint
    if (event.path === "/.netlify/functions/api/health") {
      return {
        statusCode: 200,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "OK",
          message: "E-Cell Email Service API is running",
          timestamp: new Date().toISOString(),
          environment: "production",
        }),
      };
    }

    // For other routes, you would typically forward to your main server logic
    // This is a placeholder - you would implement your API routes here
    // or proxy to your main backend server

    return {
      statusCode: 404,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Route not found" }),
    };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
    };
  }
};
