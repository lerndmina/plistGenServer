import { serve } from "bun";

interface PlistQuery {
  bundleid: string;
  name: string;
  version: string;
  fetchurl: string;
}

const PLIST_TEMPLATE = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>items</key>
    <array>
        <dict>
            <key>assets</key>
            <array>
                <dict>
                    <key>kind</key>
                    <string>software-package</string>
                    <key>url</key>
                    <string>{fetchurl}</string>
                </dict>
            </array>
            <key>metadata</key>
            <dict>
                <key>bundle-identifier</key>
                <string>{bundleid}</string>
                <key>bundle-version</key>
                <string>{version}</string>
                <key>kind</key>
                <string>software</string>
                <key>title</key>
                <string>{name}</string>
            </dict>
        </dict>
    </array>
</dict>
</plist>`;

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const hostname = process.env.HOSTNAME || "0.0.0.0";

const server = serve({
  port,
  hostname,
  async fetch(req) {
    const url = new URL(req.url);

    // Root endpoint
    if (url.pathname === "/" && req.method === "GET") {
      return new Response(
        JSON.stringify({
          message: "Server is running",
          endpoints: {
            "/": "This documentation",
            "/genPlist": {
              method: "POST",
              description: "Generate a manifest.plist file",
              query: {
                bundleid: "Your app bundle identifier",
                name: "App name",
                version: "App version",
                fetchurl: "App IPA download URL",
              },
            },
          },
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // genPlist endpoint
    if (url.pathname === "/genPlist" && req.method === "GET") {
      const params = Object.fromEntries(url.searchParams);

      // Validate required fields
      if (!params.bundleid || !params.name || !params.version || !params.fetchurl) {
        return new Response(JSON.stringify({ error: "Missing required fields, refer to documentation on /" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const plistXml = PLIST_TEMPLATE.replace("{bundleid}", params.bundleid).replace("{version}", params.version).replace("{name}", params.name).replace("{fetchurl}", params.fetchurl);

      console.log({ message: "Successfully generated manifest.plist", params, time: new Date() });

      return new Response(plistXml, {
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Disposition": "attachment; filename=manifest.plist",
        },
      });
    }

    // Handle 404
    return new Response("Not Found", { status: 404 });
  },
});
const nowTime = new Date();
console.log(`[${nowTime}] Server running (http) ${server.hostname}:${server.port} 🚀`);
