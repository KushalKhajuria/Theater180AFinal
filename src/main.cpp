#include <crow.h>
#include <fstream>
#include <sstream>
#include <string>

namespace {

std::string read_file(const std::string& path) {
    std::ifstream f(path, std::ios::binary);
    if (!f) return "";
    std::stringstream ss;
    ss << f.rdbuf();
    return ss.str();
}

std::string content_type_for(const std::string& path) {
    auto dot = path.find_last_of('.');
    if (dot == std::string::npos) return "application/octet-stream";
    const std::string ext = path.substr(dot + 1);
    if (ext == "html") return "text/html; charset=UTF-8";
    if (ext == "css") return "text/css; charset=UTF-8";
    if (ext == "js") return "application/javascript; charset=UTF-8";
    if (ext == "svg") return "image/svg+xml";
    if (ext == "png") return "image/png";
    if (ext == "jpg" || ext == "jpeg") return "image/jpeg";
    if (ext == "webp") return "image/webp";
    return "application/octet-stream";
}

crow::response serve_file(const std::string& path) {
    const std::string content = read_file(path);
    if (content.empty()) return crow::response(404, "Not found");
    crow::response res;
    res.code = 200;
    res.set_header("Content-Type", content_type_for(path));
    res.write(content);
    return res;
}

}  // namespace

int main() {
    crow::SimpleApp app;

    CROW_ROUTE(app, "/")([] { return serve_file("public/index.html"); });
    CROW_ROUTE(app, "/case-overview")([] { return serve_file("public/case-overview.html"); });
    CROW_ROUTE(app, "/machinal")([] { return serve_file("public/machinal.html"); });
    CROW_ROUTE(app, "/moments")([] { return serve_file("public/moments.html"); });
    CROW_ROUTE(app, "/performance-of-femininity")([] { return serve_file("public/systems-that-judge-women.html"); });
    CROW_ROUTE(app, "/systems-that-judge-women")([] { return serve_file("public/systems-that-judge-women.html"); });
    CROW_ROUTE(app, "/courtroom-as-theater")([] { return serve_file("public/courtroom-as-theater.html"); });
    CROW_ROUTE(app, "/themes")([] { return serve_file("public/themes.html"); });
    CROW_ROUTE(app, "/social-media")([] { return serve_file("public/social-media.html"); });
    CROW_ROUTE(app, "/opinions")([] { return serve_file("public/opinions.html"); });
    CROW_ROUTE(app, "/interviews")([] { return serve_file("public/interviews.html"); });
    CROW_ROUTE(app, "/synthesis")([] { return serve_file("public/synthesis.html"); });

    CROW_ROUTE(app, "/assets/<path>")
    ([](const std::string& file) {
        if (file.find("..") != std::string::npos) return crow::response(403, "Forbidden");
        return serve_file("public/assets/" + file);
    });

    app.port(18080).multithreaded().run();
}
